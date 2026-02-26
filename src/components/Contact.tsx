"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

const Contact = () => {
    return (
        <section id="localizacao" className="py-24 bg-[var(--background-dark)]">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-gold-500 font-semibold uppercase tracking-[0.3em] text-xs mb-3 block">
                            Contato & Visita
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-serif text-white mb-8">
                            Onde nos encontrar
                        </h2>
                        <p className="text-white/60 mb-12 max-w-md">
                            Estamos localizados no coração de Divinópolis, prontos para oferecer uma <span className="text-gold-400 font-medium">experiência única</span> de beleza e cuidado.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 flex-shrink-0 border border-gold-500/20">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold font-serif">Endereço</h4>
                                    <p className="text-white/60 text-sm">Avenida Oswaldo Machado Gontijo, 984, Centro, Divinópolis - MG</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 flex-shrink-0 border border-gold-500/20">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold font-serif">WhatsApp</h4>
                                    <p className="text-white/60 text-sm">(37) 98804-7154</p>
                                </div>
                            </div>

                            <a
                                href="https://www.instagram.com/nataliacarvalho_estetica/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start space-x-4 group hover:opacity-80 transition-opacity"
                            >
                                <div className="w-12 h-12 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500 flex-shrink-0 border border-gold-500/20 group-hover:border-gold-500/50 transition-colors">
                                    <Instagram size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold font-serif transition-colors group-hover:text-gold-400">Siga-nos</h4>
                                    <p className="text-white/60 text-sm">@nataliacarvalho_estetica</p>
                                </div>
                            </a>
                        </div>

                        <Link href="/agendamento">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-12 inline-flex items-center space-x-3 bg-gold-500 text-[var(--background-dark)] px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-[0_10px_30_rgba(180,148,102,0.2)]"
                            >
                                <span>Agendar Minha Visita</span>
                            </motion.button>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[450px] lg:h-full min-h-[450px] rounded-3xl overflow-hidden shadow-2xl bg-nude-100"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3745.848747509465!2d-44.886811800000004!3d-20.1403568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa0a578b585f331%3A0xd07f65c0f9b9dbdf!2sAv.%20Oswaldo%20Machado%20Gontijo%2C%20984%20-%20Centro%2C%20Divin%C3%B3polis%20-%20MG%2C%2035500-037!5e0!3m2!1spt-BR!2sbr!4v1772111874469!5m2!1spt-BR!2sbr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Localização Natália Carvalho Estética"
                            className="grayscale-[20%] contrast-[110%]"
                        ></iframe>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
