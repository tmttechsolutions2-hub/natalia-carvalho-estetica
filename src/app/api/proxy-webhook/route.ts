import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Usando a URL EXATA fornecida, inclusive com o case das letras (Maiúsculas no RuleId)
        const finalUrl = "https://tmttech-manager.vercel.app/api/webhook/custom/AC6E8583-A361-48D7-8CDF-535EC3BDB862?empresaId=7598fb30-3852-4a75-9259-18825da4a316";

        console.log("Proxy: Iniciando envio para TMT Manager...");
        console.log("Proxy: Payload:", JSON.stringify(body));

        const response = await fetch(finalUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body),
        });

        const dataText = await response.text();
        console.log("Proxy: Resposta de TMT Manager:", response.status, dataText);

        return NextResponse.json({
            success: response.ok,
            status: response.status,
            data: dataText
        });

    } catch (error: any) {
        console.error("Erro no Proxy Webhook:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
