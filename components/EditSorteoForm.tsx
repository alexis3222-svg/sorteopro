"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type EstadoSorteo = "activo" | "pausado" | "finalizado";

interface EditSorteoFormProps {
    sorteo: {
        id: string;
        titulo: string;
        descripcion: string | null;
        imagen_url: string | null;
        total_numeros: number;
        numeros_vendidos: number;
        precio_numero: number;
        estado: EstadoSorteo;
        actividad_numero: number | null;
    };
}

export function EditSorteoForm({ sorteo }: EditSorteoFormProps) {
    const [titulo, setTitulo] = useState(sorteo.titulo ?? "");
    const [descripcion, setDescripcion] = useState(sorteo.descripcion ?? "");
    const [precioNumero, setPrecioNumero] = useState(
        Number(sorteo.precio_numero) || 0
    );
    const [totalNumeros, setTotalNumeros] = useState(
        Number(sorteo.total_numeros) || 0
    );
    const [estado, setEstado] = useState<EstadoSorteo>(sorteo.estado);
    const [imagenUrl, setImagenUrl] = useState(sorteo.imagen_url ?? "");
    const [actividadNumero, setActividadNumero] = useState<number>(
        sorteo.actividad_numero ?? 1
    );

    const [imagenFile, setImagenFile] = useState<File | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const validarFormulario = () => {
        if (!titulo.trim()) return "El título es obligatorio.";
        if (!descripcion.trim()) return "La descripción es obligatoria.";

        if (isNaN(precioNumero) || precioNumero <= 0) {
            return "El precio por número debe ser mayor a 0.";
        }

        if (!Number.isFinite(totalNumeros) || totalNumeros <= 0) {
            return "El total de números debe ser mayor a 0.";
        }

        if (totalNumeros < sorteo.numeros_vendidos) {
            return `No puedes poner menos de ${sorteo.numeros_vendidos} números, ya están vendidos.`;
        }

        if (!["activo", "pausado", "finalizado"].includes(estado)) {
            return "Estado inválido.";
        }

        if (!Number.isFinite(actividadNumero) || actividadNumero <= 0) {
            return "El número de actividad debe ser mayor o igual a 1.";
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        const errorValidacion = validarFormulario();
        if (errorValidacion) {
            setErrorMsg(errorValidacion);
            return;
        }

        setIsSaving(true);

        try {
            let nuevaImagenUrl = imagenUrl;

            if (imagenFile) {
                const fileExt = imagenFile.name.split(".").pop();
                const filePath = `sorteos/${sorteo.id}/portada.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("sorteos")
                    .upload(filePath, imagenFile, {
                        cacheControl: "3600",
                        upsert: true,
                    });

                if (uploadError) {
                    setErrorMsg(
                        uploadError.message ||
                        "Error al subir la imagen. Intenta de nuevo."
                    );
                    setIsSaving(false);
                    return;
                }

                const { data: publicUrlData } = supabase.storage
                    .from("sorteos")
                    .getPublicUrl(filePath);

                nuevaImagenUrl = publicUrlData.publicUrl;
            }

            const precioLimpio = Number(precioNumero);
            const totalLimpio = Number(totalNumeros);

            const { error } = await supabase
                .from("sorteos")
                .update({
                    titulo,
                    descripcion,
                    precio_numero: precioLimpio,
                    total_numeros: totalLimpio,
                    estado,
                    imagen_url: nuevaImagenUrl || null,
                    actividad_numero: actividadNumero,
                })
                .eq("id", sorteo.id);

            if (error) {
                setErrorMsg(
                    error.message ||
                    "Ocurrió un error al guardar los cambios. Revisa las políticas de Supabase (RLS) y los datos enviados."
                );
            } else {
                setSuccessMsg("Cambios guardados con éxito ✅");
                setErrorMsg(null);
            }
        } catch (err: any) {
            setErrorMsg(
                err?.message || "Ocurrió un error inesperado al guardar los cambios."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImagenFile(file);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-lg"
        >
            <a
                href="/admin/sorteos"
                className="inline-flex items-center text-sm text-neutral-300 hover:text-white transition"
            >
                ← Volver a sorteos
            </a>

            <h2 className="text-xl font-semibold text-white">
                Editar sorteo: <span className="text-orange-400">{sorteo.titulo}</span>
            </h2>

            {errorMsg && (
                <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                    {errorMsg}
                </div>
            )}
            {successMsg && (
                <div className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200">
                    {successMsg}
                </div>
            )}

            {/* Título */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-neutral-200">
                    Título del sorteo
                </label>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    placeholder="Ej: Go Kart + Moto KTM + $200"
                />
            </div>

            {/* Número de actividad */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-neutral-200">
                    Número de actividad
                </label>
                <input
                    type="number"
                    min={1}
                    value={actividadNumero}
                    onChange={(e) => setActividadNumero(parseInt(e.target.value || "1"))}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    placeholder="Ej: 1, 2, 3..."
                />
                <p className="text-xs text-neutral-400">
                    Este número se muestra como <span className="font-semibold">ACTIVIDAD #{actividadNumero || "X"}</span> en la página pública.
                </p>
            </div>

            {/* Descripción */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-neutral-200">
                    Descripción
                </label>
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    placeholder="Describe el premio, condiciones del sorteo, etc."
                />
            </div>

            {/* Precio y total de números */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-neutral-200">
                        Precio por número (USD)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={precioNumero}
                        onChange={(e) => setPrecioNumero(parseFloat(e.target.value))}
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-neutral-200">
                        Total de números
                    </label>
                    <input
                        type="number"
                        min={sorteo.numeros_vendidos}
                        value={totalNumeros}
                        onChange={(e) => setTotalNumeros(parseInt(e.target.value || "0"))}
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    />
                    <p className="text-xs text-neutral-400">
                        Vendidos:{" "}
                        <span className="font-semibold text-orange-300">
                            {sorteo.numeros_vendidos}
                        </span>
                    </p>
                </div>
            </div>

            {/* Estado */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-neutral-200">
                    Estado del sorteo
                </label>
                <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as EstadoSorteo)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                >
                    <option value="activo">Activo</option>
                    <option value="pausado">Pausado</option>
                    <option value="finalizado">Finalizado</option>
                </select>
            </div>

            {/* URL de la imagen */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-neutral-200">
                    URL de la imagen (opcional)
                </label>
                <input
                    type="text"
                    value={imagenUrl}
                    onChange={(e) => setImagenUrl(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    placeholder="https://..."
                />
                {imagenUrl && (
                    <div className="mt-2">
                        <p className="mb-1 text-xs text-neutral-400">Vista previa:</p>
                        <img
                            src={imagenUrl}
                            alt="Imagen del sorteo"
                            className="h-40 w-full rounded-lg object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Subir nueva imagen */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-neutral-200">
                    Subir nueva imagen (opcional)
                </label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="block w-full text-sm text-neutral-300 file:mr-3 file:rounded-md file:border-0 file:bg-orange-500 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-orange-400"
                />
                <p className="text-xs text-neutral-500">
                    Si subes una imagen, se guardará en el bucket de Supabase y se
                    actualizará la <span className="font-semibold">imagen_url</span>.
                </p>
            </div>

            {/* Botón guardar */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                </button>
            </div>
        </form>
    );
}
