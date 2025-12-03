// components/PremiosInstantaneos.tsx
import { Anton } from "next/font/google";

const anton = Anton({
    subsets: ["latin"],
    weight: "400",
});

const premios = [
    "00007",
    "10101",
    "22267",
    "36836",
    "44498",
    "55286",
    "68397",
    "72564",
    "89990",
    "03030",
];

export function PremiosInstantaneos() {
    return (
        <section className="w-full bg-gray-100 py-10 md:py-14">
            <div className="mx-auto max-w-5xl px-4 text-center">
                {/* TÍTULO */}
                <h2
                    className={`${anton.className} text-lg md:text-2xl uppercase tracking-[0.18em]`}
                >
                    ¡PREMIOS INSTANTÁNEOS!
                </h2>

                {/* TEXTO DESCRIPTIVO */}
                <p className="mt-3 text-sm md:text-base text-gray-600 max-w-3xl mx-auto">
                    ¡Hay 10 números bendecidos con premios en efectivo! Realiza tu compra
                    y revisa si tienes uno de los siguientes números:
                </p>

                {/* GRID DE NÚMEROS */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-x-10 gap-y-6">
                    {premios.map((numero) => (
                        <div key={numero} className="space-y-1">
                            <p
                                className={`${anton.className} text-2xl md:text-3xl tracking-[0.25em] text-gray-900`}
                            >
                                {numero}
                            </p>
                            <p className="text-sm text-gray-600">¡Premio Entregado!</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
