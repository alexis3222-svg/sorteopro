"use client";

import { cn } from "@/lib/utils";

interface TicketPackageCardProps {
    name: string;
    tickets: number;
    bonusTickets?: number;
    price: number; // en dólares
    highlight?: boolean;
}

export function TicketPackageCard({
    name,
    tickets,
    bonusTickets = 0,
    price,
    highlight,
}: TicketPackageCardProps) {
    const totalTickets = tickets + bonusTickets;
    const pricePerTicket = price / totalTickets;

    return (
        <div
            className={cn(
                "relative flex flex-col rounded-2xl border bg-slate-900/70 p-4 shadow-lg transition hover:-translate-y-1 hover:border-[#FF7F00]/70 hover:shadow-[#FF7F00]/25",
                highlight
                    ? "border-[#FF7F00]/80 shadow-[#FF7F00]/30"
                    : "border-white/5"
            )}
        >
            {highlight && (
                <div className="absolute -top-2 right-3 rounded-full bg-[#FF7F00] px-2 py-[2px] text-[10px] font-semibold text-slate-950 shadow-md">
                    Más vendido
                </div>
            )}

            <h3 className="text-sm font-semibold text-slate-50">{name}</h3>
            <p className="mt-1 text-xs text-slate-400">
                {tickets} números{" "}
                {bonusTickets > 0 && (
                    <span className="text-[#FF7F00]">
                        + {bonusTickets} de regalo
                    </span>
                )}
            </p>

            <div className="mt-3 flex items-baseline gap-1">
                <span className="text-lg font-bold text-[#FF7F00]">
                    ${price.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400">
                    · aprox. ${pricePerTicket.toFixed(2)} c/u
                </span>
            </div>

            <button
                className={cn(
                    "mt-4 rounded-xl px-3 py-2 text-xs font-semibold transition",
                    highlight
                        ? "bg-[#FF7F00] text-slate-950 hover:bg-[#FF7F00]/85"
                        : "bg-slate-800 text-slate-100 hover:bg-slate-700"
                )}
                onClick={() => {
                    // Luego conectamos con el checkout
                    alert(`Seleccionaste el paquete: ${name}`);
                }}
            >
                Comprar este paquete
            </button>
        </div>
    );
}
