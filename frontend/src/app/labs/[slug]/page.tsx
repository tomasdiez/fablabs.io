"use client"

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Mail, MapPin, Phone, Facebook, Instagram, Linkedin, MessageCircle, Link2, Printer, Cog, Cpu, Zap, Crosshair, Scissors, Brain, Blocks, Wifi, Navigation, Map as MapIcon, Users, CheckCircle2, Box, Briefcase, Github } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Extracted Domain Parser logic for External Repositories
import { Gitlab } from "lucide-react";

function getDomainIcon(url: string) {
    if (!url) return <Link2 className="w-5 h-5 text-muted-foreground" />;
    const lower = url.toLowerCase();
    if (lower.includes('thingiverse.com') || lower.includes('printables.com') || lower.includes('makerworld.com')) return <Box className="w-5 h-5 text-blue-500" />;
    if (lower.includes('wikifactory.com')) return <Briefcase className="w-5 h-5 text-red-500" />;
    if (lower.includes('github.com')) return <Github className="w-5 h-5" />;
    if (lower.includes('gitlab.com')) return <Gitlab className="w-5 h-5 text-orange-500" />;
    return <Link2 className="w-5 h-5 text-muted-foreground" />;
}

function getDomainName(url: string) {
    try {
        const u = new URL(url);
        return u.hostname.replace('www.', '');
    } catch {
        return 'External Link';
    }
}

interface Link {
    url: string;
}

interface User {
    id: string;
    username: string;
    name: string;
    avatar_url?: string;
}

interface Employee {
    id: string;
    job_title?: string;
    user?: User;
}

interface Project {
    id: string;
    title: string;
    slug: string;
    featured_image_url?: string;
}

interface Machine {
    id: string;
    name: string;
}

interface Event {
    id: string;
    name: string;
    slug: string;
}

interface Lab {
    id: string;
    name: string;
    slug: string;
    blurb: string;
    description: string;
    city: string;
    country_code: string;
    latitude?: number;
    longitude?: number;
    email: string;
    phone: string;
    avatar_url?: string;
    header_url?: string;
    capabilities: string[];
    activity_status?: string;
    links?: Link[];
    employees?: Employee[];
    projects?: Project[];
    machines?: Machine[];
    events?: Event[];
}

