"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function PagoExitosoPage() {
    const searchParams = useSearchParams();
    const tx = searchParams.get("clientTransactionId") || searchParams.get("tx");
    const router = useRouter();

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-6 text-center">
                <h1 className="text-2xl font-bold text-emerald-600 mb-2">
                    ¡Pago realizado con éxito!
                </h1>
                <p className="text-gray-700 mb-2">
                    Hemos recibido tu pago correctamente.
                </p>
                {tx && (
                    <p className="text-xs text-gray-500 mb-4">
                        Referencia de transacción: <span className="font-mono">{tx}</span>
                    </p>
                )}

                <button
                    onClick={() => router.push("/")}
                    className="mt-4 w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                    Volver al inicio
                </button>
            </div>
        </main>
    );
}
