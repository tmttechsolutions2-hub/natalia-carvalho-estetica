"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { Loader2, Lock, Mail, Eye, EyeOff, Scissors } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                setError("E-mail ou senha incorretos. Por favor, tente novamente.");
                return;
            }

            router.push("/admin");
        } catch (err) {
            setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center p-4 font-sans">
            {/* Background Decoration */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-charcoal/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-12 shadow-2xl border border-nude-100 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                {/* Logo & Header */}
                <div className="text-center mb-10">
                    <div className="w-48 h-24 mx-auto mb-6 relative flex items-center justify-center">
                        <img
                            src="/images/logo-main.png"
                            alt="Natália Carvalho Logo"
                            className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-500 hover:scale-105"
                        />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-charcoal mb-2">Acesso Restrito</h1>
                    <p className="text-charcoal/40 font-medium tracking-wide uppercase text-xs">Painel Administrativo</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 animate-in slide-in-from-top-2 duration-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-charcoal/50 ml-1">E-mail</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-nude-200 group-focus-within:text-gold-500 transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-[#fcfbf9] border border-nude-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium text-charcoal"
                                placeholder="exemplo@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-charcoal/50 ml-1">Senha</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-nude-200 group-focus-within:text-gold-500 transition-colors">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 bg-[#fcfbf9] border border-nude-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500 transition-all font-medium text-charcoal"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-nude-200 hover:text-charcoal transition-colors px-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-charcoal text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-xl shadow-charcoal/10 hover:bg-charcoal/90 disabled:bg-charcoal/50 transition-all flex items-center justify-center space-x-3 group"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Autenticando...</span>
                            </>
                        ) : (
                            <>
                                <span>Entrar no Painel</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => router.push("/")}
                        className="text-xs font-bold text-nude-200 hover:text-gold-500 transition-colors uppercase tracking-widest"
                    >
                        Voltar para o site
                    </button>
                </div>
            </div>
        </div>
    );
}
