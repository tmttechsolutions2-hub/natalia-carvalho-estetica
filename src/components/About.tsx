"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const About = () => {
    return (
        <section id="sobre" className="py-24 lg:py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                    {/* Image side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[3/4] relative rounded-t-full rounded-b-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] z-10 p-2 bg-white border border-nude-100">
                            <div className="relative w-full h-full rounded-t-full rounded-b-2xl overflow-hidden">
                                <Image
                                    src="/images/natalia-profissional.png"
                                    alt="Natália Carvalho"
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                        </div>
                        {/* Decorative element */}
                        <div className="absolute top-10 -right-8 w-full h-full border border-gold-400/30 rounded-t-full rounded-b-3xl z-0" />
                        <div className="absolute -bottom-5 -left-3 sm:-bottom-8 sm:-left-8 bg-gold-500 text-white p-5 sm:p-8 rounded-full aspect-square flex flex-col items-center justify-center z-20 shadow-xl border-4 border-white">
                            <p className="font-serif text-3xl sm:text-4xl mb-1 leading-none">8+</p>
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-center">Anos<br />Exp.</p>
                        </div>
                    </motion.div>

                    {/* Text side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:pl-8"
                    >
                        <span className="text-gold-500 font-semibold uppercase tracking-[0.3em] text-xs mb-4 block">
                            Quem Somos
                        </span>
                        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-serif text-charcoal mb-6 md:mb-8 leading-[1.1]">
                            Natália Carvalho: <br />
                            <span className="text-gold-500 italic font-light">Paixão por transformar olhares.</span>
                        </h2>
                        <div className="space-y-6 text-charcoal/70 leading-relaxed font-sans text-lg">
                            <p>
                                Com uma trajetória marcada pela busca constante pela <span className="text-gold-600 font-medium">excelência</span>, Natália Carvalho consolidou-se como referência em <span className="text-gold-600 font-medium">estética avançada</span> em Divinópolis. Seu foco principal é proporcionar resultados que harmonizem a beleza individual de cada cliente, sempre priorizando a saúde e o bem-estar.
                            </p>
                            <p className="pl-6 border-l-2 border-gold-300 italic text-charcoal/60 my-8">
                                "Inauguramos nosso espaço com o objetivo de elevar o conceito de autocuidado, oferecendo um ambiente acolhedor e técnicas de ponta que garantem <span className="text-gold-600 font-medium">precisão e naturalidade</span> em cada procedimento."
                            </p>
                            <p>
                                Nossa filosofia baseia-se no atendimento personalizado: entendemos que cada rosto possui uma história única, e nosso papel é realçar o que há de <span className="text-gold-600 font-medium">melhor em você</span>.
                            </p>
                        </div>

                        <div className="mt-10 grid grid-cols-2 gap-8 pt-8 border-t border-nude-200">
                            <div>
                                <h4 className="text-charcoal font-bold mb-2 font-serif">Certificações</h4>
                                <p className="text-sm text-charcoal/50">Especialista em Micropigmentação e Estética Facial Avançada.</p>
                            </div>
                            <div>
                                <h4 className="text-charcoal font-bold mb-2 font-serif">Compromisso</h4>
                                <p className="text-sm text-charcoal/50">Uso exclusivo de produtos premium e tecnologias certificadas.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
