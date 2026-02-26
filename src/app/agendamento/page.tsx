"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

// Types for State
export type ServiceType = {
    id: string;
    name: string;
    duration: string;
    price: number;
    description?: string;
};

export type BookingState = {
    selectedServices: ServiceType[];
    date: string | null;
    time: string | null;
    client: {
        name: string;
        email: string;
        phone: string;
    };
};

export default function BookingWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [services, setServices] = useState<ServiceType[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);
    const [bookingData, setBookingData] = useState<BookingState>({
        selectedServices: [],
        date: null,
        time: null,
        client: { name: "", email: "", phone: "" },
    });

    const [bookedTimes, setBookedTimes] = useState<string[]>([]);
    const [isLoadingTimes, setIsLoadingTimes] = useState(false);

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());

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
            setIsLoadingServices(false);
        };
        fetchServices();
    }, []);

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const formatMonthYear = () => {
        const result = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    const getCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];

        // Add empty padding for days before the 1st
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({ empty: true, key: `empty-${i}` });
        }

        // Add actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dayString = i.toString().padStart(2, '0');
            const monthString = (month + 1).toString().padStart(2, '0');
            const formattedDate = `${dayString}/${monthString}`;
            days.push({ empty: false, date: formattedDate, day: i, key: formattedDate });
        }
        return days;
    };

    const calendarDays = getCalendarDays();

    useEffect(() => {
        if (bookingData.date) {
            const fetchBookedTimes = async () => {
                setIsLoadingTimes(true);
                const [day, month] = bookingData.date!.split('/');
                const year = currentMonth.getFullYear();
                const dbDate = `${year}-${month}-${day}`;

                const { data, error } = await supabase
                    .from('appointments')
                    .select('appointment_time')
                    .eq('appointment_date', dbDate)
                    .in('status', ['pendente', 'concluido']);

                if (data && !error) {
                    // Postgres time might return 'HH:mm:ss', so we substring to 'HH:mm'
                    setBookedTimes(data.map(apt => apt.appointment_time.substring(0, 5)));
                } else {
                    setBookedTimes([]);
                }
                setIsLoadingTimes(false);
            };
            fetchBookedTimes();
        } else {
            setBookedTimes([]);
        }
    }, [bookingData.date, currentMonth]);

    const getFilteredTimes = () => {
        if (!bookingData.date) return [];

        const [dayStr, monthStr] = bookingData.date.split('/');
        const yearStr = currentMonth.getFullYear();
        const selectedDate = new Date(yearStr, parseInt(monthStr) - 1, parseInt(dayStr));
        const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        // 1. Generate Base Times for that specific day
        let dailyBaseTimes: string[] = [];

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            // Monday - Friday: 08:00 - 20:00
            for (let hour = 8; hour < 20; hour++) {
                dailyBaseTimes.push(`${hour.toString().padStart(2, '0')}:00`);
                dailyBaseTimes.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        } else if (dayOfWeek === 6) {
            // Saturday: 07:00 - 12:00
            for (let hour = 7; hour < 12; hour++) {
                dailyBaseTimes.push(`${hour.toString().padStart(2, '0')}:00`);
                dailyBaseTimes.push(`${hour.toString().padStart(2, '0')}:30`);
            }
        } else {
            // Sunday: Closed
            return [];
        }

        const today = new Date();
        const isToday = selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear();

        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();

        return dailyBaseTimes.filter(time => {
            // Check if already booked
            if (bookedTimes.includes(time)) return false;

            // Check if it's in the past (only if selected date is today)
            if (isToday) {
                const [timeHour, timeMinute] = time.split(':').map(Number);
                if (timeHour < currentHour || (timeHour === currentHour && timeMinute <= currentMinute)) {
                    return false;
                }
            }
            return true;
        });
    };

    const finalAvailableTimes = getFilteredTimes();

    const isStep1Valid = bookingData.selectedServices.length > 0;
    const isStep2Valid = bookingData.date !== null && bookingData.time !== null;
    const isStep3Valid = bookingData.client.name.length > 2 && bookingData.client.phone.length >= 14;

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 11) value = value.slice(0, 11);

        // Basic mask (XX) XXXXX-XXXX
        if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }
        if (value.length > 10) {
            value = `${value.slice(0, 10)}-${value.slice(10)}`;
        }

        setBookingData({
            ...bookingData,
            client: { ...bookingData.client, phone: value }
        });
    };

    const toggleService = (service: ServiceType) => {
        setBookingData(prev => {
            const isSelected = prev.selectedServices.some(s => s.id === service.id);
            if (isSelected) {
                return { ...prev, selectedServices: prev.selectedServices.filter(s => s.id !== service.id) };
            } else {
                return { ...prev, selectedServices: [...prev.selectedServices, service] };
            }
        });
    };

    const totalValue = bookingData.selectedServices.reduce((acc, s) => acc + s.price, 0);

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        try {
            // 1. Check or Insert Client
            let clientId: string;
            const { data: existingClient } = await supabase
                .from('clients')
                .select('id')
                .eq('phone', bookingData.client.phone)
                .single();

            if (existingClient) {
                clientId = existingClient.id;
            } else {
                const { data: newClient, error: clientErr } = await supabase
                    .from('clients')
                    .insert([{
                        name: bookingData.client.name,
                        email: bookingData.client.email || null,
                        phone: bookingData.client.phone
                    }])
                    .select('id')
                    .single();

                if (clientErr) throw clientErr;
                clientId = newClient.id;
            }

            // 2. Format Date (DD/MM -> YYYY-MM-DD)
            const [d, m] = bookingData.date!.split('/');
            const year = currentMonth.getFullYear();
            const sqldate = `${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;

            // 3. Insert Appointment
            const { data: appointment, error: apptErr } = await supabase
                .from('appointments')
                .insert([{
                    client_id: clientId,
                    appointment_date: sqldate,
                    appointment_time: bookingData.time,
                    total_price: totalValue,
                    status: 'pendente'
                }])
                .select('id')
                .single();

            if (apptErr) throw apptErr;

            // 4. Insert Appointment Services
            const apptServices = bookingData.selectedServices.map(s => ({
                appointment_id: appointment.id,
                service_id: s.id,
                price_at_booking: s.price
            }));

            const { error: servicesErr } = await supabase
                .from('appointment_services')
                .insert(apptServices);

            if (servicesErr) throw servicesErr;

            // Success
            setIsSuccess(true);

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error("Booking error:", error);
            alert("Ocorreu um erro ao realizar o agendamento. Por favor, tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">

            {/* Header & Progress Bar */}
            <div className="mb-8 relative z-10">
                <div className="flex items-center justify-between mb-6 relative h-10">
                    <div className="w-[100px] z-10 flex items-center">
                        {currentStep > 1 && currentStep < 4 && (
                            <button onClick={handlePrev} className="flex items-center text-charcoal/60 hover:text-gold-500 transition-colors">
                                <ArrowLeft size={20} className="mr-2" />
                                <span className="font-bold text-sm uppercase tracking-wider">Voltar</span>
                            </button>
                        )}
                    </div>

                    <h1 className="text-2xl font-serif font-bold text-charcoal text-center absolute left-0 right-0 z-0">
                        {currentStep === 1 && "Selecione o Serviço"}
                        {currentStep === 2 && "Data e Horário"}
                        {currentStep === 3 && "Seus Dados"}
                        {currentStep === 4 && "Confirmação"}
                    </h1>

                    <div className="w-[100px] z-10"></div> {/* Spacer for balance */}
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center justify-center space-x-2 md:space-x-4">
                    {[1, 2, 3].map((step) => {
                        const isActive = currentStep === step;
                        const isPast = currentStep > step;
                        return (
                            <React.Fragment key={step}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${isActive ? "bg-gold-500 text-white shadow-md scale-110" :
                                    isPast ? "bg-charcoal text-white" : "bg-nude-200 text-charcoal/40"
                                    }`}>
                                    {isPast ? <CheckCircle2 size={16} /> : step}
                                </div>
                                {step < 3 && (
                                    <div className={`h-1 w-12 md:w-20 rounded-full transition-all duration-300 ${isPast ? "bg-charcoal" : "bg-nude-200"
                                        }`}></div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Step Content Area */}
            <div className="bg-white border border-nude-100/60 rounded-[32px] p-6 md:p-10 shadow-sm relative overflow-hidden min-h-[400px]">
                {/* Subtle Background Image */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                    <img
                        src="/images/clinic_booking_banner.png"
                        alt=""
                        className="w-full h-full object-cover grayscale"
                    />
                </div>

                {/* Decorative glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none z-0"></div>

                {currentStep === 1 && (
                    <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                        <div className="text-center mb-8 relative z-10">
                            <h2 className="text-3xl font-serif text-charcoal font-bold mb-2">Quais serviços deseja realizar?</h2>
                            <p className="text-charcoal/60">Selecione um ou mais serviços para o seu agendamento.</p>
                        </div>

                        {isLoadingServices ? (
                            <div className="flex justify-center items-center py-20 text-charcoal/50">
                                <Loader2 className="w-10 h-10 animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 relative z-10">
                                {services.map(service => {
                                    const isSelected = bookingData.selectedServices.some(s => s.id === service.id);
                                    return (
                                        <button
                                            key={service.id}
                                            onClick={() => toggleService(service)}
                                            className={`flex flex-col text-left p-5 rounded-2xl border-2 transition-all ${isSelected
                                                ? "border-gold-500 bg-gold-50/30 shadow-md shadow-gold-500/10"
                                                : "border-nude-100 bg-white hover:border-gold-500/50 hover:shadow-sm"
                                                }`}
                                        >
                                            <div className="flex justify-between items-start w-full mb-3">
                                                <h3 className="font-serif font-bold text-lg text-charcoal pr-4">{service.name}</h3>
                                                <div className={`mt-0.5 shrink-0 ${isSelected ? "text-gold-500" : "text-nude-200"}`}>
                                                    {isSelected ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                                </div>
                                            </div>
                                            {service.description && (
                                                <p className="text-sm text-charcoal/60 mb-4 line-clamp-2">{service.description}</p>
                                            )}
                                            <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-nude-100/50">
                                                <span className="text-xs font-bold uppercase tracking-widest text-charcoal/40">{service.duration}</span>
                                                <span className="font-bold text-charcoal text-lg">
                                                    {service.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="animate-in slide-in-from-right-4 fade-in duration-300">
                        <div className="text-center mb-10 relative z-10">
                            <h2 className="text-3xl font-serif text-charcoal font-bold mb-2">Data e Horário</h2>
                            <p className="text-charcoal/60">Escolha o melhor momento para o seu atendimento.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                            {/* Left Column: Date Selection */}
                            <div className="flex justify-center lg:justify-start">
                                <div className="bg-white rounded-2xl p-6 border border-nude-100/60 w-full max-w-[360px] shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-bold text-charcoal text-lg capitalize">{formatMonthYear()}</h3>
                                        <div className="flex items-center space-x-4">
                                            <button onClick={handlePrevMonth} className="text-gold-500 hover:text-gold-600 transition-colors">
                                                <ChevronLeft size={24} strokeWidth={2.5} />
                                            </button>
                                            <button onClick={handleNextMonth} className="text-gold-500 hover:text-gold-600 transition-colors">
                                                <ChevronRight size={24} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        {/* Weekday Headers */}
                                        <div className="grid grid-cols-7 mb-4">
                                            {['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'].map(day => (
                                                <div key={day} className="text-center text-sm font-bold text-charcoal/50">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Calendar Grid */}
                                        <div className="grid grid-cols-7 gap-y-4">
                                            {calendarDays.map((dayObj) => {
                                                if (dayObj.empty) {
                                                    return <div key={dayObj.key} className="h-10"></div>;
                                                }

                                                const isActive = bookingData.date === dayObj.date;

                                                // Create a stable Date object for 'today' without time (local timezone)
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);

                                                // Day object date
                                                const [d, m] = dayObj.date!.split('/');
                                                const year = currentMonth.getFullYear();
                                                const itemDate = new Date(year, parseInt(m) - 1, parseInt(d));

                                                const isPast = itemDate < today;
                                                const isSunday = itemDate.getDay() === 0;

                                                return (
                                                    <div key={dayObj.key} className="flex justify-center items-center">
                                                        <button
                                                            disabled={isPast || isSunday}
                                                            data-selected={isActive}
                                                            onClick={() => {
                                                                setBookingData({ ...bookingData, date: dayObj.date!, time: null });
                                                                // Auto-scroll to time selection on mobile
                                                                setTimeout(() => {
                                                                    const timeSection = document.getElementById('time-selection-section');
                                                                    if (timeSection && window.innerWidth < 1024) {
                                                                        timeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                    }
                                                                }, 100);
                                                            }}
                                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-base transition-colors ${isActive
                                                                ? "bg-gold-500 text-charcoal font-bold shadow-md scale-105"
                                                                : (isPast || isSunday)
                                                                    ? "text-charcoal/20 cursor-not-allowed font-medium"
                                                                    : "text-charcoal hover:bg-gold-50 hover:text-gold-600 font-bold"
                                                                }`}
                                                        >
                                                            {dayObj.day}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Time Selection */}
                            <div id="time-selection-section" className="scroll-mt-6">
                                <h3 className="font-bold text-charcoal mb-4 flex items-center justify-between">
                                    <span>Horários Disponíveis</span>
                                    {bookingData.date && <span className="text-xs text-gold-600 font-normal bg-gold-50 px-2 py-1 rounded">para {bookingData.date}</span>}
                                </h3>

                                {!bookingData.date ? (
                                    <div className="h-[200px] border-2 border-dashed border-nude-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-white/50">
                                        <p className="text-charcoal/40 font-medium">Selecione uma data ao lado para ver os horários vivos.</p>
                                    </div>
                                ) : isLoadingTimes ? (
                                    <div className="h-[200px] border-2 border-dashed border-nude-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-white/50">
                                        <Loader2 className="w-8 h-8 text-gold-500 animate-spin mb-3" />
                                        <p className="text-charcoal/40 font-medium">Buscando horários...</p>
                                    </div>
                                ) : finalAvailableTimes.length === 0 ? (
                                    <div className="h-[200px] border-2 border-dashed border-nude-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-white/50">
                                        <p className="text-red-500 font-medium font-bold mb-2">Sem horários</p>
                                        <p className="text-charcoal/50 text-sm">Todos os horários deste dia já foram preenchidos ou já passaram.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-3 animate-in fade-in zoom-in-95 duration-300">
                                        {finalAvailableTimes.map((time) => {
                                            const isActive = bookingData.time === time;
                                            return (
                                                <button
                                                    key={time}
                                                    onClick={() => setBookingData({ ...bookingData, time })}
                                                    className={`py-3.5 rounded-xl font-bold text-center border-2 transition-all ${isActive
                                                        ? "border-gold-500 bg-gold-50 text-gold-600 shadow-sm shadow-gold-500/10"
                                                        : "border-nude-100 bg-white text-charcoal hover:border-gold-500/40 hover:bg-gold-50/10"
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className="animate-in slide-in-from-right-4 fade-in duration-300 max-w-xl mx-auto">
                        <div className="text-center mb-10 relative z-10">
                            <h2 className="text-3xl font-serif text-charcoal font-bold mb-2">Seus Dados</h2>
                            <p className="text-charcoal/60">Preencha rapidamente para confirmarmos seu agendamento.</p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-sm font-bold text-charcoal">Nome Completo *</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="Ex: Maria Antonieta"
                                    value={bookingData.client.name}
                                    onChange={(e) => setBookingData({ ...bookingData, client: { ...bookingData.client, name: e.target.value } })}
                                    className="w-full px-4 py-3 rounded-xl border border-nude-100 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium text-charcoal placeholder:text-nude-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-sm font-bold text-charcoal">Whatsapp / Telefone *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    placeholder="(00) 00000-0000"
                                    value={bookingData.client.phone}
                                    onChange={handlePhoneChange}
                                    className="w-full px-4 py-3 rounded-xl border border-nude-100 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium text-charcoal placeholder:text-nude-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-bold text-charcoal">E-mail <span className="text-nude-200 font-normal">(opcional)</span></label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="seuemail@exemplo.com"
                                    value={bookingData.client.email}
                                    onChange={(e) => setBookingData({ ...bookingData, client: { ...bookingData.client, email: e.target.value } })}
                                    className="w-full px-4 py-3 rounded-xl border border-nude-100 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 transition-all font-medium text-charcoal placeholder:text-nude-200"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className="animate-in slide-in-from-right-4 fade-in duration-300 max-w-xl mx-auto">
                        {!isSuccess ? (
                            <>
                                <div className="text-center mb-8 relative z-10">
                                    <h2 className="text-3xl font-serif text-charcoal font-bold mb-2">Resumo do Agendamento</h2>
                                    <p className="text-charcoal/60">Confira os dados abaixo para finalizar.</p>
                                </div>

                                <div className="bg-[#faf9f7] rounded-2xl p-6 md:p-8 border border-nude-100 shadow-sm relative z-10 space-y-6">
                                    {/* Services */}
                                    <div>
                                        <h4 className="text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-3">Serviços Selecionados</h4>
                                        <div className="space-y-3">
                                            {bookingData.selectedServices.map(s => (
                                                <div key={s.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-nude-100">
                                                    <span className="font-bold text-charcoal">{s.name}</span>
                                                    <span className="text-charcoal font-medium">
                                                        {s.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-nude-100/60">
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-1">Data</h4>
                                            <p className="font-bold text-charcoal text-lg">{bookingData.date}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-1">Horário</h4>
                                            <p className="font-bold text-charcoal text-lg text-gold-600 bg-gold-50 inline-block px-3 py-0.5 rounded-lg">{bookingData.time}</p>
                                        </div>
                                    </div>

                                    {/* Client */}
                                    <div className="pt-4 border-t border-nude-100/60">
                                        <h4 className="text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-2">Seus Dados</h4>
                                        <p className="font-bold text-charcoal mb-0.5">{bookingData.client.name}</p>
                                        <p className="text-sm font-medium text-charcoal flex space-x-3">
                                            <span>{bookingData.client.phone}</span>
                                            {bookingData.client.email && (
                                                <>
                                                    <span className="text-nude-200">•</span>
                                                    <span className="text-charcoal/60">{bookingData.client.email}</span>
                                                </>
                                            )}
                                        </p>
                                    </div>

                                    {/* Total */}
                                    <div className="pt-6 border-t border-nude-200 flex justify-between items-center">
                                        <span className="font-serif font-bold text-xl text-charcoal">Total a pagar:</span>
                                        <span className="font-serif font-bold text-2xl text-gold-600">
                                            {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-8 flex flex-col sm:flex-row gap-4 relative z-10">
                                    <button
                                        onClick={handlePrev}
                                        className="w-full sm:w-1/3 py-4 rounded-xl font-bold text-charcoal border-2 border-nude-100 hover:border-gold-500/50 hover:bg-gold-50/10 transition-all uppercase tracking-widest text-sm"
                                    >
                                        Corrigir Algo
                                    </button>
                                    <button
                                        onClick={handleConfirmBooking}
                                        disabled={isSubmitting}
                                        className="w-full sm:w-2/3 py-4 rounded-xl font-bold text-white bg-charcoal hover:bg-charcoal/90 disabled:bg-charcoal/50 disabled:cursor-not-allowed transition-all uppercase tracking-widest text-sm shadow-xl shadow-black/10 flex items-center justify-center space-x-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                <span>Processando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={18} />
                                                <span>Confirmar Agendamento</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-10 relative z-10 animate-in zoom-in-95 fade-in duration-500">
                                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-emerald-500/10">
                                    <CheckCircle2 size={48} />
                                </div>
                                <h2 className="text-3xl font-serif text-charcoal font-bold mb-4">Agendamento Confirmado!</h2>
                                <p className="text-charcoal/60 text-lg mb-8 max-w-md mx-auto">
                                    Tudo certo, <strong>{bookingData.client.name.split(' ')[0]}</strong>! Seu horário está garantido para dia <strong>{bookingData.date}</strong> às <strong>{bookingData.time}</strong>.
                                </p>
                                <div className="bg-[#faf9f7] border border-nude-100 rounded-2xl p-6 mb-10 max-w-sm mx-auto text-sm text-charcoal/60 font-medium">
                                    Enviamos os detalhes para o seu Whatsapp. O pagamento de {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} será realizado no local.
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link
                                        href="/"
                                        className="w-full sm:w-auto text-center bg-white border-2 border-charcoal/10 hover:border-charcoal hover:bg-charcoal text-charcoal hover:text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest transition-all text-sm"
                                    >
                                        Voltar ao Início
                                    </Link>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="w-full sm:w-auto text-center bg-gold-500 hover:bg-gold-600 text-white shadow-md shadow-gold-500/20 px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest transition-all text-sm"
                                    >
                                        Novo Agendamento
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sticky Bottom Bar for Navigation */}
            {currentStep < 4 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-nude-100 p-4 md:p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-40 transform transition-transform">
                    <div className="max-w-3xl mx-auto flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-widest text-charcoal/50 font-bold mb-1">Total a pagar no local</p>
                            <p className="text-2xl font-serif font-bold text-charcoal">
                                {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && !isStep1Valid) ||
                                (currentStep === 2 && !isStep2Valid) ||
                                (currentStep === 3 && !isStep3Valid)
                            }
                            className="bg-gold-500 hover:bg-gold-600 disabled:bg-nude-200 disabled:text-charcoal/40 text-white px-8 py-3.5 rounded-xl font-bold uppercase tracking-widest transition-all shadow-md shadow-gold-500/20 disabled:shadow-none"
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
