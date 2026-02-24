"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const About = () => {
    return (
        <section id="sobre" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Image side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl z-10">
                            <Image
                                src="/images/natalia-quem-somos.jpg"
                                alt="Natália Carvalho"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative element */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 border-2 border-gold-500/20 rounded-full z-0" />
                        <div className="absolute -bottom-6 -left-6 bg-gold-500 text-white p-8 rounded-2xl z-20 shadow-xl">
                            <p className="font-serif text-3xl mb-1">8+</p>
                            <p className="text-xs uppercase tracking-widest font-bold">Anos de Experiência</p>
                        </div>
                    </motion.div>

                    {/* Text side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-gold-500 font-semibold uppercase tracking-[0.3em] text-xs mb-3 block">
                            Quem Somos
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-serif text-charcoal mb-8 leading-tight">
                            Natália Carvalho: <br />
                            <span className="text-gold-500 italic">Paixão por transformar olhares.</span>
                        </h2>
                        <div className="space-y-6 text-charcoal/70 leading-relaxed font-sans">
                            <p>
                                Com uma trajetória marcada pela busca constante pela excelência, Natália Carvalho consolidou-se como referência em estética avançada em Divinópolis. Seu foco principal é proporcionar resultados que harmonizem a beleza individual de cada cliente, sempre priorizando a saúde e o bem-estar.
                            </p>
                            <p>
                                Inauguramos nosso espaço com o objetivo de elevar o conceito de autocuidado, oferecendo um ambiente acolhedor e técnicas de ponta que garantem precisão e naturalidade em cada procedimento.
                            </p>
                            <p>
                                Nossa filosofia baseia-se no atendimento personalizado: entendemos que cada rosto possui uma história única, e nosso papel é realçar o que há de melhor em você.
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
