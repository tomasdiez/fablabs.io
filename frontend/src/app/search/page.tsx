"use client";

import { Button } from "@/components/ui/button";
import { SearchIcon, MapPin, User, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface SearchResult {
    id: number | string;
    type: "Lab" | "Maker" | "Project" | "Machine";
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    url: string;
    image_url?: string;
}

// Custom hook to debounce search queries
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);
    const [filter, setFilter] = useState("All");

    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!debouncedQuery.trim()) {
            setResults([]);
            return;
        }

        const runSearch = async () => {
            setIsLoading(true);
            try {
                // Mimicking delay from future unified federated search API
                await new Promise(resolve => setTimeout(resolve, 600));

                const aggregated: SearchResult[] = [
                    {
                        id: `l-mock1`,
                        type: "Lab",
                        title: "Mock Lab Alpha",
                        subtitle: "Berlin, DE",
                        icon: <MapPin className="w-5 h-5" />,
                        url: `/labs/mock-alpha`
                    },
                    {
                        id: `u-mock1`,
                        type: "Maker",
                        title: "Mock Maker",
                        subtitle: `@mockmaker`,
                        icon: <User className="w-5 h-5" />,
                        url: `/users/mock-user`
                    }
                ];

                setResults(aggregated.filter(r => r.title.toLowerCase().includes(debouncedQuery.toLowerCase()) || r.type.toLowerCase().includes(debouncedQuery.toLowerCase())));
            } catch (err) {
                console.error("Failed to execute federated search query.", err);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        runSearch();
    }, [debouncedQuery]);

    const activeResults = filter === "All" ? results : results.filter(r => r.type === filter);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center pt-24 pb-12">
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
                        className="w-full pl-16 pr-12 py-6 text-xl bg-card border-2 border-border rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder="Search anything..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {isLoading && (
                        <div className="absolute inset-y-0 right-6 flex items-center">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                    )}
                </div>

                <div className="flex gap-2 pb-4 overflow-x-auto">
                    {["All", "Lab", "Maker", "Project", "Machine"].map(f => (
                        <Button
                            key={f}
                            variant={filter === f ? "default" : "outline"}
                            className="rounded-full"
                            onClick={() => setFilter(f)}
                        >
                            {f === "All" ? "All Results" : f + "s"}
                        </Button>
                    ))}
                </div>

                <div className="space-y-4">
                    {activeResults.map((result) => (
                        <Link key={result.id} href={result.url} className="flex items-center p-4 bg-card border rounded-2xl hover:border-primary hover:shadow-md transition-all group cursor-pointer block">
                            <div className="w-14 h-14 rounded-xl bg-secondary overflow-hidden shrink-0 flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                {result.image_url ? (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={result.image_url} alt={result.title} className="w-full h-full object-cover" />
                                ) : (
                                    result.icon
                                )}
                            </div>
                            <div className="ml-4 flex-1 min-w-0">
                                <h2 className="text-lg font-bold group-hover:text-primary transition-colors truncate">{result.title}</h2>
                                <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                            </div>
                            <div className="px-3 py-1 bg-secondary text-xs font-semibold rounded-full text-muted-foreground uppercase tracking-wider shrink-0 ml-4 hidden sm:block">
                                {result.type}
                            </div>
                        </Link>
                    ))}

                    {debouncedQuery.trim() !== "" && activeResults.length === 0 && !isLoading && (
                        <div className="text-center py-16 bg-card border rounded-2xl border-dashed">
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                <SearchIcon className="w-8 h-8 opacity-50" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">No results found</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                We couldn't find anything matching "{debouncedQuery}" in the selected category. Try a different keyword or check your spelling.
                            </p>
                        </div>
                    )}

                    {debouncedQuery.trim() === "" && (
                        <div className="text-center py-16 bg-card border rounded-2xl border-dashed border-primary/20">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                <SearchIcon className="w-8 h-8 opacity-80" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-primary">Start Searching</h3>
                            <p className="text-muted-foreground max-w-sm mx-auto">
                                Type a keyword above to instantly search across the entire global Fab Lab network.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
