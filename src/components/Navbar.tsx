"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: "Sobre", href: "#sobre" },
        { name: "Espaço", href: "#espaço" },
        { name: "Serviços", href: "#servicos" },
        { name: "Localização", href: "#localizacao" },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
                    ? "bg-white/95 backdrop-blur-md py-4 shadow-sm"
                    : "bg-white py-6 shadow-sm"
                    }`}
            >
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <Link href="/" className="relative h-10 w-48 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                        <Image
                            src="/images/logo-natalia-v2.png"
                            alt="Natália Carvalho Estética"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-charcoal/80 hover:text-gold-600 transition-colors uppercase tracking-widest"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/agendamento"
                            className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-gold-500/20 uppercase tracking-widest"
                        >
                            Agendar Agora
                        </Link>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button
                        className="md:hidden text-charcoal p-2 z-[60] relative"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Abrir menu"
                    >
                        {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </nav>

            {/* Full-Screen Mobile Overlay Menu */}
            <div
                className={`fixed inset-0 z-[55] bg-white flex flex-col transition-all duration-500 md:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Decorative gold accent at top */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-gold-400 to-transparent"></div>

                <div className="flex flex-col justify-center items-center flex-1 px-8 space-y-2">
                    {/* Logo inside menu */}
                    <div className="relative h-14 w-52 mb-8">
                        <Image
                            src="/images/logo-natalia-v2.png"
                            alt="Natália Carvalho Estética"
                            fill
                            className="object-contain"
                        />
                    </div>

                    {navLinks.map((link, i) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-2xl font-serif text-charcoal hover:text-gold-500 transition-colors py-4 w-full text-center border-b border-nude-100 last:border-b-0 ${isMobileMenuOpen ? "animate-in fade-in slide-in-from-bottom-3 duration-500" : ""}`}
                            style={{ animationDelay: `${i * 80}ms` }}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link
                        href="/agendamento"
                        className="mt-8 w-full bg-gold-500 text-white text-center py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] shadow-lg shadow-gold-500/20 hover:bg-gold-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Agendar Agora
                    </Link>
                </div>

                {/* Footer info */}
                <div className="pb-10 text-center">
                    <p className="text-xs text-charcoal/30 uppercase tracking-widest">Divinópolis • MG</p>
                </div>
            </div>
        </>
    );
};

export default Navbar;
