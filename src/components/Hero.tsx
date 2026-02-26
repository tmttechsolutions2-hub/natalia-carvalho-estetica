"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-[var(--background-dark)]">

            {/* ── MOBILE LAYOUT ── */}
            <div className="lg:hidden flex flex-col min-h-[100svh]">
                {/* Photo of Natália - takes up the top ~60% */}
                <div className="relative flex-1 min-h-[55vh]">
                    <Image
                        src="/images/natalia-profissional.png"
                        alt="Natália Carvalho"
                        fill
                        className="object-cover object-top"
                        priority
                        unoptimized
                    />
                    {/* Fade to dark at the bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--background-dark)] to-transparent" />
                    {/* Subtle top fade */}
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--background-dark)]/60 to-transparent" />
                </div>

                {/* Text content below the photo */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                    className="relative z-10 bg-[var(--background-dark)] px-6 pt-2 pb-14 text-center"
                >
                    <span className="text-gold-500 font-sans uppercase tracking-[0.5em] text-[10px] mb-4 block font-bold">
                        Realce &amp; Exclusividade
                    </span>
                    <h1 className="text-4xl font-serif text-white leading-tight mb-6 drop-shadow-2xl">
                        Beleza que <br />
                        <span className="italic text-gold-400 font-light">se renova.</span>
                    </h1>
                    <p className="text-sm text-white/70 leading-relaxed mb-8 max-w-xs mx-auto">
                        Especialista em <span className="text-gold-400 font-medium italic">estética avançada</span> e{" "}
                        <span className="text-gold-400 font-medium italic">design personalizado</span> em Divinópolis.
                    </p>
                    <Link
                        href="/agendamento"
                        className="block w-full bg-gold-500 text-[var(--background-dark)] py-4 font-extrabold uppercase tracking-[0.3em] text-[11px] shadow-xl shadow-gold-500/30"
                    >
                        Agendar Agora
                    </Link>
                    <a
                        href="#sobre"
                        className="mt-5 inline-block text-white/50 font-bold uppercase tracking-[0.3em] text-[10px]"
                    >
                        Nossa História ↓
                    </a>
                </motion.div>
            </div>

            {/* ── DESKTOP LAYOUT (unchanged) ── */}
            <div className="hidden lg:block relative h-screen">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/hero-full-bg-final.jpg"
                        alt="Natália Carvalho Estética"
                        fill
                        className="object-cover object-[15%_center] scale-[1.02]"
                        priority
                        unoptimized
                    />
                    {/* Desktop Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-l from-[var(--background-dark)] via-[var(--background-dark)]/80 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--background-dark)]/30 via-transparent to-transparent z-10" />
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--background-dark)] to-transparent z-10" />
                    <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--background-dark)]/50 to-transparent z-10" />
                </div>

                <div className="container mx-auto px-6 h-full flex items-center justify-end relative z-30">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                        className="max-w-2xl text-left pr-14"
                    >
                        <span className="text-gold-500 font-sans uppercase tracking-[0.6em] text-xs mb-10 block font-bold drop-shadow-sm">
                            Realce &amp; Exclusividade
                        </span>
                        <h1 className="text-[5.5rem] font-serif text-white leading-[1.05] mb-12 drop-shadow-2xl">
                            Beleza que <br />
                            <span className="italic text-gold-400 font-light block mt-4">se renova.</span>
                        </h1>
                        <div className="relative mb-14 border-l-[1.5px] border-gold-500/30 pl-10">
                            <p className="text-xl text-white/90 leading-relaxed font-sans drop-shadow-lg">
                                Especialista em <span className="text-gold-400 font-medium tracking-wide italic">estética avançada</span> e{" "}
                                <span className="text-gold-400 font-medium tracking-wide italic">design personalizado</span> em Divinópolis.
                                Experimente o alto padrão em cada detalhe.
                            </p>
                        </div>
                        <div className="flex flex-row gap-10 items-center">
                            <Link
                                href="/agendamento"
                                className="group relative overflow-hidden bg-gold-500 text-[var(--background-dark)] px-16 py-6 rounded-none font-extrabold transition-all shadow-2xl shadow-gold-500/30 uppercase tracking-[0.4em] text-[11px]"
                            >
                                <span className="relative z-10 group-hover:text-white transition-colors duration-500">Agendar Agora</span>
                                <div className="absolute inset-0 bg-black/90 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
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
