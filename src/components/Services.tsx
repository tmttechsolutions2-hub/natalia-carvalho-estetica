"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Flower2, Scissors, User2, Wind, Droplets } from "lucide-react";

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
        className="bg-white p-8 rounded-2xl shadow-sm border border-nude-100/50 hover:border-gold-500/30 hover:shadow-xl hover:shadow-gold-500/5 transition-all group"
    >
        <div className="w-14 h-14 bg-nude-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold-500 group-hover:text-white transition-colors">
            {icon}
        </div>
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-serif text-charcoal">{title}</h3>
            <span className="text-gold-600 font-semibold font-sans">{price}</span>
        </div>
        <p className="text-charcoal/60 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

const Services = () => {
    const services = [
        {
            title: "Brow Lamination",
            price: "R$ 100,00",
            description: "Alinhamento e volume para sobrancelhas mais expressivas e naturais.",
            icon: <Wind size={28} />,
            delay: 0.1,
        },
        {
            title: "Lash Lifting",
            price: "R$ 80,00",
            description: "Curvatura e hidratação profunda para cílios curvados e destacados.",
            icon: <Sparkles size={28} />,
            delay: 0.2,
        },
        {
            title: "Design + Henna",
            price: "R$ 55,00",
            description: "Modelagem personalizada com Henna ou Refectocil para um olhar definido.",
            icon: <Flower2 size={28} />,
            delay: 0.3,
        },
        {
            title: "Design Geral",
            price: "R$ 45,00",
            description: "Design de sobrancelhas masculino e feminino com foco na simetria facial.",
            icon: <Scissors size={28} />,
            delay: 0.4,
        },
        {
            title: "Limpeza de Pele",
            price: "R$ 100,00",
            description: "Tratamento facial profundo para remoção de impurezas e renovação celular.",
            icon: <Droplets size={28} />,
            delay: 0.5,
        },
        {
            title: "Epilação do Buço",
            price: "R$ 20,00",
            description: "Remoção precisa e suave de pelos com finalização hidratante.",
            icon: <User2 size={28} />,
            delay: 0.6,
        },
    ];

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
                        Descubra protocolos personalizados desenvolvidos para realçar a sua autenticidade e promover bem-estar.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ServiceCard key={index} {...service} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-charcoal/50 text-sm mb-6">Ficou com alguma dúvida sobre qual procedimento é ideal para você?</p>
                    <a
                        href="https:wa.me/553799999999"
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
