"use client";

import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";

const TOKEN = process.env.NEXT_PUBLIC_PAYPHONE_TOKEN ?? "";
const STORE_ID = process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID ?? "";

export default function PayphonePage({
    params,
}: {
    params: { pedidoId: string };
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const pedidoId = params.pedidoId;
    const amountParam = searchParams.get("amount");
    const actividadParam = searchParams.get("actividad");

    const total = amountParam ? Number(amountParam) : null;
    const actividad = actividadParam ?? "-";
    const hasValidAmount = total != null && !isNaN(total);

    // montos en centavos
    const amountInCents = hasValidAmount ? Math.round(total! * 100) : 0;

    // id único por transacción (máx ~15 caracteres)
    const clientTransactionId = `P${pedidoId}-${Date.now()
        .toString()
        .slice(-6)}`.slice(0, 15);

    // ⚙️ Script de configuración PayPhone, ejecutado inmediatamente
    const payphoneConfigScript = `
    (function () {
      console.log("⚙️ Script de configuración PayPhone ejecutado");

      const token = "${TOKEN}";
      const storeId = "${STORE_ID}";
      const amount = ${amountInCents};
      const clientTransactionId = "${clientTransactionId}";
      const actividad = "${actividad}";
      const pedidoId = "${pedidoId}";

      if (!token || !storeId) {
        console.error("PayPhone: faltan TOKEN o STORE_ID");
        return;
      }
      if (!amount || isNaN(amount)) {
        console.error("PayPhone: monto inválido");
        return;
      }

      function initPayPhoneBox() {
        try {
          if (typeof PPaymentButtonBox === "undefined") {
            console.error("PayPhone: PPaymentButtonBox no está definido todavía");
            return;
          }

          console.log("🚀 Inicializando PPaymentButtonBox con:", {
            amount,
            clientTransactionId,
            referencia: "Sorteo " + actividad + " - Pedido " + pedidoId
          });

          var ppb = new PPaymentButtonBox({
            token: token,
            clientTransactionId: clientTransactionId,
            amount: amount,
            amountWithoutTax: amount,  // todo sin IVA por ahora
            amountWithTax: 0,
            tax: 0,
            service: 0,
            tip: 0,
            currency: "USD",
            storeId: storeId,
            reference: "Pago Sorteo " + actividad + " - Pedido " + pedidoId,
            lang: "es",
            defaultMethod: "card",
            timeZone: -5
          });

          ppb.render("pp-button");
          console.log("✅ Cajita PayPhone renderizada en #pp-button");
        } catch (e) {
          console.error("PayPhone Box error:", e);
        }
      }

      // Si el DOM ya está listo, ejecutamos directo; si no, esperamos
      if (document.readyState === "complete" || document.readyState === "interactive") {
        initPayPhoneBox();
      } else {
        window.addEventListener("DOMContentLoaded", initPayPhoneBox);
      }
    })();
  `;

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
            {/* SDK PayPhone, tal como dice la documentación */}
            <Script
                src="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js"
                type="module"
                strategy="afterInteractive"
                onLoad={() => console.log("📦 SDK PayPhone cargado")}
            />

            {/* Script de configuración, que crea la cajita */}
            <Script
                id="payphone-config"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: payphoneConfigScript }}
            />

            {/* TU UI */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mt-8">
                <h2 className="text-xl font-bold text-center mb-2">
                    Pago seguro con PayPhone
                </h2>

                {hasValidAmount && (
                    <>
                        <p className="text-center text-sm text-gray-700">
                            Pedido <b>#{pedidoId}</b> · Actividad #{actividad}
                        </p>
                        <p className="text-center text-xs text-gray-600 mb-2">
                            Total a pagar:{" "}
                            <span className="font-bold text-green-600">
                                ${total!.toFixed(2)}
                            </span>
                        </p>
                    </>
                )}

                {/* 👉 AQUÍ APARECE EL FORMULARIO DE PAYPHONE */}
                <div id="pp-button" className="mt-4" />

                <p className="mt-4 text-center text-xs text-gray-500">
                    Completa el pago en esta cajita segura de PayPhone. Al finalizar, tu
                    pedido será verificado por el administrador.
                </p>

                <button
                    className="mt-4 w-full border border-gray-400 rounded-lg py-2 text-gray-700"
                    onClick={() => router.push("/")}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
