"use client"

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
                const response = await fetch(`http://localhost:3001/api/labs/${slug}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch lab");
                }
                const data = await response.json();
                setLab(data);
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
                                    lab.capabilities.map((cap) => (
                                        <span key={cap} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                                            {cap}
                                        </span>
                                    ))
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

                        {lab.projects && lab.projects.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-2xl font-bold border-b pb-2">Projects</h2>
                                <div className="flex flex-col gap-4">
                                    {lab.projects.map((project) => (
                                        <div key={project.id} className="p-4 bg-card shadow-sm border rounded-xl flex items-center justify-between group hover:border-primary transition-colors cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                {project.featured_image_url ? (
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={project.featured_image_url} alt={project.title} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-lg bg-secondary shrink-0" />
                                                )}
                                                <div>
                                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{project.title}</h3>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="space-y-6">
                        {lab.employees && lab.employees.length > 0 && (
                            <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-4">
                                <h3 className="font-semibold text-lg">Lab Members</h3>
                                <div className="space-y-4">
                                    {lab.employees.map((emp) => emp.user ? (
                                        <div key={emp.id} className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
                                                {emp.user.avatar_url ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={emp.user.avatar_url} alt={emp.user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="font-semibold">{emp.user.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm leading-none">{emp.user.name}</p>
                                                {emp.job_title && <p className="text-xs text-muted-foreground mt-1">{emp.job_title}</p>}
                                            </div>
                                        </div>
                                    ) : null)}
                                </div>
                            </div>
                        )}
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
                                {lab.links && lab.links.length > 0 && (
                                    <Button variant="outline" className="w-full gap-2" asChild>
                                        <a href={lab.links[0].url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4" /> Visit Website
                                        </a>
                                    </Button>
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
