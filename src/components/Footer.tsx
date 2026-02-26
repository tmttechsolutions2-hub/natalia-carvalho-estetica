"use client";

import React from "react";
import Link from "next/link";
import { Instagram, Facebook, MapPin, Clock } from "lucide-react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[var(--background-dark-alt)] text-white pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <h3 className="text-2xl font-serif mb-6 text-gold-500">Natália Carvalho Estética</h3>
                        <p className="text-white/50 text-sm leading-relaxed mb-8">
                            Especialista em <span className="text-gold-500 font-medium">realçar a sua beleza natural</span> com <span className="text-gold-500 font-medium">técnicas avançadas</span> e atendimento personalizado.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.instagram.com/nataliacarvalho_estetica/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-colors">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-colors">
                                <Facebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h4 className="text-lg font-serif mb-6 flex items-center gap-2">
                            <Clock size={18} className="text-gold-500" />
                            Horário de Atendimento
                        </h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li className="flex justify-between">
                                <span>Segunda - Sexta:</span>
                                <span className="text-white">08:00h - 20:00h</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sábado:</span>
                                <span className="text-white">07:00h - 12:00h</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Domingo:</span>
                                <span className="text-gold-500 font-semibold uppercase tracking-tighter">Fechado</span>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-serif mb-6">Links Rápidos</h4>
                        <ul className="space-y-4 text-sm text-white/60">
                            <li><a href="#" className="hover:text-gold-500 transition-colors">Início</a></li>
                            <li><a href="#servicos" className="hover:text-gold-500 transition-colors">Nossos Serviços</a></li>
                            <li><a href="#sobre" className="hover:text-gold-500 transition-colors">Sobre Nós</a></li>
                            <li><a href="#localizacao" className="hover:text-gold-500 transition-colors">Localização</a></li>
                        </ul>
                    </div>

                    {/* Location Info */}
                    <div>
                        <h4 className="text-lg font-serif mb-6 flex items-center gap-2">
                            <MapPin size={18} className="text-gold-500" />
                            Localização
                        </h4>
                        <p className="text-sm text-white/60 leading-relaxed mb-6">
                            Avenida Oswaldo Machado Gontijo, 984 <br />
                            Centro, Divinópolis - MG <br />
                            CEP: 35500-037
                        </p>
                        <Link
                            href="/agendamento"
                            className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500 hover:text-gold-400 border-b border-gold-500/30 pb-1"
                        >
                            Agendar Procedimento
                        </Link>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-white/30 space-y-4 md:space-y-0">
                    <p>© {currentYear} Natália Carvalho Estética. Todos os direitos reservados.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                        <a href="#" className="hover:text-white transition-colors">Termos</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
