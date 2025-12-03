// components/CountdownTimer.tsx
"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
    targetDate: string; // formato ISO: "2025-12-25T20:00:00Z"
}

function formatTime(value: number) {
    return value.toString().padStart(2, "0");
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        finished: false,
    });

    useEffect(() => {
        const target = new Date(targetDate).getTime();

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = target - now;

            if (diff <= 0) {
                clearInterval(interval);
                setTimeLeft((prev) => ({ ...prev, finished: true }));
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({
                days,
                hours,
                minutes,
                seconds,
                finished: false,
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    if (timeLeft.finished) {
        return (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-center text-sm font-semibold text-emerald-300">
                🎉 Sorteo finalizado · Próximamente nuevos premios
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <p className="text-xs text-slate-300">El sorteo finaliza en:</p>
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                {[
                    { label: "Días", value: formatTime(timeLeft.days) },
                    { label: "Hrs", value: formatTime(timeLeft.hours) },
                    { label: "Min", value: formatTime(timeLeft.minutes) },
                    { label: "Seg", value: formatTime(timeLeft.seconds) },
                ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center">
                        <span className="rounded-md bg-slate-800 px-2 py-1 text-sm font-semibold tracking-wide">
                            {item.value}
                        </span>
                        <span className="mt-1 text-[10px] uppercase text-slate-400">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
