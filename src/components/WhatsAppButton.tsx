"use client";

import React from "react";
import { motion } from "framer-motion";

const WhatsAppButton = () => {
    const phoneNumber = "5537988047154";
    const message = encodeURIComponent("Olá Natália! Gostaria de saber mais sobre os seus serviços de estética.");
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="fixed bottom-8 right-8 z-[9999]"
        >
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#128C7E] transition-all hover:scale-110 active:scale-95"
                title="Fale conosco no WhatsApp"
            >
                {/* Official WhatsApp SVG Logo */}
                <svg
                    viewBox="0 0 448 512"
                    width="32"
                    height="32"
                    fill="currentColor"
                    className="relative z-10"
                >
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.8 69.4 27.2 106.1 27.2 122.4 0 222-99.6 222-222 0-59.3-23-115.1-64.9-157.1zM223.9 446.3c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.7-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-82.7 184.6-184.5 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.5-8.7-44.8-27.7-16.6-14.8-27.8-33.1-31.1-38.6-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.2 3.7-5.5 5.5-9.3 1.9-3.7.9-7-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 34.9 2.2 10.6-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>

                {/* Tooltip hint on hover */}
                <div className="absolute right-20 bg-white text-[var(--background-dark)] px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-gray-100 hidden md:block">
                    Falar com Natália
                    {/* Tooltip arrow */}
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 border-8 border-transparent border-l-white" />
                </div>
            </a>
        </motion.div>
    );
};

export default WhatsAppButton;
