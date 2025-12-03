// components/CreateSorteoForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export function CreateSorteoForm() {
    const router = useRouter();

    const [titulo, setTitulo] = useState("");
    const [totalNumeros, setTotalNumeros] = useState(10000);
    const [precioNumero, setPrecioNumero] = useState("1.50"); // string editable
    const [estado, setEstado] = useState<"activo" | "pausado" | "finalizado">(
        "activo"
    );

    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMensaje(null);
        setErrorMsg(null);

        // Normalizar y validar precio
        const precioNormalizado = precioNumero.replace(",", ".").trim();
        const precio = Number(precioNormalizado);

        if (!precioNormalizado || Number.isNaN(precio) || precio <= 0) {
            setErrorMsg("Ingresa un precio válido mayor a 0 (ej: 0.50, 1.50).");
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.from("sorteos").insert({
                // 👇 YA NO ENVIAMOS 'actividad'
                titulo: titulo || null,
                total_numeros: totalNumeros,
                numeros_vendidos: 0,
                precio_numero: precio,
                estado,
            });

            if (error) {
                console.error(error);
                setErrorMsg(`Error al crear el sorteo: ${error.message}`);
                return;
            }

            setMensaje("Sorteo creado correctamente ✅");

            // limpiar formulario
            setTitulo("");
            setTotalNumeros(10000);
            setPrecioNumero("1.50");
            setEstado("activo");

            // refrescar datos del server (tabla)
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setErrorMsg("Ocurrió un error inesperado.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-white/10 bg-[#161922] p-4 md:p-5 shadow-md"
        >
            <h2 className="text-sm md:text-base font-semibold text-slate-100">
                Crear nuevo sorteo
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
                {/* Título */}
                <div className="space-y-1 md:col-span-2">
                    <label className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Título del sorteo
                    </label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        placeholder="Ej: Carro + moto + billete"
                        className="w-full rounded-lg border border-white/10 bg-[#0f1117] px-3 py-2 text-sm text-slate-100 outline-none focus:border-[#FF7F00]"
                    />
                </div>

                {/* Total de números */}
                <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Total de números
                    </label>
                    <input
                        type="number"
                        min={1}
                        value={totalNumeros}
                        onChange={(e) => setTotalNumeros(Number(e.target.value))}
                        className="w-full rounded-lg border border-white/10 bg-[#0f1117] px-3 py-2 text-sm text-slate-100 outline-none focus:border-[#FF7F00]"
                    />
                </div>

                {/* Precio por número */}
                <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Precio por número (USD)
                    </label>
                    <input
                        type="text"
                        inputMode="decimal"
                        placeholder="1.50"
                        value={precioNumero}
                        onChange={(e) => {
                            let val = e.target.value.replace(",", ".");
                            val = val.replace(/[^0-9.]/g, ""); // solo números y punto
                            const parts = val.split(".");
                            if (parts.length > 2) {
                                val = parts[0] + "." + parts.slice(1).join("");
                            }
                            setPrecioNumero(val);
                        }}
                        className="w-full rounded-lg border border-white/10 bg-[#0f1117] px-3 py-2 text-sm text-slate-100 outline-none focus:border-[#FF7F00]"
                    />
                </div>

                {/* Estado */}
                <div className="space-y-1">
                    <label className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        Estado
                    </label>
                    <select
                        value={estado}
                        onChange={(e) =>
                            setEstado(e.target.value as "activo" | "pausado" | "finalizado")
                        }
                        className="w-full rounded-lg border border-white/10 bg-[#0f1117] px-3 py-2 text-sm text-slate-100 outline-none focus:border-[#FF7F00]"
                    >
                        <option value="activo">Activo</option>
                        <option value="pausado">Pausado</option>
                        <option value="finalizado">Finalizado</option>
                    </select>
                </div>
            </div>

            {/* Mensajes */}
            {mensaje && <p className="text-xs text-emerald-400">{mensaje}</p>}
            {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

            <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center rounded-xl bg-[#FF7F00] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950 hover:bg-[#ff9933] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Creando..." : "Crear sorteo"}
            </button>
        </form>
    );
}
