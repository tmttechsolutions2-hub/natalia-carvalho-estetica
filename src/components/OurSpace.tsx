"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const OurSpace = () => {
    const photos = [
        {
            src: "/images/espaco-3.jpg",
            alt: "Ambiente de atendimento e recepção",
            className: "md:col-span-2 md:row-span-2 h-[400px] md:h-full",
            delay: 0.1,
        },
        {
            src: "/images/espaco-2.jpg",
            alt: "Logotipo Natália Carvalho Estética na parede",
            className: "h-[300px] md:h-full",
            delay: 0.2,
        },
        {
            src: "/images/espaco-1.jpg",
            alt: "Detalhes do consultório e higienização",
            className: "h-[300px] md:h-full",
            delay: 0.3,
        },
    ];

    return (
        <section id="espaço" className="py-24 bg-nude-50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-gold-600 font-semibold uppercase tracking-[0.3em] text-xs mb-3 block"
                    >
                        Ambiente Exclusivo
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl lg:text-5xl font-serif text-charcoal mb-4"
                    >
                        Nosso Espaço
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 80 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-1 bg-gold-400 mx-auto rounded-full mb-6"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-charcoal/70 font-sans leading-relaxed"
                    >
                        Um refúgio de sofisticação e cuidado em Divinópolis, planejado em cada detalhe para o seu total conforto e bem-estar.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[600px]">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: photo.delay }}
                            className={`relative rounded-[2rem] overflow-hidden shadow-xl group ${photo.className}`}
                        >
                            <div className="absolute inset-0 bg-gold-500/0 group-hover:bg-gold-500/5 transition-colors z-10 duration-500" />
                            <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                priority={index === 0}
                            />
                            <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl">
                                    <p className="text-white text-xs font-medium tracking-wide uppercase">{photo.alt}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurSpace;
