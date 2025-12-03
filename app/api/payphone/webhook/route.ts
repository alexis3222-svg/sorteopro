import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Cliente admin de Supabase (SOLO SERVER SIDE)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ SERVICE ROLE
);

// Función común para marcar un pedido como pagado
async function marcarPedidoPagado(clientTransactionId: string) {
    console.log("🔔 marcarPedidoPagado llamado con:", clientTransactionId);

    // Buscar el pedido que tenga ese clientTransactionId
    const { data: pedido, error: findError } = await supabaseAdmin
        .from("pedidos")
        .select("*")
        .eq("payphone_client_transaction_id", clientTransactionId)
        .single();

    if (findError || !pedido) {
        console.error(
            "❌ No se encontró pedido para clientTransactionId:",
            clientTransactionId,
            findError
        );
        throw new Error("Pedido no encontrado");
    }

    // Actualizar el pedido a "pagado"
    const { error: updateError } = await supabaseAdmin
        .from("pedidos")
        .update({ estado: "pagado" })
        .eq("id", pedido.id);

    if (updateError) {
        console.error("❌ Error actualizando pedido a pagado:", updateError);
        throw new Error("No se pudo actualizar el pedido");
    }

    console.log("✅ Pedido actualizado a pagado. ID:", pedido.id);
}

// 👉 PayPhone te está llamando por GET: /api/payphone/webhook?id=...&clientTransactionId=...
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        const clientTransactionId =
            url.searchParams.get("clientTransactionId") ?? undefined;

        console.log("🔔 Callback PayPhone GET:", {
            id,
            clientTransactionId,
        });

        if (!clientTransactionId) {
            console.error("❌ GET sin clientTransactionId");
            return NextResponse.json(
                { ok: false, error: "Sin clientTransactionId" },
                { status: 400 }
            );
        }

        // 1) Marcar pedido como pagado en Supabase
        await marcarPedidoPagado(clientTransactionId);

        // 2) Redirigir al usuario a una página amigable
        const redirectUrl = new URL("/payphone/respuesta", req.url);

        // Si quieres, puedes pasarle algo por query:
        // redirectUrl.searchParams.set("ok", "1");

        return NextResponse.redirect(redirectUrl);
    } catch (err: any) {
        console.error("❌ Error en webhook GET PayPhone:", err);
        return NextResponse.json(
            { ok: false, error: err?.message ?? "Error interno" },
            { status: 500 }
        );
    }
}

// Mantenemos también POST por si en el futuro usamos un webhook tipo POST
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("🔔 Webhook PayPhone POST recibido:", body);

        const clientTransactionId = body.clientTransactionId as string | undefined;

        if (!clientTransactionId) {
            console.error("❌ POST sin clientTransactionId");
            return NextResponse.json(
                { ok: false, error: "Sin clientTransactionId" },
                { status: 400 }
            );
        }

        await marcarPedidoPagado(clientTransactionId);

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        console.error("❌ Error en webhook POST PayPhone:", err);
        return NextResponse.json(
            { ok: false, error: err?.message ?? "Error interno" },
            { status: 500 }
        );
    }
}
