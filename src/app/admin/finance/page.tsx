"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, DollarSign, Calendar, Flame, PieChart, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function AdminFinance() {
    const currentYear = new Date().getFullYear();
    const months = [
        `Janeiro ${currentYear}`, `Fevereiro ${currentYear}`, `Março ${currentYear}`, `Abril ${currentYear}`,
        `Maio ${currentYear}`, `Junho ${currentYear}`, `Julho ${currentYear}`, `Agosto ${currentYear}`,
        `Setembro ${currentYear}`, `Outubro ${currentYear}`, `Novembro ${currentYear}`, `Dezembro ${currentYear}`
    ];

    const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    id,
                    appointment_date,
                    total_price,
                    appointment_services (
                        price_at_booking,
                        services (name)
                    )
                `)
                .eq('status', 'concluido');

            if (data && !error) {
                setAppointments(data);
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const selectedMonthAppointments = useMemo(() => {
        return appointments.filter(apt => {
            const month = parseInt(apt.appointment_date.split('-')[1], 10) - 1;
            const year = parseInt(apt.appointment_date.split('-')[0], 10);
            return month === currentMonthIndex && year === currentYear;
        });
    }, [appointments, currentMonthIndex, currentYear]);

    const revenue = selectedMonthAppointments.reduce((acc, apt) => acc + Number(apt.total_price), 0);
    const volume = selectedMonthAppointments.length;
    const ticketMedio = volume > 0 ? (revenue / volume) : 0;

    const handlePrevMonth = () => {
        if (currentMonthIndex > 0) setCurrentMonthIndex(currentMonthIndex - 1);
    };

    const handleNextMonth = () => {
        if (currentMonthIndex < months.length - 1) setCurrentMonthIndex(currentMonthIndex + 1);
    };

    const chartData = useMemo(() => {
        const serviceStats: Record<string, { volume: number, revenue: number }> = {};

        selectedMonthAppointments.forEach(apt => {
            apt.appointment_services.forEach((as: any) => {
                const name = as.services?.name || 'Outro';
                const price = Number(as.price_at_booking);
                if (!serviceStats[name]) serviceStats[name] = { volume: 0, revenue: 0 };
                serviceStats[name].volume += 1;
                serviceStats[name].revenue += price;
            });
        });

        const maxVol = Math.max(...Object.values(serviceStats).map(s => s.volume), 1); // min 1 to avoid div by zero
        const colors = ["bg-gold-500", "bg-gold-600", "bg-gold-500/70", "bg-gold-600/70", "bg-gold-500/50"];

        return Object.entries(serviceStats)
            .sort((a, b) => b[1].volume - a[1].volume)
            .slice(0, 5) // top 5
            .map(([name, stats], index) => {
                const heightPct = Math.max(10, Math.round((stats.volume / maxVol) * 90)); // minimum 10% height to be visible
                return {
                    name,
                    value: stats.volume,
                    heightPct,
                    color: colors[index % colors.length],
                    revenue: stats.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                };
            });
    }, [selectedMonthAppointments]);

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-nude-100 pb-8">
                <div className="flex items-center space-x-4">
                    <Link href="/admin" className="text-charcoal/60 hover:text-gold-500 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h2 className="text-3xl font-serif text-charcoal mb-1">Relatório Financeiro</h2>
                        <p className="text-charcoal/50 text-sm font-medium">Acompanhe o desempenho da sua clínica</p>
                    </div>
                </div>
                <div className="flex items-center justify-between md:justify-end space-x-4 border border-nude-100 rounded-full px-4 py-2 bg-white shadow-sm text-sm">
                    <button
                        onClick={handlePrevMonth}
                        className={`transition-colors ${currentMonthIndex === 0 ? 'text-nude-200 cursor-not-allowed' : 'text-charcoal/40 hover:text-gold-500'}`}
                    >
                        &lt;
                    </button>
                    <span className="font-bold text-charcoal px-4 uppercase tracking-widest text-[10px] w-40 text-center pointer-events-none">
                        {months[currentMonthIndex]}
                    </span>
                    <button
                        onClick={handleNextMonth}
                        className={`transition-colors ${currentMonthIndex === months.length - 1 ? 'text-nude-200 cursor-not-allowed' : 'text-charcoal/40 hover:text-gold-500'}`}
                    >
                        &gt;
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-nude-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-8">
                        <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-2xl border border-emerald-500/20">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-charcoal/40 text-xs font-bold uppercase tracking-widest">Mensal</span>
                    </div>
                    <div>
                        <p className="text-charcoal/50 text-sm mb-1 font-medium">Faturamento Total</p>
                        <p className="text-4xl font-serif text-charcoal font-bold">
                            {isLoading ? <Loader2 size={32} className="animate-spin text-charcoal/30 inline-block" /> : `R$ ${revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-nude-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-8">
                        <div className="bg-blue-500/10 text-blue-500 p-3 rounded-2xl border border-blue-500/20">
                            <Calendar size={24} />
                        </div>
                        <span className="text-charcoal/40 text-xs font-bold uppercase tracking-widest">Volume</span>
                    </div>
                    <div>
                        <p className="text-charcoal/50 text-sm mb-1 font-medium">Atendimentos Realizados</p>
                        <p className="text-4xl font-serif text-charcoal font-bold">
                            {isLoading ? <Loader2 size={32} className="animate-spin text-charcoal/30 inline-block" /> : volume}
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-nude-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="bg-gold-500/10 text-gold-500 p-3 rounded-2xl border border-gold-500/20">
                            <Flame size={24} />
                        </div>
                        <span className="text-charcoal/40 text-xs font-bold uppercase tracking-widest">Média</span>
                    </div>
                    <div className="relative z-10">
                        <p className="text-charcoal/50 text-sm mb-1 font-medium">Ticket Médio</p>
                        <p className="text-4xl font-serif text-charcoal font-bold">
                            {isLoading ? <Loader2 size={32} className="animate-spin text-charcoal/30 inline-block" /> : `R$ ${ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-nude-100 rounded-3xl p-6 md:p-8 shadow-sm">
                    <div className="flex items-center space-x-3 mb-12">
                        <div className="text-gold-500 bg-gold-500/10 p-2 rounded-lg">
                            <PieChart size={24} />
                        </div>
                        <h3 className="text-xl font-serif text-charcoal font-bold">Desempenho por Serviço</h3>
                    </div>

                    <div className="h-64 flex items-end justify-between md:justify-start md:space-x-16 border-b border-nude-100 pb-4 relative">
                        {/* Y-axis Guides */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4">
                            {[16, 12, 8, 4, 0].map((val, i) => (
                                <div key={i} className="flex items-center w-full">
                                    <span className="text-[10px] text-charcoal/30 font-bold w-6 text-right pr-2">{val}</span>
                                    <div className="border-b border-dashed border-nude-100 flex-grow"></div>
                                </div>
                            ))}
                        </div>

                        {/* Bars */}
                        <div className="flex items-end justify-around w-full ml-8 relative z-10 h-full">
                            {chartData.map((item, i) => (
                                <div key={i} className="flex flex-col items-center w-12 md:w-16 h-full justify-end group">
                                    <div
                                        className={`w-full ${item.color} rounded-t-xl transition-all duration-500 group-hover:brightness-110 group-hover:scale-y-105 origin-bottom relative shadow-md`}
                                        style={{ height: `${item.heightPct}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                                            {item.value} atends.
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-charcoal/60 mt-4 text-center max-w-[60px] truncate md:overflow-visible md:whitespace-nowrap">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Revenue breakdown list matching reference site */}
                <div className="bg-white border border-nude-100 rounded-3xl p-6 md:p-8 shadow-sm">
                    <h3 className="text-lg font-serif text-charcoal font-bold mb-6">Receita por Serviço</h3>
                    <div className="space-y-4">
                        {chartData.map((item, i) => (
                            <div key={i} className="flex justify-between items-center bg-nude-50/50 p-3 rounded-xl border border-nude-100 hover:border-gold-500/30 transition-colors">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                    <span className="font-bold text-charcoal text-sm">{item.name}</span>
                                </div>
                                <span className="font-bold text-gold-600 text-sm">{item.revenue}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
