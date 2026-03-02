"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

interface Lab {
    id: string;
    name: string;
    slug: string;
    description: string;
    city: string;
    country_code: string;
    avatar_url?: string;
    latitude?: number | null;
    longitude?: number | null;
}

import dynamic from "next/dynamic";

function LabsPageContent() {
    const { data: session } = useSession();
    const [labs, setLabs] = useState<Lab[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/labs");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                setLabs(data);
            } catch (error) {
                console.error("Failed to fetch labs:", error);
                // Optionally set some fallback state or show an error
            } finally {
                setLoading(false);
            }
        };

        fetchLabs();
    }, []);

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar List */}
            <div className="w-[400px] border-r flex flex-col pt-16 h-full z-10 bg-card shadow-xl">
                <div className="p-4 border-b space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">Discover Labs</h1>
                        {session?.user ? (
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                    <button
                                        onClick={() => signOut()}
                                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        Log out
                                    </button>
                                </div>
                                {session.user.image ? (
                                    <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full border border-border" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        {session.user.name?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button variant="default" size="sm" onClick={() => signIn("fablabs")}>
                                Log in
                            </Button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search labs, cities..."
                                className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse flex gap-4 p-4 border rounded-xl">
                                    <div className="w-16 h-16 bg-muted rounded-lg shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-muted rounded w-3/4" />
                                        <div className="h-3 bg-muted rounded w-1/2" />
                                        <div className="h-3 bg-muted rounded w-full mt-2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        labs.map((lab) => (
                            <Link key={lab.id} href={`/labs/${lab.slug}`}>
                                <div className="group flex gap-4 p-4 border rounded-xl hover:border-primary hover:shadow-md transition-all cursor-pointer bg-card">
                                    <div className="w-16 h-16 bg-primary/10 rounded-lg shrink-0 flex items-center justify-center text-primary overflow-hidden">
                                        {lab.avatar_url ? (
                                            <Image
                                                src={lab.avatar_url}
                                                alt={lab.name}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <MapPin className="h-6 w-6" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold group-hover:text-primary transition-colors">{lab.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {[lab.city, lab.country_code].filter(Boolean).join(", ") || "Location unknown"}
                                        </p>
                                        <p className="text-sm mt-2 line-clamp-2">{lab.description || "No description provided."}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Interactive Map Area */}
            <div className="flex-1 relative pt-16 bg-secondary/30">
                <div className="absolute inset-0 pt-16 flex items-center justify-center pointer-events-none">
                    {loading ? (
                        <div className="flex flex-col items-center text-muted-foreground">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                            <p>Loading global map...</p>
                        </div>
                    ) : (
                        <Map
                            initialViewState={{
                                longitude: 0,
                                latitude: 20,
                                zoom: 1.5
                            }}
                            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                            style={{ width: "100%", height: "100%" }}
                        >
                            <NavigationControl position="bottom-right" />
                            {labs.map((lab) => (
                                lab.latitude && lab.longitude ? (
                                    <Marker
                                        key={lab.id}
                                        longitude={lab.longitude}
                                        latitude={lab.latitude}
                                        anchor="bottom"
                                    >
                                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                    </Marker>
                                ) : null
                            ))}
                        </Map>
                    )}
                </div>
            </div>
        </div>
    );
}

export default dynamic(() => Promise.resolve(LabsPageContent), { ssr: false });
