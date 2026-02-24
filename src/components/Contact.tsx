"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

const Contact = () => {
    return (
        <section id="localizacao" className="py-24 bg-nude-50">
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
                        <h2 className="text-4xl lg:text-5xl font-serif text-charcoal mb-8">
                            Onde nos encontrar
                        </h2>
                        <p className="text-charcoal/60 mb-12 max-w-md">
                            Estamos localizados no coração de Divinópolis, prontos para oferecer uma experiência única de beleza e cuidado.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-nude-50 rounded-full flex items-center justify-center text-gold-600 flex-shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-charcoal font-bold font-serif">Endereço</h4>
                                    <p className="text-charcoal/60 text-sm">Avenida Oswaldo Machado Gontijo, 984, Centro, Divinópolis - MG</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-nude-50 rounded-full flex items-center justify-center text-gold-600 flex-shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-charcoal font-bold font-serif">WhatsApp</h4>
                                    <p className="text-charcoal/60 text-sm">(37) 99999-9999</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-nude-50 rounded-full flex items-center justify-center text-gold-600 flex-shrink-0">
                                    <Instagram size={24} />
                                </div>
                                <div>
                                    <h4 className="text-charcoal font-bold font-serif">Siga-nos</h4>
                                    <p className="text-charcoal/60 text-sm">@nataliacarvalhoestetica</p>
                                </div>
                            </div>
                        </div>

                        <motion.a
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href="https:wa.me/553799999999"
                            className="mt-12 inline-flex items-center space-x-3 bg-gold-500 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl shadow-gold-500/20"
                        >
                            <span>Agendar Minha Visita</span>
                        </motion.a>
                    </motion.div>

                    {/* Map Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[400px] lg:h-full min-h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-nude-100 flex items-center justify-center"
                    >
                        {/* Real embedded map could go here, using a placeholder for now as requested */}
                        <div className="absolute inset-0 bg-nude-200/30 backdrop-blur-[2px]" />
                        <div className="relative z-10 text-center p-8">
                            <MapPin className="mx-auto text-gold-500 mb-4" size={48} />
                            <p className="text-charcoal/50 font-medium italic">Google Maps Integrated Placeholder</p>
                            <p className="text-xs text-charcoal/40 mt-2">Avenida Oswaldo Machado Gontijo, 984, Divinópolis</p>
                            <button className="mt-6 px-6 py-2 bg-white text-charcoal text-xs font-bold rounded-full shadow-sm hover:shadow-md transition-shadow">
                                ABRIR NO MAPS
                            </button>
                        </div>
                        {/* Mock map imagery decoration */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-charcoal/20 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-charcoal/20 rounded-full" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-charcoal/50 rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
