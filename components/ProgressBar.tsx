// components/ProgressBar.tsx
"use client";

import { useEffect, useState } from "react";

interface ProgressBarProps {
    value: number; // porcentaje ya calculado (0–100)
}

export function ProgressBar({ value }: ProgressBarProps) {
    const [internal, setInternal] = useState(0);

    // Animación: 0 → value
    useEffect(() => {
        const timeout = setTimeout(() => {
            setInternal(value);
        }, 100);

        return () => clearTimeout(timeout);
    }, [value]);

    return (
        <div className="space-y-2">

            {/* ---- TEXTO SUPERIOR ---- */}
            <p className="text-center text-base md:text-lg font-semibold text-slate-800">
                Números vendidos:{" "}
                <span className="font-bold text-slate-900">
                    {value.toFixed(2)}%
                </span>
            </p>

            {/* ---- BARRA DE PROGRESO ---- */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                    className="h-full bg-gradient-to-r from-[#FF7F00] via-[#FF7F00] to-amber-400 transition-all duration-700 ease-out"
                    style={{ width: `${internal}%` }}
                />
            </div>
        </div>
    );
}
