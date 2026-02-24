"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-nude-50">
            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="z-10"
                >
                    <span className="text-gold-600 font-sans uppercase tracking-[0.3em] text-sm mb-6 block font-bold">
                        Beleza & Bem-Estar
                    </span>
                    <h1 className="text-6xl lg:text-8xl font-serif text-charcoal leading-tight mb-8">
                        Realce sua beleza <br />
                        <span className="italic text-gold-500 font-light px-1">natural</span> com exclusividade.
                    </h1>
                    <p className="text-xl text-charcoal/70 mb-12 max-w-xl leading-relaxed font-sans">
                        Especialista em estética avançada e design personalizado em Divinópolis.
                        Transforme seu olhar e sua pele com cuidados de alto padrão.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6">
                        <a
                            href="#servicos"
                            className="bg-gold-500 hover:bg-gold-600 text-white px-12 py-5 rounded-full text-center font-bold transition-all hover:scale-105 shadow-2xl shadow-gold-500/30 uppercase tracking-[0.2em] text-sm"
                        >
                            Ver Serviços
                        </a>
                        <a
                            href="#sobre"
                            className="border-2 border-gold-500/30 hover:border-gold-500 text-gold-600 px-12 py-5 rounded-full text-center font-bold transition-all uppercase tracking-[0.2em] text-sm"
                        >
                            Nossa História
                        </a>
                    </div>
                </motion.div>

                {/* Right Logo Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative aspect-square flex items-center justify-center pointer-events-none"
                >
                    <div className="relative w-full h-full max-w-[700px] max-h-[700px] mix-blend-multiply">
                        <Image
                            src="/images/logo-main.png"
                            alt="Natália Carvalho Estética Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    {/* Accent decoration */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gold-400/20 rounded-full blur-[80px] -z-10" />
                    <div className="absolute -top-10 -left-10 w-56 h-56 bg-gold-200/10 rounded-full blur-[100px] -z-10" />
                </motion.div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-gold-200/20 rounded-full blur-[120px]" />
        </section>
    );
};

export default Hero;
