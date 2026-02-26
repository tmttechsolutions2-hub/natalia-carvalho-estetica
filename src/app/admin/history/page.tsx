"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Phone, CheckCircle2, X, Ban, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function AdminHistory() {
    const [filter, setFilter] = useState("Todos");
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevDay = () => {
        const result = new Date(currentDate);
        result.setDate(result.getDate() - 1);
        setCurrentDate(result);
    };

    const handleNextDay = () => {
        const result = new Date(currentDate);
        result.setDate(result.getDate() + 1);
        setCurrentDate(result);
    };

    const formatWeekdayAndDay = () => {
        const day = currentDate.getDate().toString().padStart(2, '0');
        const weekday = currentDate.toLocaleDateString('pt-BR', { weekday: 'long' }).split('-')[0];
        return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} De`;
    };

    const formatMonth = () => {
        const month = currentDate.toLocaleDateString('pt-BR', { month: 'long' });
        return month.charAt(0).toUpperCase() + month.slice(1);
    };

    const [historyData, setHistoryData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    id,
                    appointment_date,
                    appointment_time,
                    total_price,
                    status,
                    clients (name, phone),
                    appointment_services (
                        services (name)
                    )
                `)
                .in('status', ['concluido', 'cancelado'])
                .order('appointment_date', { ascending: false });

            if (data && !error) {
                const formatted = data.map(apt => {
                    const dateParts = apt.appointment_date.split('-');
                    const dateBR = `${dateParts[2]}/${dateParts[1]}`;

                    const serviceNames = apt.appointment_services
                        .map((as: any) => as.services?.name)
                        .filter(Boolean)
                        .join(' + ');

                    return {
                        id: apt.id,
                        date: dateBR,
                        time: apt.appointment_time,
                        client: (apt.clients as any)?.name || 'Desconhecido',
                        service: serviceNames || 'Sem serviço',
                        price: apt.total_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                        phone: (apt.clients as any)?.phone || 'Sem contato',
                        status: apt.status === 'concluido' ? 'Concluído' : 'Cancelado'
                    };
                });
                setHistoryData(formatted);
            }
            setIsLoading(false);
        };

        fetchHistory();
    }, []);

    const selectedDateStr = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;

    const filteredData = historyData.filter(item => {
        const matchesDate = item.date === selectedDateStr;
        const matchesStatus = filter === "Todos" || item.status === filter;
        return matchesDate && matchesStatus;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header and Filters */}
            <div className="flex flex-nowrap items-center gap-4 overflow-x-auto hide-scrollbar pb-2">
                {/* Title */}
                <div className="flex items-center space-x-3 pr-2 shrink-0">
                    <Link href="/admin" className="text-charcoal/60 hover:text-gold-500 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h2 className="text-xl font-serif text-charcoal flex items-center space-x-2">
                        <CheckCircle2 className="text-emerald-500" size={24} />
                        <span className="font-bold">Histórico</span>
                    </h2>
                </div>

                {/* Filters */}
                <div className="flex p-1 bg-white border border-nude-200 rounded-xl shadow-sm shrink-0">
                    <button
                        onClick={() => setFilter("Todos")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "Todos" ? "bg-gold-500 text-white shadow-sm shadow-gold-500/20" : "text-charcoal/80 hover:bg-nude-50"}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter("Concluído")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "Concluído" ? "bg-gold-500 text-white shadow-sm shadow-gold-500/20" : "text-charcoal/80 hover:bg-nude-50"}`}
                    >
                        Concluídos
                    </button>
                    <button
                        onClick={() => setFilter("Cancelado")}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "Cancelado" ? "bg-gold-500 text-white shadow-sm shadow-gold-500/20" : "text-charcoal/80 hover:bg-nude-50"}`}
                    >
                        Cancelados
                    </button>
                </div>

                {/* Date Navigation & Clear Filters */}
                <div className="flex items-center space-x-1 border border-nude-200 rounded-xl p-1 bg-white shadow-sm shrink-0">
                    <button onClick={handlePrevDay} className="p-2 text-charcoal/50 hover:text-gold-500 hover:bg-nude-50 transition-colors rounded-lg">&lt;</button>

                    <div className="px-2 text-center w-[180px] min-w-[180px] max-w-[180px] shrink-0">
                        <p className="text-sm text-charcoal font-bold whitespace-nowrap overflow-hidden text-ellipsis">{formatWeekdayAndDay()} {formatMonth()}</p>
                    </div>

                    <button onClick={handleNextDay} className="p-2 text-charcoal/50 hover:text-gold-500 hover:bg-nude-50 transition-colors rounded-lg">&gt;</button>

                    <div className="h-6 w-px bg-nude-200 mx-1"></div>

                    <button
                        onClick={() => setFilter("Todos")}
                        className="flex items-center justify-center space-x-1.5 px-3 py-2 text-sm font-bold text-charcoal/70 hover:text-charcoal transition-colors hover:bg-nude-50 rounded-lg whitespace-nowrap"
                    >
                        <X size={14} />
                        <span>Todos</span>
                    </button>
                </div>
            </div>

            {/* History List */}
            <div className="bg-white border border-nude-100 rounded-3xl overflow-hidden divide-y divide-nude-100 shadow-sm">
                {isLoading ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <Loader2 className="text-gold-500 w-12 h-12 mb-4 animate-spin" />
                        <h4 className="text-lg font-bold text-charcoal mb-2">Carregando Histórico...</h4>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="p-12 text-center text-charcoal/50 font-medium">Nenhum agendamento encontrado para este filtro.</div>
                ) : (
                    filteredData.map((item) => (
                        <div key={item.id} className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#faf9f7] transition-colors group">
                            <div className="flex items-start md:items-center space-x-8">
                                {/* Date / Time */}
                                <div className="text-center min-w-[70px] bg-nude-50 p-3 rounded-2xl">
                                    <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold mb-1">{item.date}</p>
                                    <p className="text-xl text-gold-500 font-bold tracking-tight">{item.time}</p>
                                </div>

                                {/* Info */}
                                <div>
                                    <h4 className="text-charcoal font-serif text-xl font-bold mb-2 flex items-center space-x-2">
                                        <User size={18} className="text-gold-500" />
                                        <span>{item.client}</span>
                                    </h4>
                                    <p className="text-charcoal/60 text-sm mb-3 font-medium">
                                        {item.service} &bull; <span className="text-charcoal font-bold">{item.price}</span>
                                    </p>
                                    <p className="text-charcoal/40 text-xs flex items-center space-x-1.5 font-mono">
                                        <Phone size={14} />
                                        <span>{item.phone}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Status Tag */}
                            <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 border-nude-50 pt-6 md:pt-0">
                                {item.status === "Concluído" ? (
                                    <div className="flex items-center space-x-1.5 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 rounded-full text-emerald-400">
                                        <CheckCircle2 size={14} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Concluído</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-1.5 border border-red-500/30 bg-red-500/10 px-3 py-1.5 rounded-full text-red-400">
                                        <Ban size={14} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Cancelado</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
