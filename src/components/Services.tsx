"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Flower2, Scissors, User2, Wind, Droplets, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ServiceProps {
    title: string;
    price: string;
    description: string;
    icon: React.ReactNode;
    delay: number;
}

const ServiceCard = ({ title, price, description, icon, delay }: ServiceProps) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        className="bg-white p-8 md:p-10 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(180,148,102,0.15)] transition-all duration-500 h-full flex flex-col group border border-nude-50"
    >
        <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-serif text-charcoal">{title}</h3>
            <div className="w-12 h-12 rounded-full bg-nude-50 flex items-center justify-center text-gold-500 group-hover:bg-gold-500 group-hover:text-white transition-colors duration-500 flex-shrink-0">
                {icon}
            </div>
        </div>
        <p className="text-charcoal/60 text-sm leading-relaxed mb-8 flex-grow">{description}</p>
        <div className="flex items-center justify-between pt-6 border-t border-nude-100">
            <span className="text-charcoal font-bold font-sans">{price}</span>
            <Link href="/agendamento" className="text-xs font-bold uppercase tracking-widest text-gold-500 hover:text-gold-600 transition-colors">
                Agendar
            </Link>
        </div>
    </motion.div>
);

const Services = () => {
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const iconMap: Record<string, React.ReactNode> = {
        "Brow Lamination": <Wind size={28} />,
        "Lash Lifting": <Sparkles size={28} />,
        "Design + Henna": <Flower2 size={28} />,
        "Design Geral": <Scissors size={28} />,
        "Limpeza de Pele": <Droplets size={28} />,
        "default": <User2 size={28} />
    };

    useEffect(() => {
        const fetchServices = async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('is_active', true)
                .order('name');

            if (data && !error) {
                setServices(data);
            }
            setIsLoading(false);
        };
        fetchServices();
    }, []);

    return (
        <section id="servicos" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-gold-500 font-semibold uppercase tracking-[0.3em] text-xs mb-3 block">
                        Tratamentos Exclusivos
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-serif text-charcoal mb-4">
                        Nossos Serviços
                    </h2>
                    <div className="h-1 w-20 bg-gold-200 mx-auto rounded-full mb-6" />
                    <p className="text-charcoal/60 font-sans">
                        Descubra <span className="text-gold-600 font-medium">protocolos personalizados</span> desenvolvidos para realçar a sua <span className="text-gold-600 font-medium">autenticidade</span> e promover bem-estar.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-gold-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard
                                key={service.id}
                                title={service.name}
                                price={service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                description={service.description || ""}
                                icon={iconMap[service.name] || iconMap["default"]}
                                delay={index * 0.1}
                            />
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <p className="text-charcoal/50 text-sm mb-6">Ficou com alguma dúvida sobre qual procedimento é ideal para você?</p>
                    <a
                        href="https://wa.me/553799999999"
                        className="inline-block border-b-2 border-gold-500 text-gold-600 font-bold pb-1 hover:text-gold-700 transition-colors uppercase tracking-widest text-xs"
                    >
                        Falar com a Natália
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Services;
