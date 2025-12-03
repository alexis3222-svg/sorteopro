// app/admin/page.tsx
import { supabase } from "../../lib/supabaseClient";
import { Anton } from "next/font/google";
import { CreateSorteoForm } from "../../components/CreateSorteoForm";
import Link from "next/link";

const anton = Anton({
    subsets: ["latin"],
    weight: "400",
});

type SorteoRow = {
    id: string;
    titulo: string | null;
    estado: "activo" | "pausado" | "finalizado" | null;
    total_numeros: number | null;
    numeros_vendidos: number | null;
    actividad_numero: number | null;
};

export default async function AdminPage() {
    const { data, error } = await supabase
        .from("sorteos")
        .select("id, titulo, estado, total_numeros, numeros_vendidos, actividad_numero")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error cargando sorteos:", error.message);
    }

    const sorteos = (data || []) as SorteoRow[];

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
            <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1
                        className={`${anton.className} text-2xl md:text-3xl uppercase tracking-[0.18em] text-[#2b2b2b]`}
                    >
                        Panel administrador
                    </h1>
                    <p className="text-sm text-slate-600">
                        Crea y gestiona tus actividades de sorteo.
                    </p>
                </div>

                <Link
                    href="/admin/pedidos"
                    className="mt-2 inline-flex items-center justify-center rounded-lg bg-[#FF7F00] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-950 hover:bg-[#ff9933]"
                >
                    Ver pedidos
                </Link>
            </header>


            <CreateSorteoForm />

            <section className="overflow-x-auto rounded-2xl bg-[#161922] p-4 shadow-md">
                <table className="min-w-full text-left text-xs md:text-sm text-slate-200">
                    <thead className="border-b border-white/10 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                        <tr>
                            <th className="px-2 py-3 text-center">Actividad</th>
                            <th className="px-2 py-3">ID</th>
                            <th className="px-2 py-3">Título</th>
                            <th className="px-2 py-3">Estado</th>
                            <th className="px-2 py-3 text-right">Vendidos</th>
                            <th className="px-2 py-3 text-right">Total</th>
                            <th className="px-2 py-3 text-right">% Progreso</th>
                            <th className="px-2 py-3 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorteos.map((sorteo) => {
                            const vendidos = sorteo.numeros_vendidos ?? 0;
                            const total = sorteo.total_numeros ?? 0;
                            const progreso =
                                total > 0 ? ((vendidos / total) * 100).toFixed(2) : "0.00";

                            return (
                                <tr
                                    key={sorteo.id}
                                    className="border-b border-white/5 hover:bg-white/5"
                                >
                                    <td className="px-2 py-3 text-center text-[11px] md:text-xs font-semibold text-slate-200">
                                        #{sorteo.actividad_numero ?? "-"}
                                    </td>
                                    <td className="px-2 py-3 text-[11px] md:text-xs font-semibold text-slate-300">
                                        {sorteo.id.slice(0, 8)}
                                    </td>
                                    <td className="px-2 py-3 text-[11px] md:text-xs">
                                        {sorteo.titulo || "Sin título"}
                                    </td>
                                    <td className="px-2 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${sorteo.estado === "activo"
                                                ? "bg-green-500/15 text-green-300 border border-green-500/40"
                                                : sorteo.estado === "pausado"
                                                    ? "bg-yellow-500/10 text-yellow-300 border border-yellow-500/40"
                                                    : "bg-red-500/10 text-red-300 border border-red-500/40"
                                                }`}
                                        >
                                            {sorteo.estado || "desconocido"}
                                        </span>
                                    </td>
                                    <td className="px-2 py-3 text-right text-[11px] md:text-xs">
                                        {vendidos}
                                    </td>
                                    <td className="px-2 py-3 text-right text-[11px] md:text-xs">
                                        {total}
                                    </td>
                                    <td className="px-2 py-3 text-right text-[11px] md:text-xs">
                                        {progreso}%
                                    </td>
                                    <td className="px-2 py-3 text-center">
                                        <Link
                                            href={`/admin/sorteos/${sorteo.id}`}
                                            className="inline-flex items-center justify-center rounded-lg bg-[#FF7F00] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-950 hover:bg-[#ff9933] mr-2"
                                        >
                                            Editar
                                        </Link>
                                        <Link
                                            href="/"
                                            className="inline-flex items-center justify-center rounded-lg border border-white/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-100 hover:bg-white/10"
                                        >
                                            Ver pública
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })}

                        {sorteos.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-2 py-6 text-center text-[12px] text-slate-400"
                                >
                                    No hay actividades registradas aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
