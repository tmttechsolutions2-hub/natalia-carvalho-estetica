import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Natália Carvalho Estética | Realce sua beleza natural",
  description: "Especialista em estética avançada e design personalizado em Divinópolis. Brow Lamination, Lash Lifting, Limpeza de Pele e mais.",
};

import WhatsAppButton from "@/components/WhatsAppButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased`}
      >
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
