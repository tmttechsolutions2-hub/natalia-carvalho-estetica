import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Tentativa 1: URL exatamente como fornecida (Path param para ruleId + Query param para empresaId)
        const baseUrl = "https://tmttech-manager.vercel.app/api/webhook/custom/ac6e8583-a361-48d7-8cdf-535ec3bdb862";
        const empresaId = "7598fb30-3852-4a75-9259-18825da4a316";

        const finalUrl = `${baseUrl}?empresaId=${empresaId}`;

        console.log("Proxy: Enviando para:", finalUrl);
        console.log("Proxy: Body:", JSON.stringify(body));

        const response = await fetch(finalUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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
