import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const webhookUrl = "https://tmttech-manager.vercel.app/api/webhook/custom/ac6e8583-a361-48d7-8cdf-535ec3bdb862?empresaId=7598fb30-3852-4a75-9259-18825da4a316";

        console.log("Servidor enviando Webhook para TMT Manager:", body);

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.text();

        return NextResponse.json({
            success: response.ok,
            status: response.status,
            data
        });

    } catch (error: any) {
        console.error("Erro no Proxy Webhook:", error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
