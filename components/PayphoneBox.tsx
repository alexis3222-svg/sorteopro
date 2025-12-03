"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
    interface Window {
        PPaymentButtonBox?: any;
    }
}

export default function PayphoneBox({ amount, refId }: {
    amount: number;
    refId: string;
}) {
    const token = process.env.NEXT_PUBLIC_PAYPHONE_TOKEN!;
    const storeId = process.env.NEXT_PUBLIC_PAYPHONE_STORE_ID!;

    useEffect(() => {
        if (!window.PPaymentButtonBox) return;

        const box = new window.PPaymentButtonBox({
            token,
            storeId,
            amount,
            amountWithoutTax: amount,
            currency: 'USD',
            clientTransactionId: refId,
            reference: `Pedido ${refId}`,
        });

        box.render("payphone-btn");
    }, [amount, refId]);

    return (
        <>
            <Script
                type="module"
                src="https://cdn.payphonetodoesposible.com/box/v1.1/payphone-payment-box.js"
                strategy="afterInteractive"
            />
            <div id="payphone-btn" />
        </>
    );
}
