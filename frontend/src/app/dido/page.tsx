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
                                {/* Step 1: Design Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                                        <UploadCloud className="w-4 h-4 text-orange-500" />
                                        1. Select Global Design Blueprint (Distributed Design)
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

                                {/* Step 2: Fabrication Hub Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        2. Select Local Manufacturing Hub (Fab Lab)
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

                                {/* Step 3: Material Source Selection */}
                                <div className="space-y-3 mb-8">
                                    <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                                        <Box className="w-4 h-4 text-green-500" />
                                        3. Select Local Material Source (Make Works)
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
                                            Log to Fab City OS / Interfacer
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
                                    <h3 className="text-2xl font-bold text-foreground mb-2">Transaction Committed!</h3>
                                    <p className="text-sm text-muted-foreground w-full max-w-md">
                                        This DIDO physical instantiation has been successfully logged to the Interfacer OS distributed ledger mock layer.
                                    </p>
                                </div>
                                <div className="w-full bg-card border rounded-xl p-6 text-left space-y-4 shadow-sm mt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Transaction Hash</span>
                                            <code className="text-sm bg-secondary/50 px-2 py-1 rounded text-primary break-all">{receipt.transactionHash}</code>
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Network</span>
                                            <span className="text-sm font-medium">{receipt.network}</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Blueprint ID:</span>
                                            <span className="font-mono">{receipt.details.design_blueprint}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Manufacturing Node:</span>
                                            <span className="font-mono">{receipt.details.manufacturing_node}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Material Source:</span>
                                            <span className="font-mono">{receipt.details.material_source}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm pt-2">
                                            <span className="text-muted-foreground">Timestamp:</span>
                                            <span className="text-muted-foreground font-medium">{new Date(receipt.timestamp).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="outline" className="mt-6" onClick={() => setReceipt(null)}>
                                    Record Another Execution
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
