"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, Clock, Ban, CheckCircle2, User, Phone, CheckCircle, XCircle, MessageCircle, LogOut, Loader2, RefreshCw, Plus } from "lucide-react";
import { supabase } from "../../lib/supabase";
import NewAppointmentModal from "@/components/NewAppointmentModal";

export default function AdminDashboard() {
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
    const [isNewApptModalOpen, setIsNewApptModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);
    const [activeServicesCount, setActiveServicesCount] = useState(0);

    const [currentMonth, setCurrentMonth] = useState(new Date()); // Using current date

    // Set initial selected string to today in DD/MM
    const todayStr = `${new Date().getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const formatMonthYear = () => {
        const month = currentMonth.toLocaleDateString("pt-BR", { month: "long" });
        return `${month.charAt(0).toUpperCase() + month.slice(1)} ${currentMonth.getFullYear()}`;
    };

    // Live appointments state
    const [allPendingAppointments, setAllPendingAppointments] = useState<any[]>([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

    useEffect(() => {
        fetchAppointments();
        fetchActiveServicesCount();
    }, []);

    const fetchActiveServicesCount = async () => {
        const { count, error } = await supabase
            .from('services')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true);

        if (!error && count !== null) {
            setActiveServicesCount(count);
        }
    };

    const fetchAppointments = async () => {
        setIsLoadingAppointments(true);
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
            .in('status', ['pendente', 'concluido'])
            .order('appointment_time', { ascending: true });

        if (data && !error) {
            const now = new Date();

            const formatted = data.map(apt => {
                // Convert YYYY-MM-DD to DD/MM
                const dateParts = apt.appointment_date.split('-');
                const dateBR = `${dateParts[2]}/${dateParts[1]}`;

                // Extract service names
                const serviceNames = apt.appointment_services
                    .map((as: any) => as.services?.name)
                    .filter(Boolean)
                    .join(' + ');

                // Check if it's past
                // apt.appointment_date is YYYY-MM-DD
                // apt.appointment_time is HH:mm:ss
                const [year, month, day] = apt.appointment_date.split('-').map(Number);
                const [hour, minute] = apt.appointment_time.split(':').map(Number);
                const aptDateObj = new Date(year, month - 1, day, hour, minute);

                const isPast = aptDateObj < now;

                return {
                    id: apt.id,
                    rawDate: apt.appointment_date,
                    rawTime: apt.appointment_time,
                    date: dateBR,
                    time: apt.appointment_time.substring(0, 5),
                    client: (apt.clients as any)?.name || 'Cliente Desconhecido',
                    service: serviceNames || 'Sem serviço detalhado',
                    price: apt.total_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                    phone: (apt.clients as any)?.phone || '',
                    dbStatus: apt.status,
                    isPast
                };
            });
            setAllPendingAppointments(formatted);
        }
        setIsLoadingAppointments(false);
    };

    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dayString = i.toString().padStart(2, '0');
            const monthString = (month + 1).toString().padStart(2, '0');
            const formattedDate = `${dayString}/${monthString}`;
            const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" }).toUpperCase().replace('.', '');

            // Calculate appointments dynamically from the array (counting only pending)
            const totalAppointments = allPendingAppointments.filter(app => app.date === formattedDate && app.dbStatus === 'pendente').length;
            const hasAppointments = totalAppointments > 0;

            days.push({
                date: formattedDate,
                day: dayString,
                weekday: weekday,
                hasAppointments,
                totalAppointments
            });
        }
        return days;
    };

    const daysList = getDaysInMonth();

    React.useEffect(() => {
        if (!scrollContainerRef.current) return;

        const selectedEl = scrollContainerRef.current.querySelector('[data-selected="true"]') as HTMLElement;
        if (selectedEl) {
            const container = scrollContainerRef.current;
            const scrollLeft = selectedEl.offsetLeft - (container.offsetWidth / 2) + (selectedEl.offsetWidth / 2);
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, [selectedDate, currentMonth]);

    const allAppointmentsForSelectedDate = allPendingAppointments.filter(apt => apt.date === selectedDate);
    const displayAppointments = allAppointmentsForSelectedDate.filter(apt => apt.dbStatus === 'pendente');

    // Calculate metrics for the banner
    const dailyRevenueValue = allAppointmentsForSelectedDate
        .filter(apt => apt.dbStatus === 'concluido')
        .reduce((acc, apt) => acc + (typeof apt.price === 'string' ? parseFloat(apt.price.replace(/[^\d,]/g, '').replace(',', '.')) : 0), 0);

    const completedCount = allAppointmentsForSelectedDate.filter(apt => apt.dbStatus === 'concluido').length;

    // Helper for Banner Header
    const getBannerHeader = () => {
        const [d, m] = selectedDate.split('/');
        const year = currentMonth.getFullYear();
        const dateObj = new Date(year, parseInt(m) - 1, parseInt(d));
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const isToday = dateObj.getTime() === today.getTime();
        const weekday = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });

        return {
            title: isToday ? "Hoje" : `${d}/${m}`,
            subtitle: weekday.charAt(0).toUpperCase() + weekday.slice(1)
        };
    };

    const bannerInfo = getBannerHeader();

    const handleCompleteAppointment = async (id: string, newStatus: 'concluido' | 'cancelado' = 'concluido', notifyClient = false) => {
        setIsUpdatingStatus(id);

        const apt = allPendingAppointments.find(a => a.id === id);

        const { error } = await supabase
            .from('appointments')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            if (notifyClient && apt && newStatus === 'cancelado') {
                const phone = apt.phone.replace(/\D/g, "");
                const message = `Olá ${apt.client}. Infelizmente precisaremos cancelar seu agendamento do dia ${apt.date} às ${apt.time}. Pedimos desculpas pelo transtorno. Podemos remarcar? Digite Agendar para receber o link novamente.`;
                window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
            }

            setAllPendingAppointments(prev => prev.map(a => a.id === id ? { ...a, dbStatus: newStatus } : a));
            setIsCompleteModalOpen(false);
            setIsCancelModalOpen(false);
            setSelectedAppointment(null);
        }
        setIsUpdatingStatus(null);
    };

    const handleCancelAppointment = (id: string, notify = false) => {
        handleCompleteAppointment(id, 'cancelado', notify);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Quick Links / Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/admin/services" className="bg-white border border-nude-100 rounded-2xl p-5 hover:border-gold-500/50 transition-all group flex flex-col justify-between h-32 relative overflow-hidden shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start z-10">
                        <div className="text-gold-500 bg-gold-500/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                            <Sparkles size={20} />
                        </div>
                        <span className="text-charcoal/40 text-xs font-bold uppercase tracking-wider">{activeServicesCount} ativos</span>
                    </div>
                    <span className="text-charcoal font-bold z-10 font-serif">Serviços</span>
                    <div className="absolute -bottom-4 -right-4 text-nude-50 group-hover:text-gold-500/5 transition-colors">
                        <Sparkles size={100} />
                    </div>
                </Link>

                <Link href="/admin/finance" className="bg-white border border-nude-100 rounded-2xl p-5 hover:border-gold-500/50 transition-all group flex flex-col justify-between h-32 relative overflow-hidden shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start z-10">
                        <div className="text-emerald-500 bg-emerald-500/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-charcoal/40 text-xs font-bold uppercase tracking-wider">Relatórios</span>
                    </div>
                    <span className="text-charcoal font-bold z-10 font-serif">Financeiro</span>
                    <div className="absolute -bottom-4 -right-4 text-nude-50 group-hover:text-emerald-500/5 transition-colors">
                        <TrendingUp size={100} />
                    </div>
                </Link>

                <Link href="/admin/history" className="bg-white border border-nude-100 rounded-2xl p-5 hover:border-gold-500/50 transition-all group flex flex-col justify-between h-32 relative overflow-hidden shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start z-10">
                        <div className="text-blue-500 bg-blue-500/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                            <Clock size={20} />
                        </div>
                        <span className="text-charcoal/40 text-xs font-bold uppercase tracking-wider">Mês atual</span>
                    </div>
                    <div className="flex items-end justify-between z-10 mt-2">
                        <span className="text-charcoal font-bold font-serif text-lg">Histórico</span>
                    </div>
                </Link>

                <Link href="/admin/schedule" className="bg-white border border-nude-100 rounded-2xl p-5 hover:border-gold-500/50 transition-all group flex flex-col justify-between h-32 relative overflow-hidden shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-start z-10">
                        <div className="text-red-500 bg-red-400/10 p-2 rounded-xl group-hover:scale-110 transition-transform">
                            <Ban size={20} />
                        </div>
                        <span className="text-charcoal/40 text-xs font-bold uppercase tracking-wider">Agenda</span>
                    </div>
                    <span className="text-charcoal font-bold z-10 font-serif">Bloqueios</span>
                </Link>
            </div>

            {/* Day Summary Banner */}
            <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between shadow-xl shadow-gold-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

                <div className="relative z-10 mb-6 md:mb-0">
                    <p className="text-white/90 font-medium text-xs uppercase tracking-widest mb-2">Resumo do Dia</p>
                    <div className="flex items-baseline space-x-3">
                        <h2 className="text-4xl font-serif text-white font-bold">{bannerInfo.title}</h2>
                        <span className="text-white/80 font-medium">{bannerInfo.subtitle}</span>
                    </div>
                </div>

                <div className="relative z-10 flex justify-between md:justify-end md:space-x-12 w-full md:w-auto">
                    <div className="text-center md:text-right flex-1 md:flex-none">
                        <p className="text-white/80 text-xs uppercase tracking-widest font-bold mb-1">Faturamento</p>
                        <p className="text-2xl md:text-3xl font-bold text-white">
                            {dailyRevenueValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                    </div>
                    <div className="text-center md:text-right border-l border-white/20 pl-4 md:pl-12 flex-1 md:flex-none">
                        <p className="text-white/80 text-xs uppercase tracking-widest font-bold mb-1">Concluídos</p>
                        <p className="text-2xl md:text-3xl font-bold text-white">{completedCount}</p>
                    </div>
                </div>
            </div>

            {/* Agenda Viewer */}
            <div className="bg-gradient-to-b from-[#faf9f7] to-white border border-nude-100/60 rounded-[32px] p-6 md:p-8 shadow-sm relative overflow-hidden">
                {/* Subtle Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                    <h3 className="text-2xl font-serif text-charcoal flex items-center space-x-2">
                        <span>Sua Agenda</span>
                        <div className="h-px w-12 bg-gold-500/40 ml-4 hidden sm:block"></div>
                    </h3>
                    <div className="flex items-center space-x-2 text-sm bg-white border border-nude-100 rounded-full px-2 py-1.5 shadow-sm mx-auto sm:mx-0">
                        <button onClick={handlePrevMonth} className="text-charcoal/40 hover:text-gold-500 hover:bg-gold-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors font-bold text-lg">&lt;</button>
                        <span className="font-bold text-charcoal min-w-[120px] text-center tracking-wide">{formatMonthYear()}</span>
                        <button onClick={handleNextMonth} className="text-charcoal/40 hover:text-gold-500 hover:bg-gold-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors font-bold text-lg">&gt;</button>
                    </div>
                </div>

                {/* Calendar Strip Container */}
                <div className="relative mb-2 z-10">
                    <div
                        ref={scrollContainerRef}
                        className="flex gap-3 overflow-x-auto hide-scrollbar pb-6 pt-4 px-2 md:px-0 snap-x"
                    >
                        {daysList.map((dayObj) => {
                            const isActive = selectedDate === dayObj.date;
                            return (
                                <button
                                    key={dayObj.date}
                                    data-selected={isActive}
                                    onClick={() => setSelectedDate(dayObj.date)}
                                    className={`flex flex-col items-center justify-center w-[76px] h-[96px] rounded-[18px] shrink-0 border relative transition-all snap-center ${isActive
                                        ? "bg-[#1C1C1C] border-[#1C1C1C] shadow-lg shadow-black/20 scale-110 z-10"
                                        : "bg-white border-nude-200/40 shadow-sm hover:border-gold-500/30 hover:shadow-md hover:-translate-y-1"
                                        }`}
                                >
                                    {/* Top Left Badge: Total Appointments */}
                                    {dayObj.totalAppointments > 0 && (
                                        <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-[3px] border-[#faf9f7] bg-white text-charcoal shadow-sm z-20">
                                            {dayObj.totalAppointments}
                                        </div>
                                    )}

                                    <span className={`text-[9px] font-bold tracking-[0.15em] mb-1.5 ${isActive ? "text-white/80" : "text-charcoal/40"}`}>
                                        {dayObj.weekday}
                                    </span>
                                    <span className={`text-[2rem] leading-none font-serif font-bold ${isActive ? "text-gold-500" : "text-charcoal"}`}>
                                        {dayObj.day}
                                    </span>

                                    {/* Bottom Green Dot: Has Appointments */}
                                    {dayObj.hasAppointments ? (
                                        <div className={`absolute bottom-3 w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-emerald-500"}`}></div>
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Day Pending List */}
            <div className="bg-white border border-nude-100 rounded-3xl overflow-hidden mt-4 shadow-sm">
                <div className="p-6 border-b border-nude-50 flex justify-between items-center bg-[#faf9f7]">
                    <h4 className="text-lg font-serif text-charcoal font-bold">Agenda do Dia (Pendentes)</h4>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={fetchAppointments}
                            disabled={isLoadingAppointments}
                            className="p-2.5 text-gold-600 hover:text-gold-700 hover:bg-gold-50 transition-colors rounded-full border border-gold-200 shadow-sm disabled:opacity-50"
                            title="Atualizar Agenda"
                        >
                            <RefreshCw size={18} className={isLoadingAppointments ? "animate-spin" : ""} />
                        </button>
                        <button
                            onClick={() => setIsNewApptModalOpen(true)}
                            className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-md shadow-gold-500/20 hover:-translate-y-0.5 flex items-center space-x-2"
                        >
                            <Plus size={16} />
                            <span>Novo Agendamento</span>
                        </button>
                    </div>
                </div>

                <div className="divide-y divide-nude-50">
                    {isLoadingAppointments ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <Loader2 className="text-gold-500 w-12 h-12 mb-4 animate-spin" />
                            <h4 className="text-lg font-bold text-charcoal mb-2">Carregando Agenda...</h4>
                        </div>
                    ) : displayAppointments.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <CheckCircle2 className="text-nude-200 w-16 h-16 mb-4" />
                            <h4 className="text-lg font-bold text-charcoal mb-2">Sem agendamentos</h4>
                            <p className="text-charcoal/50 text-sm max-w-[250px]">
                                Nenhum agendamento marcado para o dia selecionado.
                            </p>
                        </div>
                    ) : (
                        displayAppointments.map((apt) => (
                            <div key={apt.id} className="p-4 md:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-nude-50/50 transition-colors group relative">
                                {/* Left golden edge accent matching the reference */}
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gold-400"></div>

                                <div className="flex items-start lg:items-center space-x-6 pl-2">
                                    {/* Time Block */}
                                    <div className="bg-[#f0e8dc] text-gold-600 px-5 py-4 rounded-xl min-w-[90px] text-center shadow-sm">
                                        <p className="text-2xl font-bold tracking-tight">{apt.time}</p>
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <div className="flex items-center space-x-3 mb-1.5">
                                            <User size={16} className="text-charcoal/40" />
                                            <h4 className="text-charcoal font-bold font-serif text-lg">{apt.client}</h4>
                                            {apt.dbStatus === 'pendente' && apt.isPast && (
                                                <span className="bg-red-500 text-[10px] text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                                    AGUARDANDO CONCLUSÃO
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-charcoal/60 text-sm font-medium mb-1.5">
                                            {apt.service} <span className="text-nude-200 mx-1">•</span> <span className="text-charcoal font-bold">{apt.price}</span>
                                        </p>
                                        <p className="text-charcoal/40 text-xs flex items-center space-x-1.5 font-mono">
                                            <Phone size={14} />
                                            <span>{apt.phone}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center gap-2 pr-2">
                                    <button
                                        onClick={() => {
                                            const phone = apt.phone.replace(/\D/g, "");
                                            window.open(`https://wa.me/55${phone}`, '_blank');
                                        }}
                                        className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-sm"
                                    >
                                        <MessageCircle size={14} />
                                        <span>WhatsApp</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedAppointment(apt);
                                            setIsCancelModalOpen(true);
                                        }}
                                        className="flex items-center space-x-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-sm"
                                    >
                                        <Ban size={14} />
                                        <span>Cancelar</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedAppointment(apt);
                                            setIsCompleteModalOpen(true);
                                        }}
                                        className="flex items-center space-x-1.5 bg-gold-500 hover:bg-gold-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-all shadow-md shadow-gold-500/20"
                                    >
                                        <CheckCircle2 size={14} />
                                        <span>Concluir</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* --- MODALS --- */}

            {/* Cancel Modal */}
            {
                isCancelModalOpen && selectedAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white border border-nude-100 rounded-3xl shadow-2xl w-full max-w-[400px] p-8 relative animate-in zoom-in-95 duration-200">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6 ring-4 ring-white shadow-sm border border-red-100">
                                    <Ban size={32} />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-red-500 mb-4">Cancelar Agendamento?</h3>
                                <p className="text-charcoal/60 font-medium text-[15px] mb-8 leading-relaxed">
                                    Você está prestes a cancelar o horário de <span className="text-charcoal font-bold">{selectedAppointment.client}</span>.<br />
                                    Ao confirmar, o status será atualizado.
                                </p>

                                <div className="w-full flex flex-col items-center space-y-5">
                                    <button
                                        onClick={() => handleCancelAppointment(selectedAppointment.id, true)}
                                        disabled={isUpdatingStatus === selectedAppointment.id}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl text-[15px] font-bold flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
                                    >
                                        {isUpdatingStatus === selectedAppointment.id ? <Loader2 size={20} className="animate-spin" /> : < Ban size={20} />}
                                        <span>Confirmar e avisar o cliente</span>
                                    </button>
                                    <button
                                        onClick={() => setIsCancelModalOpen(false)}
                                        className="text-charcoal/60 hover:text-charcoal font-medium text-[15px] hover:underline underline-offset-4 transition-all"
                                    >
                                        Voltar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Complete Modal */}
            {
                isCompleteModalOpen && selectedAppointment && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white border border-nude-100 rounded-3xl shadow-2xl w-full max-w-[400px] p-8 relative animate-in zoom-in-95 duration-200">
                            <div className="flex flex-col items-center text-center">
                                <h3 className="text-2xl font-serif font-bold text-charcoal mb-4">Encerrar Atendimento</h3>
                                <p className="text-charcoal/60 font-medium text-[15px] mb-8 leading-relaxed">
                                    O que aconteceu com o agendamento de <span className="text-charcoal font-bold">{selectedAppointment.client}</span> às {selectedAppointment.time}?
                                </p>

                                <div className="w-full flex flex-col items-center space-y-4">
                                    <button
                                        onClick={() => handleCompleteAppointment(selectedAppointment.id, 'concluido')}
                                        disabled={isUpdatingStatus === selectedAppointment.id}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl text-[15px] font-bold flex items-center justify-center space-x-2 transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {isUpdatingStatus === selectedAppointment.id ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                                        <span>Atendimento Realizado</span>
                                    </button>
                                    <button
                                        onClick={() => handleCompleteAppointment(selectedAppointment.id, 'cancelado')}
                                        disabled={isUpdatingStatus === selectedAppointment.id}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl text-[15px] font-bold flex items-center justify-center space-x-2 transition-colors shadow-sm disabled:opacity-50"
                                    >
                                        {isUpdatingStatus === selectedAppointment.id ? <Loader2 size={20} className="animate-spin" /> : <LogOut size={20} className="rotate-180" />}
                                        <span>Cliente Não Compareceu</span>
                                    </button>

                                    <div className="pt-2">
                                        <button
                                            onClick={() => setIsCompleteModalOpen(false)}
                                            className="text-charcoal/60 hover:text-charcoal font-medium text-[15px] hover:underline underline-offset-4 transition-all"
                                        >
                                            Cancelar (Fechar)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* New Appointment Modal */}
            <NewAppointmentModal
                isOpen={isNewApptModalOpen}
                onClose={() => setIsNewApptModalOpen(false)}
                onSuccess={() => {
                    fetchAppointments();
                }}
            />
        </div>
    );
}
