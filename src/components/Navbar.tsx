"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

    const navLinks = [
        { name: "Sobre", href: "#sobre" },
        { name: "Espaço", href: "#espaço" },
        { name: "Serviços", href: "#servicos" },
        { name: "Localização", href: "#localizacao" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled
                ? "bg-off-white/70 backdrop-blur-md py-4 shadow-sm"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link href="/" className="text-2xl font-serif tracking-tight text-charcoal">
                    Natália Carvalho <span className="text-gold-500 underline decoration-gold-200 underline-offset-4">Estética</span>
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
                        href="https:wa.me/553799999999"
                        className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-md shadow-gold-500/20 uppercase tracking-widest"
                    >
                        Agendar Agora
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-charcoal"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-off-white border-t border-nude-100 py-6 px-6 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-medium text-charcoal py-2 border-b border-nude-50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        href="https:wa.me/553799999999"
                        className="bg-gold-500 text-white text-center py-3 rounded-full text-sm font-bold uppercase tracking-widest mt-4"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Agendar Agora
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