export default function LabProfile() {
    const params = useParams();
    const slug = params.slug as string;
    const [lab, setLab] = useState<Lab | null>(null);

    useEffect(() => {
        const fetchLab = async () => {
            try {
                // Mock external API loading
                await new Promise(resolve => setTimeout(resolve, 600));

                const mockLab: Lab = {
                    id: "1",
                    name: "Global Mock Lab",
                    slug: slug,
                    blurb: "A demonstration of the unified dashboard.",
                    description: "This is a placeholder lab profile fetched from our generic mocked pipeline.",
                    city: "Barcelona",
                    country_code: "ES",
                    latitude: 41.3962,
                    longitude: 2.1947,
                    email: "info@mocklab.com",
                    phone: "+34 123 456 789",
                    avatar_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400",
                    header_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
                    capabilities: ["three_d_printing", "laser"],
                    activity_status: "Active",
                    links: [],
                    employees: [],
                    machines: [],
                    projects: [],
                    events: []
                };

                setLab(mockLab);
            } catch (error) {
                console.error("Failed to load lab profile:", error);
            }
        };

        if (slug) {
            fetchLab();
        }
    }, [slug]);

    if (!lab) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <Link href="/labs">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <span className="font-semibold">{lab.name}</span>
                </div>
            </header>

            {lab.header_url && (
                <div className="w-full h-[300px] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={lab.header_url} alt={`${lab.name} header`} className="w-full h-full object-cover" />
                </div>
            )}

            <main className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="grid md:grid-cols-[1fr_350px] gap-12">

                    <div className="space-y-12">
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {[lab.city, lab.country_code].filter(Boolean).join(", ") || "Location unknown"}</span>
                                {lab.activity_status && (
                                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase text-xs">
                                        {lab.activity_status}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{lab.name}</h1>
                            {lab.blurb && <p className="text-2xl text-muted-foreground font-medium mb-4">{lab.blurb}</p>}
                            {/* We use dangerouslySetInnerHTML here if description is HTML from the old DB, but sticking to plaintext for safety if unclear */}
                            <div className="prose prose-neutral dark:prose-invert max-w-none">
                                <p className="text-lg leading-relaxed">{lab.description || "No detailed description provided."}</p>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold border-b pb-2">Capabilities</h2>
                            <div className="flex flex-wrap gap-2">
                                {lab.capabilities && lab.capabilities.length > 0 ? (
                                    lab.capabilities.map((cap) => {
                                        const capabilityConfig: Record<string, { icon: any, label: string }> = {
                                            three_d_printing: { icon: Printer, label: "3D Printing" },
                                            cnc_milling: { icon: Cog, label: "CNC Milling" },
                                            circuit_production: { icon: Cpu, label: "Circuit Production" },
                                            laser: { icon: Zap, label: "Laser Cutting" },
                                            precision_milling: { icon: Crosshair, label: "Precision Milling" },
                                            vinyl_cutting: { icon: Scissors, label: "Vinyl Cutting" },
                                            ai: { icon: Brain, label: "Artificial Intelligence (AI)" },
                                            blockchain: { icon: Blocks, label: "Blockchain" },
                                            iot: { icon: Wifi, label: "Internet of Things (IoT)" },
                                            drone_mapping: { icon: Navigation, label: "Drone Mapping" },
                                            gis: { icon: MapIcon, label: "GIS" },
                                            community_engagement: { icon: Users, label: "Community Engagement" }
                                        };

                                        const config = capabilityConfig[cap.toLowerCase()] || {
                                            icon: CheckCircle2,
                                            label: cap.replace(/_/g, ' ')
                                        };
                                        const Icon = config.icon;

                                        return (
                                            <span key={cap} className="px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium flex items-center gap-2 capitalize border shadow-sm border-border/50">
                                                <Icon className="w-4 h-4 text-primary" />
                                                {config.label}
                                            </span>
                                        );
                                    })
                                ) : (
                                    <p className="text-muted-foreground">Capabilities not listed.</p>
                                )}
                            </div>
                        </section>

                        {lab.machines && lab.machines.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold border-b pb-2">Machines & Equipment</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {lab.machines.map((machine) => (
                                        <div key={machine.id} className="p-3 bg-secondary/30 rounded-xl border flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                                {machine.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium leading-tight">{machine.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* External Repositories (Lab level) */}
                        {(() => {
                            const repoLinks = lab.links?.filter(l => !l.url.includes("instagram.com") && !l.url.includes("facebook.com") && !l.url.includes("linkedin.com") && !l.url.includes("wa.me"));
                            if (!repoLinks || repoLinks.length === 0) return null;

                            return (
                                <section className="space-y-6">
                                    <h2 className="text-2xl font-bold border-b pb-2">External Repositories</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {repoLinks.map((link: any, idx: number) => (
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" key={link.id || idx} className="group block">
                                                <div className="bg-card border rounded-2xl p-4 flex items-center gap-4 hover:border-primary hover:shadow-md transition-all h-full">
                                                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 border border-border/50">
                                                        {getDomainIcon(link.url)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors truncate">{link.description || getDomainName(link.url)}</h3>
                                                        <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                                                    </div>
                                                    <ExternalLink className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -mr-2" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            );
                        })()}

                        {lab.employees && lab.employees.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold border-b pb-2">Lab Members</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {lab.employees.map((emp) => emp.user ? (
                                        <div key={emp.id} className="p-5 rounded-2xl bg-card border shadow-sm flex flex-col items-center text-center gap-3 hover:border-primary transition-colors cursor-pointer group">
                                            <div className="w-20 h-20 rounded-full bg-secondary overflow-hidden shrink-0 flex items-center justify-center border-4 border-background shadow-sm group-hover:scale-105 transition-transform">
                                                {emp.user.avatar_url ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={emp.user.avatar_url} alt={emp.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-bold text-xl">{emp.user.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{emp.user.name}</h3>
                                                {emp.job_title && <p className="text-sm text-muted-foreground mt-1">{emp.job_title}</p>}
                                            </div>
                                        </div>
                                    ) : null)}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="space-y-6">
                        <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-6 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold overflow-hidden">
                                {lab.avatar_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={lab.avatar_url} alt={lab.name} className="w-full h-full object-cover" />
                                ) : (
                                    lab.name.charAt(0)
                                )}
                            </div>
                            <div className="space-y-3 w-full">
                                <Button className="w-full gap-2">
                                    <Mail className="w-4 h-4" /> Message Lab
                                </Button>
                                {lab.latitude !== undefined && lab.longitude !== undefined && (
                                    <Button variant="outline" className="w-full gap-2" asChild>
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${lab.latitude},${lab.longitude}`} target="_blank" rel="noopener noreferrer">
                                            <MapPin className="w-4 h-4" /> View Map
                                        </a>
                                    </Button>
                                )}
                                {lab.links && lab.links.length > 0 && (
                                    <div className="flex flex-col gap-2 w-full mt-3">
                                        {lab.links.map((link, idx) => {
                                            let Icon = Link2;
                                            let label = "Visit Website";
                                            let variant = "outline";

                                            if (link.url.includes("instagram.com")) {
                                                Icon = Instagram; label = "Instagram";
                                            } else if (link.url.includes("facebook.com")) {
                                                Icon = Facebook; label = "Facebook";
                                            } else if (link.url.includes("linkedin.com")) {
                                                Icon = Linkedin; label = "LinkedIn";
                                            } else if (link.url.includes("wa.me")) {
                                                Icon = MessageCircle; label = "WhatsApp";
                                                variant = "secondary";
                                            }

                                            return (
                                                <Button key={idx} variant={variant as any} className="w-full gap-2" asChild>
                                                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                                                        <Icon className="w-4 h-4" /> {label}
                                                    </a>
                                                </Button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-4 text-sm">
                            <h3 className="font-semibold text-lg">Contact Details</h3>
                            <div className="space-y-3 text-muted-foreground">
                                {lab.email && <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /> {lab.email}</p>}
                                {lab.phone && <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /> {lab.phone}</p>}
                                <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> {[lab.city, lab.country_code].filter(Boolean).join(", ")}</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}
