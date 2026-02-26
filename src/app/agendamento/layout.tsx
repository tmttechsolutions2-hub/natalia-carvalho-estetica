import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AgendamentoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#faf9f7] flex flex-col">
            {/* Minimalist Header for Booking Flow */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-nude-100 flex items-center justify-center z-50">
                <Link href="/" className="relative h-8 w-40 flex items-center">
                    <Image
                        src="/images/logo-natalia-v2.png"
                        alt="Natália Carvalho Estética"
                        fill
                        className="object-contain object-center"
                        priority
                    />
                </Link>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow pt-16 pb-24 md:pb-12">
                {children}
            </main>
        </div>
    );
}
