import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Usando a URL EXATA fornecida (Case CAPS no RuleId conforme o sucesso no navegador)
        const finalUrl = "https://tmttech-manager.vercel.app/api/webhook/custom/AC6E8583-A361-48D7-8CDF-535EC3BDB862?empresaId=7598fb30-3852-4a75-9259-18825da4a316";

        console.log("Proxy: Enviando para TMT Manager:", finalUrl);

        const response = await fetch(finalUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(body),
        });

        const dataText = await response.text();
        console.log("Proxy: Status do TMT Manager:", response.status);
        console.log("Proxy: Resposta bruta do TMT Manager:", dataText);

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
