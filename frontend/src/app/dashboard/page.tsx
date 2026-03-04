"use client"

import { Button } from "@/components/ui/button";
import { Plus, Settings, User, MapPin, Calendar, Wrench, Edit3, MessageSquare, Heart, Share2, Activity, Shield, LogOut, Bell } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserProfile {
    name: string;
    email: string;
    avatar: string;
    role: string;
    labsCount: number;
    projectsCount: number;
    eventsCount: number;
    completion: number;
}

export default function Dashboard() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        // Simulated token fetch and profile load for demonstration
        setTimeout(() => {
            setProfile({
                name: "Tomas Diez",
                email: "tomas@fabcity.com",
                avatar: "https://i.pravatar.cc/150?u=tomas",
                role: "Super Admin",
                labsCount: 5,
                projectsCount: 12,
                eventsCount: 3,
                completion: 85
            });
        }, 600);
    }, []);

    if (!profile) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-card border-r flex flex-col hidden md:flex h-screen sticky top-0">
                <div className="h-16 flex items-center px-6 border-b">
                    <Link href="/" className="font-bold text-xl tracking-tighter hover:text-primary transition-colors">
                        fablabs<span className="text-primary">.io</span>
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Main Menu</div>
                    <Button variant={activeTab === 'overview' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('overview')}>
                        <Activity className="w-4 h-4" /> Overview
                    </Button>
                    <Button variant={activeTab === 'projects' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('projects')}>
                        <Wrench className="w-4 h-4" /> My Projects
                    </Button>
                    <Button variant={activeTab === 'labs' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('labs')}>
                        <MapPin className="w-4 h-4" /> My Labs
                    </Button>
                    <Button variant={activeTab === 'events' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('events')}>
                        <Calendar className="w-4 h-4" /> Events
                    </Button>
                    <Button variant={activeTab === 'messages' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('messages')}>
                        <MessageSquare className="w-4 h-4" /> Messages
                        <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
                    </Button>

                    <div className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8 mb-2">Account</div>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                        <User className="w-4 h-4" /> Public Profile
                    </Button>
                    <Link href="/settings" className="w-full block">
                        <Button variant="ghost" className="w-full justify-start gap-3">
                            <Settings className="w-4 h-4" /> Settings
                        </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10">
                        <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-h-screen max-w-full">
                {/* Top Navigation Bar */}
                <header className="h-16 bg-background/80 backdrop-blur-md border-b flex items-center justify-between px-6 sticky top-0 z-10 w-full">
                    <div className="flex items-center gap-4 md:hidden">
                        <Link href="/" className="font-bold text-lg tracking-tighter">
                            fablabs<span className="text-primary">.io</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex font-semibold text-lg capitalize">{activeTab}</div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className="rounded-full rounded-r-none border-r-0">
                            <Bell className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <div className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border bg-card">
                            <span className="text-sm font-medium px-2">{profile.name}</span>
                            <div className="w-8 h-8 rounded-full overflow-hidden border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Body */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-secondary/20">
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* Profile Header Card */}
                        <section className="bg-card rounded-2xl border shadow-sm p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg shrink-0 relative z-10">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-4 text-center md:text-left relative z-10">
                                <div>
                                    <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                        <h1 className="text-3xl font-extrabold tracking-tight">{profile.name}</h1>
                                        {profile.role === "Super Admin" && (
                                            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                                <Shield className="w-3 h-3" /> Admin
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground">{profile.email}</p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <Button className="gap-2 shadow-sm">
                                        <Plus className="w-4 h-4" /> New Project
                                    </Button>
                                    <Link href="/settings">
                                        <Button variant="outline" className="gap-2">
                                            <Edit3 className="w-4 h-4" /> Edit Profile
                                        </Button>
                                    </Link>
                                    <Button variant="secondary" size="icon" className="rounded-full">
                                        <Share2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="w-full md:w-64 bg-secondary/50 rounded-xl p-5 border relative z-10">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-semibold">Profile Completion</span>
                                    <span className="text-2xl font-bold text-primary">{profile.completion}%</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${profile.completion}%` }} />
                                </div>
                                <p className="text-xs text-muted-foreground mt-3 leading-tight">Add your skills and bio to reach 100%.</p>
                            </div>
                        </section>

                        {/* Stats Grid */}
                        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {[
                                { label: "Connected Labs", value: profile.labsCount, icon: MapPin, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { label: "Active Projects", value: profile.projectsCount, icon: Wrench, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                { label: "Upcoming Events", value: profile.eventsCount, icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
                                { label: "Community Kudos", value: 342, icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-card rounded-2xl p-6 border shadow-sm flex flex-col items-start gap-4 hover:border-primary/50 transition-colors cursor-default group">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold tracking-tight">{stat.value}</h3>
                                        <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </section>

                        {/* Detailed Content Grids */}
                        <div className="grid lg:grid-cols-3 gap-8">

                            {/* Left Column: Projects & Labs */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Pinned Projects */}
                                <section className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                                    <div className="px-6 py-5 border-b flex justify-between items-center bg-secondary/10">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <Wrench className="w-5 h-5 text-primary" /> My Active Projects
                                        </h3>
                                        <Button variant="ghost" size="sm" className="text-xs h-8">View All</Button>
                                    </div>
                                    <div className="divide-y">
                                        {[
                                            { title: "Smart City Sensor Array", lab: "Fab Lab Barcelona", status: "In Progress", image: "https://picsum.photos/seed/proj1/200/200" },
                                            { title: "Open Source Drone Frame", lab: "Fab Lab Oulu", status: "Review", image: "https://picsum.photos/seed/proj2/200/200" },
                                            { title: "Recycled Plastic Extruder", lab: "Personal", status: "Planning", image: "https://picsum.photos/seed/proj3/200/200" }
                                        ].map((proj, idx) => (
                                            <div key={idx} className="p-4 sm:p-6 hover:bg-secondary/20 transition-colors flex items-center justify-between group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img src={proj.image} alt="Project" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-base group-hover:text-primary transition-colors">{proj.title}</h4>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                                                            <MapPin className="w-3 h-3" /> {proj.lab}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-secondary text-xs font-semibold uppercase">{proj.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* My Associated Labs */}
                                <section className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                                    <div className="px-6 py-5 border-b flex justify-between items-center">
                                        <h3 className="font-bold text-lg flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" /> Associated Labs
                                        </h3>
                                    </div>
                                    <div className="p-6 grid sm:grid-cols-2 gap-4">
                                        {[
                                            { name: "Fab Lab Barcelona", role: "Director", city: "Barcelona, ES", image: "https://picsum.photos/seed/lab_avatar_1/300/300" },
                                            { name: "Fab Lab Oulu", role: "Visiting Researcher", city: "Oulu, FI", image: "https://picsum.photos/seed/lab_avatar_2/300/300" }
                                        ].map((lab, idx) => (
                                            <div key={idx} className="border rounded-xl p-4 flex items-center gap-4 hover:border-primary/50 transition-colors group cursor-pointer shadow-sm">
                                                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={lab.image} alt={lab.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">{lab.name}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1">{lab.role}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Right Column: Activity Feed */}
                            <div className="space-y-8">
                                <section className="bg-card rounded-2xl border shadow-sm p-6 overflow-hidden relative">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-primary" /> Recent Activity
                                    </h3>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                                        {[
                                            { text: "Uploaded blueprint", strong: "V2 Node Design", time: "2 hours ago", icon: Wrench, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                            { text: "Joined community discussion", strong: "Future of Makerspaces", time: "5 hours ago", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
                                            { text: "RSVP'd to", strong: "Global Fab Festival 2026", time: "1 day ago", icon: Calendar, color: "text-amber-500", bg: "bg-amber-500/10" },
                                            { text: "Received an endorsement from", strong: "Neil Gershenfeld", time: "3 days ago", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" }
                                        ].map((activity, idx) => (
                                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-card ${activity.bg} ${activity.color} shrink-0 z-10 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-0 translate-x-0`}>
                                                    <activity.icon className="w-4 h-4" />
                                                </div>
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-secondary/10 shadow-sm group-hover:bg-secondary/30 transition-colors">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <time className="text-xs text-muted-foreground font-medium">{activity.time}</time>
                                                    </div>
                                                    <div className="text-sm">
                                                        {activity.text} <span className="font-semibold text-foreground">{activity.strong}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="ghost" className="w-full mt-6 text-primary">View Full History</Button>
                                </section>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
