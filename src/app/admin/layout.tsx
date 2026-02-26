"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Scissors, X, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [recentBookings, setRecentBookings] = useState<any[]>([]);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            } else {
                setIsCheckingAuth(false);
            }
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push("/login");
            } else {
                setIsCheckingAuth(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const fetchRecentBookings = async () => {
        setIsLoadingNotifications(true);
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                id,
                appointment_date,
                appointment_time,
                clients (name),
                appointment_services (
                    services (name)
                )
            `)
            .order('created_at', { ascending: false })
            .limit(5);

        if (data && !error) {
            const formatted = data.map(apt => {
                const dateParts = apt.appointment_date.split('-');
                const dayMonth = `${dateParts[2]}/${dateParts[1]}`;

                const services = apt.appointment_services
                    .map((as: any) => as.services?.name)
                    .filter(Boolean)
                    .join(', ');

                return {
                    id: apt.id,
                    client: (apt.clients as any)?.name || 'Cliente',
                    service: services || 'Serviço',
                    date: dayMonth,
                    time: apt.appointment_time.substring(0, 5)
                };
            });
            setRecentBookings(formatted);
        }
        setIsLoadingNotifications(false);
    };

    useEffect(() => {
        if (isNotificationOpen) {
            fetchRecentBookings();
        }
    }, [isNotificationOpen]);

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
                <p className="text-charcoal/40 font-serif text-lg italic animate-pulse">Verificando acesso...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-charcoal font-sans selection:bg-gold-500/30">
            {/* Topbar */}
            <header className="border-b border-nude-100 bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <Link href="/admin" className="flex items-center space-x-3 text-gold-500 hover:text-gold-600 transition-colors">
                    <Scissors size={20} className="transform -rotate-45" />
                    <h1 className="text-xl font-serif tracking-wide text-charcoal">Painel da Clínica</h1>
                </Link>

                <div className="flex items-center space-x-6 text-charcoal/60">
                    <button
                        onClick={() => setIsNotificationOpen(true)}
                        className="relative hover:text-gold-500 transition-colors bg-nude-50 p-2 rounded-xl"
                    >
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors font-medium text-sm ml-4 border-l border-nude-100 pl-6"
                    >
                        <LogOut size={18} />
                        <span>Sair</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="container mx-auto px-6 py-8 max-w-7xl">
                {children}
            </main>

            {/* Notifications Drawer */}
            {isNotificationOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-[60] animate-in fade-in duration-200"
                        onClick={() => setIsNotificationOpen(false)}
                    ></div>

                    {/* Drawer */}
                    <div className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white border-l border-nude-100 shadow-2xl z-[70] animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="p-6 border-b border-nude-50 flex items-center justify-between bg-[#faf9f7]">
                            <h3 className="text-lg font-serif font-bold text-charcoal">Últimos Agendamentos</h3>
                            <button
                                onClick={() => setIsNotificationOpen(false)}
                                className="text-charcoal/40 hover:text-red-500 transition-colors p-2 bg-white rounded-full shadow-sm border border-nude-100"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-nude-50/20">
                            {isLoadingNotifications ? (
                                <div className="flex flex-col items-center justify-center h-40 space-y-3">
                                    <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
                                    <p className="text-sm font-medium text-charcoal/40">Carregando...</p>
                                </div>
                            ) : recentBookings.length > 0 ? (
                                recentBookings.map(booking => (
                                    <div key={booking.id} className="bg-white border border-nude-100 rounded-2xl p-4 shadow-sm hover:border-gold-500/30 transition-colors group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-charcoal group-hover:text-gold-600 transition-colors">{booking.client}</h4>
                                            <span className="text-xs font-bold bg-nude-50 text-gold-600 px-2 py-1 rounded-md">
                                                {booking.date} • {booking.time}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-charcoal/60">{booking.service}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-charcoal/40 font-medium">Nenhum agendamento recente.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-nude-50 bg-white">
                            <button
                                onClick={() => setIsNotificationOpen(false)}
                                className="w-full bg-charcoal text-white py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-charcoal/10 hover:bg-charcoal/90 transition-all"
                            >
                                Fechar Notificações
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
