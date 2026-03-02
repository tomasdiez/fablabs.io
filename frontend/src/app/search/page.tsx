"use client";

import { Button } from "@/components/ui/button";
import { SearchIcon, MapPin, User, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([
        { id: 1, type: "Lab", title: "Fab Lab Oulu", subtitle: "Oulu, Finland", icon: <MapPin className="w-5 h-5" /> },
        { id: 2, type: "User", title: "Tomas Diez", subtitle: "Director, Fab Lab Barcelona", icon: <User className="w-5 h-5" /> },
        { id: 3, type: "Project", title: "Smart Citizen Kit", subtitle: "Open-source environmental monitoring", icon: <Settings className="w-5 h-5" /> },
        { id: 4, type: "Machine", title: "Epilog Zing 24", subtitle: "Laser Cutter", icon: <Settings className="w-5 h-5" /> }
    ]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center pt-24">
            <div className="w-full max-w-3xl px-4 space-y-8">

                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight">Global Search</h1>
                    <p className="text-muted-foreground text-lg">
                        Find labs, makers, projects, and machinery across the entire network.
                    </p>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                        <SearchIcon className="w-6 h-6" />
                    </div>
                    <input
                        type="text"
                        className="w-full pl-16 pr-6 py-6 text-xl bg-card border-2 border-border rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Search anything..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 pb-4 overflow-x-auto">
                    <Button variant="secondary" className="rounded-full">All Results</Button>
                    <Button variant="outline" className="rounded-full">Labs</Button>
                    <Button variant="outline" className="rounded-full">Makers</Button>
                    <Button variant="outline" className="rounded-full">Projects</Button>
                    <Button variant="outline" className="rounded-full">Machines</Button>
                </div>

                <div className="space-y-4">
                    {results.filter(r => r.title.toLowerCase().includes(query.toLowerCase())).map((result) => (
                        <Link key={result.id} href="#" className="flex items-center p-4 bg-card border rounded-2xl hover:border-primary hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                {result.icon}
                            </div>
                            <div className="ml-4 flex-1">
                                <h2 className="text-lg font-bold group-hover:text-primary transition-colors">{result.title}</h2>
                                <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                            </div>
                            <div className="px-3 py-1 bg-secondary text-xs font-semibold rounded-full text-muted-foreground uppercase tracking-wider">
                                {result.type}
                            </div>
                        </Link>
                    ))}
                    {results.filter(r => r.title.toLowerCase().includes(query.toLowerCase())).length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No results found for "{query}". Try a different keyword.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
