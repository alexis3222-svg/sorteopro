"use client";

import { useState, useEffect } from "react";

const messages = [
    "ACTIVIDAD #1",
    "JUEGA UN GO KART",
    "+ KTM DUKE ADVENTURE",
    "+ HONDA NAVI",
    "POR SOLO $0.50",
    "SIEMPRE LOS PRIMEROS EN ECUADOR",
    "¡VÁLIDO PARA TODO EL ECUADOR!",
];

export function RotatingBanner() {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setFade(false); // fade out

            setTimeout(() => {
                setIndex((prev) => (prev + 1) % messages.length);
                setFade(true); // fade in
            }, 400); // tiempo del fade-out
        }, 3000); // cambia cada 3s

        return () => clearInterval(timer);
    }, []);

    return (
        <p
            className={`
        text-[14px] 
        font-extrabold 
        tracking-[0.23em] 
        text-slate-900 
        uppercase 
        transition-all 
        duration-700 
        ${fade ? "opacity-100" : "opacity-0"}
      `}
        >
            {messages[index]}
        </p>
    );
}
