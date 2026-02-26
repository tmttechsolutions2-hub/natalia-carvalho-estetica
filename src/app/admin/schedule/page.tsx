"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Square, CheckSquare, Ban } from "lucide-react";

export default function AdminScheduleBlocker() {
    const timeSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
        "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
        "17:00", "17:30", "18:00", "18:30", "19:00"
    ];

    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [blockedSlots, setBlockedSlots] = useState<string[]>([]);
    const [isRepeating, setIsRepeating] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 25)); // Feb 25, 2026

    const handlePrevDay = () => {
        const result = new Date(currentDate);
        result.setDate(result.getDate() - 1);
        setCurrentDate(result);
        setSelectedSlots([]);
        setBlockedSlots([]);
    };

    const handleNextDay = () => {
        const result = new Date(currentDate);
        result.setDate(result.getDate() + 1);
        setCurrentDate(result);
        setSelectedSlots([]);
        setBlockedSlots([]);
    };

    const formatFullDate = () => {
        const day = currentDate.getDate().toString().padStart(2, '0');
        const weekday = currentDate.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0];
        const month = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
        return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} De ${month.charAt(0).toUpperCase() + month.slice(1)}`;
    };

    const handleSelectAll = () => setSelectedSlots(timeSlots.filter(s => !blockedSlots.includes(s)));
    const handleClearSelection = () => setSelectedSlots([]);

    const handleSlotClick = (slot: string) => {
        if (blockedSlots.includes(slot)) {
            // Unblock
            setBlockedSlots(prev => prev.filter(s => s !== slot));
        } else {
            // Toggle selection
            setSelectedSlots(prev =>
                prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
            );
        }
    };

    const handleConfirmBlock = () => {
        if (selectedSlots.length === 0) return;

        setBlockedSlots(prev => [...prev, ...selectedSlots]);
        setSelectedSlots([]);

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                    <Link href="/admin" className="text-charcoal/60 hover:text-gold-500 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h2 className="text-3xl font-serif text-charcoal flex items-center space-x-3">
                        <Ban className="text-red-500" size={28} />
                        <span>Bloqueio de Horários</span>
                    </h2>
                </div>

                <div className="flex items-center justify-between border border-nude-100 rounded-full px-5 py-2.5 bg-white text-sm shadow-sm min-w-[300px]">
                    <button onClick={handlePrevDay} className="text-charcoal/40 hover:text-gold-500 transition-colors p-1">&lt;</button>
                    <div className="flex items-center justify-center space-x-2 px-4 flex-grow">
                        <Calendar size={16} className="text-gold-500 min-w-[16px]" />
                        <span className="font-bold text-charcoal whitespace-nowrap">{formatFullDate()}</span>
                    </div>
                    <button onClick={handleNextDay} className="text-charcoal/40 hover:text-gold-500 transition-colors p-1">&gt;</button>
                </div>
            </div>

            {/* Main Box */}
            <div className="bg-white border border-nude-100 rounded-3xl overflow-hidden shadow-sm p-6 md:p-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h3 className="text-xl font-serif text-charcoal font-bold">Selecione os horários para bloquear</h3>
                    <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-widest text-gold-500">
                        <button onClick={handleSelectAll} className="hover:text-gold-600 transition-colors">Selecionar Todos</button>
                        <span className="text-nude-100">|</span>
                        <button onClick={handleClearSelection} className="hover:text-gold-600 transition-colors">Limpar Seleção</button>
                    </div>
                </div>

                {/* Slots Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
                    {timeSlots.map((slot) => {
                        const isSelected = selectedSlots.includes(slot);
                        const isBlocked = blockedSlots.includes(slot);

                        return (
                            <button
                                key={slot}
                                onClick={() => handleSlotClick(slot)}
                                className={`py-3.5 rounded-xl text-sm font-bold transition-all border shadow-sm ${isBlocked
                                    ? "relative overflow-hidden bg-nude-50/50 text-charcoal/50 border-nude-100 hover:text-red-500 transition-colors after:absolute after:top-1/2 after:left-[-10%] after:w-[120%] after:h-[2px] after:-translate-y-1/2 after:-rotate-[20deg] after:bg-red-500/40 hover:after:bg-red-500"
                                    : isSelected
                                        ? "bg-red-50 text-red-500 border-red-200 ring-2 ring-red-500/20"
                                        : "bg-white border-nude-100 text-charcoal/70 hover:border-gold-500/50 hover:text-gold-600 hover:shadow-md hover:-translate-y-0.5"
                                    }`}
                            >
                                {slot}
                            </button>
                        );
                    })}
                </div>

                {/* Bottom Bar Container */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 border-t border-nude-50 gap-6">
                    {/* Repeat Checkbox */}
                    <button
                        onClick={() => setIsRepeating(!isRepeating)}
                        className={`flex items-center space-x-4 text-left group border px-6 py-4 rounded-2xl transition-all shadow-sm ${isRepeating ? "border-gold-500 bg-gold-50/30" : "border-nude-100 hover:border-gold-500/50 hover:bg-nude-50/50"
                            }`}
                    >
                        <div className={`transition-colors ${isRepeating ? "text-gold-500" : "text-nude-200 group-hover:text-gold-500"}`}>
                            {isRepeating ? <CheckSquare size={24} /> : <Square size={24} />}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-charcoal mb-0.5">Repetir diariamente</p>
                            <p className="text-xs text-charcoal/50 font-medium">Replica o bloqueio pelos próximos 30 dias</p>
                        </div>
                    </button>

                    {/* Submit Button */}
                    <button
                        onClick={handleConfirmBlock}
                        disabled={selectedSlots.length === 0}
                        className={`flex items-center justify-center space-x-2 px-8 py-4 rounded-full text-sm font-bold transition-all uppercase tracking-widest ${selectedSlots.length > 0
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95"
                            : "bg-red-500/40 text-white cursor-not-allowed"
                            }`}
                    >
                        <Ban size={18} />
                        <span>Confirmar Bloqueio</span>
                    </button>
                </div>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-charcoal text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-in slide-in-from-bottom-5 fade-in duration-300 z-50">
                    <CheckSquare className="text-emerald-400" size={20} />
                    <span className="font-bold">Horários bloqueados com sucesso!</span>
                </div>
            )}
        </div>
    );
}
