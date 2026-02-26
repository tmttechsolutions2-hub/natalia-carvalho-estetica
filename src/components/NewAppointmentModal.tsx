"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Circle, User, Phone, Mail, Calendar, Clock, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";
import { ServiceType, BookingState } from "../app/agendamento/page";

interface NewAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function NewAppointmentModal({ isOpen, onClose, onSuccess }: NewAppointmentModalProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [services, setServices] = useState<ServiceType[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [bookingData, setBookingData] = useState<BookingState>({
        selectedServices: [],
        date: null,
        time: null,
        client: { name: "", email: "", phone: "" },
    });

    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [isLoadingTimes, setIsLoadingTimes] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        if (isOpen) {
            fetchServices();
        } else {
            // Reset state when closing
            setCurrentStep(1);
            setBookingData({
                selectedServices: [],
                date: null,
                time: null,
                client: { name: "", email: "", phone: "" }
            });
        }
    }, [isOpen]);

    const fetchServices = async () => {
        setIsLoadingServices(true);
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('is_active', true)
            .order('name');

        if (data && !error) setServices(data);
        setIsLoadingServices(false);
    };

    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const getCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) days.push({ empty: true, key: `empty-${i}` });
        for (let i = 1; i <= daysInMonth; i++) {
            const dayString = i.toString().padStart(2, '0');
            const monthString = (month + 1).toString().padStart(2, '0');
            const formattedDate = `${dayString}/${monthString}`;
            days.push({ empty: false, date: formattedDate, day: i, key: formattedDate });
        }
        return days;
    };

    useEffect(() => {
        if (bookingData.date) {
            const fetchBookedTimes = async () => {
                setIsLoadingTimes(true);
                const [day, month] = bookingData.date!.split('/');
                const year = currentMonth.getFullYear();
                const dbDate = `${year}-${month}-${day}`;
                const { data } = await supabase.from('appointments').select('appointment_time').eq('appointment_date', dbDate).in('status', ['pendente', 'concluido']);
                setBookedTimes(data ? data.map(apt => apt.appointment_time.substring(0, 5)) : []);
                setIsLoadingTimes(false);
            };
            fetchBookedTimes();
        }
    }, [bookingData.date, currentMonth]);

    const getFilteredTimes = () => {
        if (!bookingData.date) return [];
        const [dStr, mStr] = bookingData.date.split('/');
        const yStr = currentMonth.getFullYear();
        const selectedDate = new Date(yStr, parseInt(mStr) - 1, parseInt(dStr));
        const dayOfWeek = selectedDate.getDay();
        let baseTimes: string[] = [];
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            for (let h = 8; h < 20; h++) { baseTimes.push(`${h.toString().padStart(2, '0')}:00`); baseTimes.push(`${h.toString().padStart(2, '0')}:30`); }
        } else if (dayOfWeek === 6) {
            for (let h = 7; h < 12; h++) { baseTimes.push(`${h.toString().padStart(2, '0')}:00`); baseTimes.push(`${h.toString().padStart(2, '0')}:30`); }
        } else return [];

        const today = new Date();
        const isToday = selectedDate.getDate() === today.getDate() && selectedDate.getMonth() === today.getMonth();
        return baseTimes.filter(t => {
            if (bookedTimes.includes(t)) return false;
            if (isToday) {
                const [th, tm] = t.split(':').map(Number);
                if (th < today.getHours() || (th === today.getHours() && tm <= today.getMinutes())) return false;
            }
            return true;
        });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        if (v.length > 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
        setBookingData({ ...bookingData, client: { ...bookingData.client, phone: v } });
    };

    const toggleService = (s: ServiceType) => {
        setBookingData(prev => {
            const has = prev.selectedServices.some(x => x.id === s.id);
            return { ...prev, selectedServices: has ? prev.selectedServices.filter(x => x.id !== s.id) : [...prev.selectedServices, s] };
        });
    };

    const totalValue = bookingData.selectedServices.reduce((acc, s) => acc + s.price, 0);

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        try {
            let clientId: string;
            const { data: existing } = await supabase.from('clients').select('id').eq('phone', bookingData.client.phone).single();
            if (existing) clientId = existing.id;
            else {
                const { data: nw, error: e1 } = await supabase.from('clients').insert([{ name: bookingData.client.name, email: bookingData.client.email || null, phone: bookingData.client.phone }]).select('id').single();
                if (e1) throw e1;
                clientId = nw.id;
            }
            const [d, m] = bookingData.date!.split('/');
            const y = currentMonth.getFullYear();
            const { data: appt, error: e2 } = await supabase.from('appointments').insert([{ client_id: clientId, appointment_date: `${y}-${m}-${d}`, appointment_time: bookingData.time, total_price: totalValue, status: 'pendente' }]).select('id').single();
            if (e2) throw e2;
            const apptSrvs = bookingData.selectedServices.map(s => ({ appointment_id: appt.id, service_id: s.id, price_at_booking: s.price }));
            const { error: e3 } = await supabase.from('appointment_services').insert(apptSrvs);
            if (e3) throw e3;
            onSuccess();
            onClose();
        } catch (e) {
            console.error(e);
            alert("Erro ao realizar agendamento.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
            <div className="bg-white border border-nude-100 rounded-[32px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300 z-10">
                {/* Header */}
                <div className="p-6 border-b border-nude-50 flex items-center justify-between bg-[#faf9f7]">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gold-500 p-2 rounded-xl text-white">
                            <Calendar size={20} />
                        </div>
                        <h2 className="text-xl font-serif font-bold text-charcoal">Novo Agendamento</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-nude-100 shadow-sm"><X size={20} /></button>
                </div>

                {/* Steps Bar */}
                <div className="px-8 py-4 bg-white border-b border-nude-50 flex justify-center">
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${currentStep === s ? "bg-gold-500 text-white" : currentStep > s ? "bg-charcoal text-white" : "bg-nude-100 text-charcoal/40"}`}>
                                {currentStep > s ? <CheckCircle2 size={16} /> : s}
                            </div>
                            {s < 4 && <div className={`w-8 md:w-16 h-1 mx-2 rounded-full ${currentStep > s ? "bg-charcoal" : "bg-nude-200"}`}></div>}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-nude-50/20">
                    {currentStep === 1 && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {isLoadingServices ? <Loader2 className="animate-spin text-gold-500 mx-auto py-10" /> :
                                    services.map(s => (
                                        <button key={s.id} onClick={() => toggleService(s)} className={`p-4 rounded-2xl border-2 text-left transition-all flex justify-between items-center ${bookingData.selectedServices.some(x => x.id === s.id) ? "border-gold-500 bg-gold-50/30" : "border-white bg-white shadow-sm hover:border-gold-500/30"}`}>
                                            <div>
                                                <h4 className="font-serif font-bold text-charcoal">{s.name}</h4>
                                                <p className="text-xs text-charcoal/50">{s.duration} • {s.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                            </div>
                                            <div className={`${bookingData.selectedServices.some(x => x.id === s.id) ? "text-gold-500" : "text-nude-200"}`}>
                                                {bookingData.selectedServices.some(x => x.id === s.id) ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="animate-in slide-in-from-right-4 duration-300 grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-2xl border border-nude-100 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold text-charcoal capitalize">{currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h4>
                                    <div className="flex space-x-2"><button onClick={handlePrevMonth}><ChevronLeft size={20} /></button><button onClick={handleNextMonth}><ChevronRight size={20} /></button></div>
                                </div>
                                <div className="grid grid-cols-7 gap-2">
                                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={`${d}-${i}`} className="text-center text-[10px] font-bold text-charcoal/30">{d}</div>)}
                                    {getCalendarDays().map(d => {
                                        if (d.empty) return <div key={d.key} />;

                                        const dateParts = d.date!.split('/');
                                        const dDate = new Date(currentMonth.getFullYear(), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));

                                        const now = new Date();
                                        now.setHours(0, 0, 0, 0);

                                        const isPast = dDate < now;
                                        const isSunday = dDate.getDay() === 0;

                                        return (
                                            <button
                                                key={d.date!}
                                                onClick={() => setBookingData({ ...bookingData, date: d.date!, time: null })}
                                                disabled={isPast || isSunday}
                                                className={`h-8 w-8 rounded-full text-xs font-bold transition-all ${bookingData.date === d.date ? "bg-gold-500 text-white" : "hover:bg-gold-50 text-charcoal disabled:opacity-20"}`}
                                            >
                                                {d.day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-charcoal mb-4">Horários para {bookingData.date || "..."}</h4>
                                {isLoadingTimes ? <Loader2 className="animate-spin text-gold-500 mx-auto" /> :
                                    <div className="grid grid-cols-3 gap-2">
                                        {getFilteredTimes().map(t => (
                                            <button key={t} onClick={() => setBookingData({ ...bookingData, time: t })} className={`py-2 rounded-lg text-sm font-bold border-2 transition-all ${bookingData.time === t ? "border-gold-500 bg-gold-50 text-gold-600" : "border-white bg-white hover:border-gold-500/30"}`}>{t}</button>
                                        ))}
                                    </div>
                                }
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="animate-in slide-in-from-right-4 duration-300 max-w-md mx-auto space-y-4">
                            <div className="space-y-1"><label className="text-xs font-bold text-charcoal/50 ml-2">Nome do Cliente</label><input type="text" value={bookingData.client.name} onChange={e => setBookingData({ ...bookingData, client: { ...bookingData.client, name: e.target.value } })} className="w-full p-4 rounded-xl border border-nude-100 bg-white focus:ring-2 ring-gold-500/20" placeholder="Ex: Maria Silva" /></div>
                            <div className="space-y-1"><label className="text-xs font-bold text-charcoal/50 ml-2">WhatsApp</label><input type="tel" value={bookingData.client.phone} onChange={handlePhoneChange} className="w-full p-4 rounded-xl border border-nude-100 bg-white focus:ring-2 ring-gold-500/20" placeholder="(00) 00000-0000" /></div>
                            <div className="space-y-1"><label className="text-xs font-bold text-charcoal/50 ml-2">E-mail (opcional)</label><input type="email" value={bookingData.client.email} onChange={e => setBookingData({ ...bookingData, client: { ...bookingData.client, email: e.target.value } })} className="w-full p-4 rounded-xl border border-nude-100 bg-white focus:ring-2 ring-gold-500/20" placeholder="cliente@email.com" /></div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="animate-in slide-in-from-right-4 duration-300 max-w-md mx-auto bg-white p-8 rounded-3xl border border-nude-100 shadow-sm space-y-6">
                            <div className="pb-4 border-b border-nude-50"><h4 className="text-xs font-bold text-gold-600 uppercase mb-4">Resumo</h4>
                                {bookingData.selectedServices.map(s => <div key={s.id} className="flex justify-between text-sm mb-2"><span className="font-medium">{s.name}</span><span className="font-bold">{s.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>)}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><p className="text-[10px] font-bold text-charcoal/40 uppercase">Data</p><p className="font-bold text-charcoal">{bookingData.date}</p></div>
                                <div className="space-y-1"><p className="text-[10px] font-bold text-charcoal/40 uppercase">Horário</p><p className="font-bold text-charcoal">{bookingData.time}</p></div>
                            </div>
                            <div className="pt-4 border-t border-nude-200 flex justify-between items-center"><span className="text-base font-bold text-charcoal">Total</span><span className="text-2xl font-serif font-bold text-gold-600">{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-nude-50 bg-white flex justify-between items-center px-8">
                    <button onClick={() => currentStep === 1 ? onClose() : setCurrentStep(s => s - 1)} className="text-sm font-bold text-charcoal/60 hover:text-charcoal transition-colors px-4 py-2">
                        {currentStep === 1 ? "Cancelar" : "Voltar Passo"}
                    </button>
                    {currentStep < 4 ? (
                        <button
                            onClick={() => setCurrentStep(s => s + 1)}
                            disabled={(currentStep === 1 && bookingData.selectedServices.length === 0) || (currentStep === 2 && (!bookingData.date || !bookingData.time)) || (currentStep === 3 && (!bookingData.client.name || bookingData.client.phone.length < 14))}
                            className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-gold-500/20 transition-all disabled:opacity-30"
                        >
                            Próximo Passo
                        </button>
                    ) : (
                        <button
                            onClick={handleConfirmBooking}
                            disabled={isSubmitting}
                            className="bg-charcoal hover:bg-charcoal/90 text-white px-10 py-3 rounded-xl font-bold text-sm shadow-xl shadow-charcoal/10 transition-all flex items-center space-x-2"
                        >
                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="text-gold-500" />}
                            <span>Finalizar Agendamento</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
