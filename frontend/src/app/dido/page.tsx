"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Hammer, UploadCloud, MapPin, Box, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { UnifiedApiClient } from "@/services/apiClient";
import { OrchestrationNode } from "@/types";

export default function DidoPage() {
    const [nodes, setNodes] = useState<OrchestrationNode[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedEducation, setSelectedEducation] = useState<string>("");
    const [selectedDesign, setSelectedDesign] = useState<string>("");
    const [selectedLab, setSelectedLab] = useState<string>("");
    const [selectedSupplier, setSelectedSupplier] = useState<string>("");

    const [submitting, setSubmitting] = useState(false);
    const [receipt, setReceipt] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchNodes() {
            setLoading(true);
            const data = await UnifiedApiClient.fetchOrchestrationNodes();
            setNodes(data);
            setLoading(false);
        }
        fetchNodes();
    }, []);

    const designs = nodes.filter(n => n.type === 'DistributedDesign');
    const labs = nodes.filter(n => n.type === 'Lab');
    const suppliers = nodes.filter(n => n.type === 'MakeWorks');

    // Mock Educational Prerequisites (Learning Hub)
    const educationalCourses = [
        { id: "edu-fabacademy", name: "Fab Academy", description: "Diploma in Digital Fabrication" },
        { id: "edu-fabricademy", name: "Fabricademy", description: "Textile and Technology Academy" },
        { id: "edu-mdef", name: "MDEF", description: "Master in Design for Emergent Futures" },
        { id: "edu-distributed", name: "Distributed Design", description: "Open Source Hardware Design" },
    ];

    const handleTransactionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setReceipt(null);

        try {
            const response = await fetch('/api/federation/interfacer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    educationId: selectedEducation,
                    designId: selectedDesign,
                    labId: selectedLab,
                    supplierId: selectedSupplier
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to log transaction");
            }

            setReceipt(data.receipt);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-12 px-6">
            <div className="w-full max-w-3xl space-y-8">

                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-2">
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Project Execution Dashboard</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Operationalize the Design Global, Manufacture Local (DIDO) model. Match global open-source designs with local fabrication infrastructure and sustainable material suppliers.
                    </p>
                </div>

                <div className="bg-card border rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-secondary/20 p-6 border-b">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Hammer className="w-5 h-5 text-primary" /> Create Circular Transaction
                        </h2>
                    </div>

                    <form onSubmit={handleTransactionSubmit} className="p-8 space-y-8">
                        {loading ? (
                            <div className="space-y-6 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-muted rounded w-1/4"></div>
                                        <div className="h-12 bg-muted rounded-lg w-full"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                {/* Step 1: Education Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                                        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                        </svg>
                                        1. Select Educational Prerequisite (Learning Hub)
                                    </label>
                                    <select
                                        required
                                        className="w-full bg-background border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                        value={selectedEducation}
                                        onChange={e => setSelectedEducation(e.target.value)}
                                    >
                                        <option value="" disabled>-- Choose a prerequisite program --</option>
                                        {educationalCourses.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} - {c.description}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Step 2: Design Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                                        <UploadCloud className="w-4 h-4 text-orange-500" />
                                        2. Select Global Design Blueprint (Distributed Design)
                                    </label>
                                    <select
                                        required
                                        className="w-full bg-background border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                        value={selectedDesign}
                                        onChange={e => setSelectedDesign(e.target.value)}
                                    >
                                        <option value="" disabled>-- Choose a verified design --</option>
                                        {designs.map(d => (
                                            <option key={d.id} value={d.id}>{d.name} {d.description ? `(${d.description.split('-')[1]})` : ''}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Step 3: Fabrication Hub Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        3. Select Local Manufacturing Hub (Fab Lab)
                                    </label>
                                    <select
                                        required
                                        className="w-full bg-background border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                        value={selectedLab}
                                        onChange={e => setSelectedLab(e.target.value)}
                                    >
                                        <option value="" disabled>-- Choose a fabrication node --</option>
                                        {labs.map(l => (
                                            <option key={l.id} value={l.id}>{l.name} - {l.location.city || "Unknown City"}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Step 4: Material Source Selection */}
                                <div className="space-y-3 mb-8">
                                    <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                                        <Box className="w-4 h-4 text-green-500" />
                                        4. Select Local Material Source (Make Works)
                                    </label>
                                    <select
                                        required
                                        className="w-full bg-background border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow"
                                        value={selectedSupplier}
                                        onChange={e => setSelectedSupplier(e.target.value)}
                                    >
                                        <option value="" disabled>-- Choose a material supplier --</option>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.id}>{s.name} - {s.location.city || "Unknown City"}</option>
                                        ))}
                                    </select>
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-600">
                                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        <p className="text-sm font-medium">{error}</p>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={submitting || loading}
                                    className="w-full h-14 text-lg font-bold gap-2 shadow-lg hover:shadow-xl transition-all"
                                    size="lg"
                                >
                                    {submitting ? (
                                        <div className="w-6 h-6 border-4 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Generate Digital Product Passport
                                        </>
                                    )}
                                </Button>
                            </>
                        )}
                    </form>

                    {/* Ledger Receipt Overlay / Block */}
                    {receipt && (
                        <div className="p-8 border-t bg-emerald-500/5">
                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Digital Product Passport Generated!</h3>
                                    <p className="text-sm text-muted-foreground w-full max-w-md mx-auto">
                                        This DIDO physical instantiation has been successfully compiled and logged to the Interfacer OS distributed ledger.
                                    </p>
                                </div>
                                <div className="w-full bg-secondary/80 border rounded-xl p-6 text-left shadow-inner mt-4 overflow-x-auto">
                                    <div className="flex items-center justify-between mb-4 border-b pb-2">
                                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">JSON Payload</span>
                                        <span className="text-xs font-mono text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded">✔ Verified</span>
                                    </div>
                                    <pre className="text-xs md:text-sm font-mono text-primary/90">
                                        <code>
                                            {JSON.stringify(receipt, null, 2)}
                                        </code>
                                    </pre>
                                </div>

                                <Button variant="default" className="mt-6" onClick={() => setReceipt(null)}>
                                    Execute Another Project
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center pt-8">
                    <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        &larr; Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
