"use client"

import { Button } from "@/components/ui/button";
import { Plus, Settings, User, MapPin, Calendar, Wrench } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserProfile {
    name: string;
    email: string;
    avatar: string;
    role: string;
    labsCount: number;
}

export default function Dashboard() {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        // Simulated token fetch and profile load
        setTimeout(() => {
            setProfile({
                name: "Jane Weaver",
                email: "jane.weaver@example.com",
                avatar: "J",
                role: "Maker",
                labsCount: 2
            });
        }, 400);
    }, []);

    if (!profile) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/20">
            <header className="bg-card border-b">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="font-bold text-xl tracking-tighter hover:text-primary transition-colors">
                        fablabs<span className="text-primary">.io</span> Dashboard
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <Settings className="w-5 h-5" />
                        </Button>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                            {profile.avatar}
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-6xl space-y-8">
                <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center font-bold text-3xl text-primary">
                            {profile.avatar}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {profile.name}</h1>
                            <p className="text-muted-foreground flex items-center gap-2 mt-1">
                                <User className="w-4 h-4" /> {profile.role}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <Button className="w-full md:w-auto gap-2 text-white">
                            <Plus className="w-4 h-4" /> Create Project
                        </Button>
                    </div>
                </section>

                <section className="grid md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-card border shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold">{profile.labsCount}</h2>
                        <p className="text-muted-foreground">Labs Attached</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                            <Wrench className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold">4</h2>
                        <p className="text-muted-foreground">Active Projects</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold">1</h2>
                        <p className="text-muted-foreground">Upcoming Event</p>
                    </div>
                </section>

                <section className="grid lg:grid-cols-2 gap-8">
                    <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-6">
                        <h3 className="text-xl font-bold border-b pb-4">My Labs</h3>
                        <div className="space-y-4">
                            {[
                                { name: "Fab Lab Barcelona", role: "Member", location: "Barcelona, ES" },
                                { name: "Fab Lab Oulu", role: "Contributor", location: "Oulu, FI" }
                            ].map((lab) => (
                                <div key={lab.name} className="flex justify-between items-center p-4 rounded-xl border hover:border-primary transition-colors">
                                    <div>
                                        <h4 className="font-semibold">{lab.name}</h4>
                                        <p className="text-sm text-muted-foreground">{lab.role} • {lab.location}</p>
                                    </div>
                                    <Button variant="outline" size="sm">Manage</Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-card border shadow-sm space-y-6">
                        <h3 className="text-xl font-bold border-b pb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                <div>
                                    <p className="text-sm font-medium">Project "Open Source Drone" updated.</p>
                                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                <div>
                                    <p className="text-sm font-medium">You joined the electronics workshop.</p>
                                    <p className="text-xs text-muted-foreground">1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
