"use client";

import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Navigation() {
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/search');
        }
    };

    return (
        <header className="fixed top-0 w-full z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="text-xl font-bold tracking-tighter shrink-0">
                        fablabs<span className="text-primary">.io</span>
                    </Link>
                    <nav className="hidden md:flex gap-6 text-sm font-medium items-center">
                        <Link href="/labs" className="hover:text-primary transition-colors py-2">
                            Labs
                        </Link>
                        <Link href="/activity" className="hover:text-primary transition-colors py-2">
                            Feed
                        </Link>
                        <Link href="/tools" className="hover:text-primary transition-colors py-2">
                            Tools
                        </Link>

                        {/* Interactive Ecosystem Dropdown */}
                        <div className="relative group p-2 -ml-2">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors">
                                Ecosystem <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                            </button>
                            {/* Dropdown Card */}
                            <div className="absolute top-full left-0 mt-0 w-48 bg-card border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 flex flex-col gap-1 z-50">
                                <a href="https://fab.city" target="_blank" rel="noopener noreferrer" className="px-3 py-2 hover:bg-secondary rounded-lg text-sm transition-colors flex items-center justify-between group/link">
                                    <span>Fab City</span>
                                </a>
                                <a href="https://cba.mit.edu" target="_blank" rel="noopener noreferrer" className="px-3 py-2 hover:bg-secondary rounded-lg text-sm transition-colors flex items-center justify-between group/link">
                                    <span>MIT CBA</span>
                                </a>
                                <a href="https://fabacademy.org" target="_blank" rel="noopener noreferrer" className="px-3 py-2 hover:bg-secondary rounded-lg text-sm transition-colors flex items-center justify-between group/link">
                                    <span>Fab Academy</span>
                                </a>
                                <a href="https://fabfoundation.org" target="_blank" rel="noopener noreferrer" className="px-3 py-2 hover:bg-secondary rounded-lg text-sm transition-colors flex items-center justify-between group/link">
                                    <span>Fab Foundation</span>
                                </a>
                            </div>
                        </div>
                    </nav>
                </div>

                <div className="flex-1 max-w-md hidden md:block">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search network..."
                            className="w-full pl-9 pr-4 py-2 text-sm border rounded-full bg-secondary/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                    {session?.user ? (
                        <div className="relative group flex items-center gap-3 cursor-pointer">
                            <div className="hidden sm:flex flex-col text-right justify-center">
                                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                            </div>

                            {/* Avatar Trigger */}
                            <div className="shrink-0 relative">
                                {session.user.image ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full border border-border group-hover:ring-2 group-hover:ring-primary transition-all" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:ring-2 group-hover:ring-primary transition-all">
                                        {session.user.name?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>

                            {/* Dropdown Menu */}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-card border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 flex flex-col gap-1 z-50">
                                <Link href="/dashboard" className="px-3 py-2 hover:bg-secondary rounded-lg text-sm transition-colors text-foreground font-medium">
                                    Dashboard
                                </Link>
                                <Link href="/settings" className="px-3 py-2 hover:bg-secondary rounded-lg text-sm transition-colors text-muted-foreground hover:text-foreground">
                                    Settings
                                </Link>
                                <div className="h-px bg-border my-1" />
                                <button
                                    onClick={() => signOut()}
                                    className="px-3 py-2 hover:bg-destructive/10 hover:text-destructive rounded-lg text-sm transition-colors text-left text-muted-foreground"
                                >
                                    Log out
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" onClick={() => signIn("fablabs")} className="hidden sm:flex">
                                Sign In
                            </Button>
                            <Button size="sm" onClick={() => signIn("fablabs")}>Join Network</Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
