"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Trash2, X, Save, Loader2 } from "lucide-react";
import { supabase } from "../../../lib/supabase";

export default function ServicesPage() {
    // State for the services list
    const [services, setServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('name');

        if (data && !error) {
            setServices(data.map(s => ({
                id: s.id,
                name: s.name,
                description: s.description || "",
                price: `R$ ${s.price.toFixed(2).replace('.', ',')}`,
                numericPrice: s.price,
                duration: s.duration || "1h"
            })));
        }
        setIsLoading(false);
    };

    const [newServiceName, setNewServiceName] = useState("");
    const [newServiceDescription, setNewServiceDescription] = useState("");
    const [newServicePrice, setNewServicePrice] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleAddService = async () => {
        if (!newServiceName.trim() || !newServicePrice.trim() || isSaving) return;
        setIsSaving(true);

        const numericPriceValue = parseFloat(newServicePrice.replace(',', '.'));

        if (editingId) {
            // Update
            const { error } = await supabase
                .from('services')
                .update({
                    name: newServiceName,
                    description: newServiceDescription,
                    price: numericPriceValue
                })
                .eq('id', editingId);

            if (!error) {
                await fetchServices();
                handleClearInputs();
            }
        } else {
            // Insert
            const { error } = await supabase
                .from('services')
                .insert([{
                    name: newServiceName,
                    description: newServiceDescription,
                    price: numericPriceValue,
                    duration: '1h', // Default value
                    is_active: true
                }]);

            if (!error) {
                await fetchServices();
                handleClearInputs();
            }
        }
        setIsSaving(false);
    };

    const handleClearInputs = () => {
        setNewServiceName("");
        setNewServiceDescription("");
        setNewServicePrice("");
        setEditingId(null);
    };

    const handleEdit = (service: any) => {
        setEditingId(service.id);
        setNewServiceName(service.name);
        setNewServiceDescription(service.description);
        setNewServicePrice(service.numericPrice.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);

        if (!error) {
            setServices(services.filter(s => s.id !== id));
            if (editingId === id) handleClearInputs();
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Back Navigation */}
            <div className="flex items-center space-x-4 mb-8">
                <Link href="/admin" className="text-charcoal/60 hover:text-gold-500 transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h2 className="text-3xl font-serif text-charcoal">Gerenciar Serviços</h2>
            </div>

            {/* New Service Form Box */}
            <div className="bg-white border border-nude-100 rounded-3xl p-6 md:p-8 shadow-sm mb-8">
                <h3 className="text-lg font-serif text-charcoal font-bold mb-6">
                    {editingId ? 'Editar Serviço' : 'Novo Serviço'}
                </h3>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-end gap-4">
                        {/* Name Input */}
                        <div className="flex-grow">
                            <label className="block text-sm font-bold text-charcoal mb-2">Nome do Serviço</label>
                            <input
                                type="text"
                                value={newServiceName}
                                onChange={(e) => setNewServiceName(e.target.value)}
                                placeholder="Ex: Limpeza de Pele Profunda"
                                className="w-full bg-nude-50/50 border border-nude-100 text-charcoal rounded-xl px-4 py-3 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-medium placeholder:text-charcoal/30"
                            />
                        </div>

                        {/* Price Input */}
                        <div className="w-full md:w-48">
                            <label className="block text-sm font-bold text-charcoal mb-2">Preço (R$)</label>
                            <input
                                type="number"
                                value={newServicePrice}
                                onChange={(e) => setNewServicePrice(e.target.value)}
                                placeholder="0"
                                className="w-full bg-nude-50/50 border border-nude-100 text-charcoal rounded-xl px-4 py-3 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-medium placeholder:text-charcoal/30"
                            />
                        </div>

                        {/* Action Buttons (Desktop aligned) */}
                        <div className="hidden md:flex items-center space-x-2">
                            <button
                                onClick={handleClearInputs}
                                disabled={isSaving}
                                className="flex items-center justify-center bg-white border border-nude-100 text-charcoal/50 hover:text-red-500 hover:border-red-200 hover:bg-red-50 w-12 h-[50px] rounded-xl transition-colors shadow-sm disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                            <button
                                onClick={handleAddService}
                                disabled={isSaving || !newServiceName || !newServicePrice}
                                className={`flex items-center justify-center text-white w-12 h-[50px] rounded-xl transition-colors shadow-md ${newServiceName && newServicePrice && !isSaving ? 'bg-gold-500 hover:bg-gold-600 shadow-gold-500/20' : 'bg-gold-500/50 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Description Input */}
                    <div className="w-full">
                        <label className="block text-sm font-bold text-charcoal mb-2">Descrição Curta (Opcional)</label>
                        <textarea
                            value={newServiceDescription}
                            onChange={(e) => setNewServiceDescription(e.target.value)}
                            placeholder="Descreva o que está incluso neste serviço..."
                            rows={2}
                            maxLength={150}
                            className="w-full bg-nude-50/50 border border-nude-100 text-charcoal rounded-xl px-4 py-3 outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-medium placeholder:text-charcoal/30 resize-none"
                        ></textarea>
                    </div>

                    {/* Action Buttons (Mobile visible) */}
                    <div className="flex md:hidden items-center justify-end space-x-2 mt-2">
                        <button
                            onClick={handleClearInputs}
                            disabled={isSaving}
                            className="flex items-center justify-center bg-white border border-nude-100 text-charcoal/50 hover:text-red-500 hover:border-red-200 hover:bg-red-50 w-12 h-[50px] rounded-xl transition-colors shadow-sm disabled:opacity-50"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={handleAddService}
                            disabled={isSaving || !newServiceName || !newServicePrice}
                            className={`flex items-center justify-center text-white w-12 h-[50px] rounded-xl transition-colors shadow-md ${newServiceName && newServicePrice && !isSaving ? 'bg-gold-500 hover:bg-gold-600 shadow-gold-500/20' : 'bg-gold-500/50 cursor-not-allowed shadow-none'
                                }`}
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* List Container */}
            <div className="bg-white border border-nude-100 rounded-3xl overflow-hidden shadow-sm">
                {/* Header Row */}
                <div className="p-6 border-b border-nude-50 bg-[#faf9f7]">
                    <h3 className="text-lg font-serif text-charcoal font-bold">Serviços Cadastrados</h3>
                </div>

                {/* Items */}
                <div className="divide-y divide-nude-50">
                    {isLoading ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <Loader2 className="text-gold-500 w-12 h-12 mb-4 animate-spin" />
                            <h4 className="text-lg font-bold text-charcoal mb-2">Carregando Serviços...</h4>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="p-12 text-center text-charcoal/50 font-medium">Nenhum serviço cadastrado ainda.</div>
                    ) : (
                        services.map((service) => (
                            <div key={service.id} className="p-6 flex justify-between items-center hover:bg-nude-50/50 transition-colors group">
                                <div>
                                    <h4 className="text-charcoal font-bold font-serif text-lg mb-1">{service.name}</h4>
                                    {service.description && (
                                        <p className="text-charcoal/60 text-sm mb-2 max-w-lg line-clamp-1">{service.description}</p>
                                    )}
                                    <p className="text-charcoal/50 text-sm font-sans font-medium">{service.price}</p>
                                </div>
                                <div className="flex items-center space-x-3 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="p-2.5 text-charcoal/40 hover:text-gold-600 transition-colors bg-white border border-nude-100 hover:border-gold-500/30 rounded-xl shadow-sm hover:shadow-md"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2.5 text-charcoal/40 hover:text-red-500 transition-colors bg-white border border-nude-100 hover:border-red-500/30 rounded-xl shadow-sm hover:shadow-md"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
