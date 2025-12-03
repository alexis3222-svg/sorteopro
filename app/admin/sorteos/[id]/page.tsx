"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { EditSorteoForm } from "@/components/EditSorteoForm";
import { supabase } from "@/lib/supabaseClient";

export default function EditSorteoPage() {
    // Lee el parámetro [id] de la URL usando useParams
    const params = useParams<{ id: string }>();
    const id = params?.id;

    const [sorteo, setSorteo] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        // Si aún no tenemos id, no hacemos nada
        if (!id) return;

        const fetchSorteo = async () => {
            const { data, error } = await supabase
                .from("sorteos")
                .select("*")
                .eq("id", id)
                .single();

            if (error || !data) {
                console.error(error);
                setErrorMsg("No se pudo cargar la información del sorteo.");
            } else {
                setSorteo(data);
            }
            setLoading(false);
        };

        fetchSorteo();
    }, [id]); // 👈 dependencia correcta

    if (loading) {
        return (
            <div className="p-4 text-sm text-neutral-300">
                Cargando datos del sorteo...
            </div>
        );
    }

    if (errorMsg || !sorteo) {
        return (
            <div className="p-4 text-sm text-red-400">
                {errorMsg ?? "Sorteo no encontrado."}
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
            <h1 className="text-2xl font-bold text-white">Editar sorteo</h1>
            <EditSorteoForm sorteo={sorteo} />
        </div>
    );
}
