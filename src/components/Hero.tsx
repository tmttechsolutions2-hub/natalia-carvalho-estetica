"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <section className="relative h-[90vh] lg:h-screen flex items-end lg:items-center overflow-hidden bg-[var(--background-dark)]">
            {/* 1. Base Layer: Cinematic Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/hero-full-bg-final.jpg"
                    alt="Natália Carvalho Estética"
                    fill
                    className="object-cover object-top lg:object-[15%_center] opacity-100 scale-[1.02]"
                    priority
                />

                {/* 2. Layering: Deep Gradient Overlays for High-End Integration */}
                {/* Desktop: Powerful Horizontal Gradient from Right to Left */}
                <div className="hidden lg:block absolute inset-0 bg-gradient-to-l from-[var(--background-dark)] via-[var(--background-dark)]/80 to-transparent z-10" />
                <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[var(--background-dark)]/30 via-transparent to-transparent z-10" />

                {/* Mobile: Gradient from bottom for text readability, keeping top photo visible */}
                <div className="lg:hidden absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10" />

                {/* Atmospheric depth gradients */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--background-dark)] to-transparent z-10" />
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--background-dark)]/50 to-transparent z-10" />
            </div>

            <div className="container mx-auto px-6 pb-12 lg:pb-0 relative z-30">
                <div className="flex justify-center lg:justify-end items-end lg:items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                        className="max-w-2xl w-full text-center lg:text-left lg:pr-14"
                    >
                        {/* Subtitle: High-Standard Tracking */}
                        <span className="text-gold-500 font-sans uppercase tracking-[0.6em] text-[10px] sm:text-xs mb-4 md:mb-10 block font-bold drop-shadow-sm">
                            Realce & Exclusividade
                        </span>

                        {/* Title: Pure Luxury Typography */}
                        <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-serif text-white leading-[1.05] mb-8 md:mb-12 drop-shadow-2xl">
                            Beleza que <br />
                            <span className="italic text-gold-400 font-light block mt-2 md:mt-4">se renova.</span>
                        </h1>

                        {/* Description: Structured and Elegant */}
                        <div className="relative mb-8 lg:mb-14 border-l-0 lg:border-l-[1.5px] border-gold-500/30 lg:pl-10 hidden sm:block">
                            <p className="text-lg sm:text-xl text-white/90 leading-relaxed font-sans max-w-lg mx-auto lg:mx-0 drop-shadow-lg">
                                Especialista em <span className="text-gold-400 font-medium tracking-wide italic">estética avançada</span> e <span className="text-gold-400 font-medium tracking-wide italic">design personalizado</span> em Divinópolis.
                                Experimente o alto padrão em cada detalhe.
                            </p>
                        </div>

                        {/* High-Impact Actions */}
                        <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 justify-center lg:justify-start items-center">
                            <Link
                                href="/agendamento"
                                className="group relative overflow-hidden bg-gold-500 text-[var(--background-dark)] px-8 py-4 sm:px-16 sm:py-6 w-full sm:w-auto text-center rounded-none font-extrabold transition-all shadow-2xl shadow-gold-500/30 uppercase tracking-[0.4em] text-[11px]"
                            >
                                <span className="relative z-10 group-hover:text-white transition-colors duration-500">Agendar Agora</span>
                                <div className="absolute inset-0 bg-black/90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.165, 0.84, 0.44, 1]" />
                            </Link>

                            <a
                                href="#sobre"
                                className="group text-white hover:text-gold-400 font-bold uppercase tracking-[0.4em] text-[11px] flex items-center gap-6 transition-all"
                            >
                                <span className="h-[1px] w-12 bg-gold-400 origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-500" />
                                Nossa História
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
