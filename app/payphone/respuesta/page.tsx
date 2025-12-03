// app/payphone/respuesta/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PayphoneRespuestaPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 1500); // 1.5 segundos

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm text-center">
                <h2 className="text-lg font-bold mb-2">
                    Procesando pago...
                </h2>
                <p className="text-sm text-gray-600">
                    Tu pago con PayPhone ha finalizado. Te estamos redirigiendo al inicio.
                </p>
            </div>
        </div>
    );
}
