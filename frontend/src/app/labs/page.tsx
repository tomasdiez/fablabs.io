"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// Removed next-auth integration
import Map, { Marker, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { UnifiedApiClient } from "@/services/apiClient";
import { OrchestrationNode } from "@/types";

import dynamic from "next/dynamic";

function LabsPageContent() {
    // Mock session for unified dashboard pivot demonstration
    const session: any = { user: { name: "Tomas Diez", image: "https://i.pravatar.cc/150?u=tomas" } };

    const handleSignIn = () => alert("Authentication will be handled by external SSO.");
    const handleSignOut = () => alert("Logout will be handled by external SSO.");

    // Bioregional Orchestration State
    const [nodes, setNodes] = useState<OrchestrationNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Layer Toggles
    const [showLabs, setShowLabs] = useState(true);
    const [showMakeWorks, setShowMakeWorks] = useState(true);
    const [showFabCity, setShowFabCity] = useState(true);
    const [showDistributedDesign, setShowDistributedDesign] = useState(true);

    useEffect(() => {
        async function loadEcosystem() {
            setLoading(true);
            const data = await UnifiedApiClient.fetchOrchestrationNodes();
            setNodes(data);
            setLoading(false);
        }
        loadEcosystem();
    }, []);

    // Filter pipeline
    const filteredNodes = nodes.filter(node => {
        if (!showLabs && node.type === 'Lab') return false;
        if (!showMakeWorks && node.type === 'MakeWorks') return false;
        if (!showFabCity && node.type === 'FabCity') return false;
        if (!showDistributedDesign && node.type === 'DistributedDesign') return false;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return node.name.toLowerCase().includes(query) ||
                node.description?.toLowerCase().includes(query) ||
                node.location.city?.toLowerCase().includes(query);
        }
        return true;
    });

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
                                        onClick={handleSignOut}
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
                            <Button variant="default" size="sm" onClick={handleSignIn}>
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
                    {/* Orchestration Layer Toggles */}
                    <div className="flex flex-col gap-2 pt-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showLabs}
                                onChange={(e) => setShowLabs(e.target.checked)}
                                className="rounded text-blue-500 focus:ring-blue-500"
                            />
                            <span className="font-medium">Manufacturing Hubs (Fab Labs)</span>
                            <div className="ml-auto w-3 h-3 rounded-full bg-blue-500" />
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showMakeWorks}
                                onChange={(e) => setShowMakeWorks(e.target.checked)}
                                className="rounded text-green-500 focus:ring-green-500"
                            />
                            <span className="font-medium">Material Suppliers (Make Works)</span>
                            <div className="ml-auto w-3 h-3 rounded-full bg-green-500" />
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showFabCity}
                                onChange={(e) => setShowFabCity(e.target.checked)}
                                className="rounded text-purple-600 focus:ring-purple-600"
                            />
                            <span className="font-medium">Fab City Network</span>
                            <div className="ml-auto w-3 h-3 rounded-full bg-purple-600" />
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showDistributedDesign}
                                onChange={(e) => setShowDistributedDesign(e.target.checked)}
                                className="rounded text-orange-500 focus:ring-orange-500"
                            />
                            <span className="font-medium">Design Talent (Distributed Design)</span>
                            <div className="ml-auto w-3 h-3 rounded-full bg-orange-500" />
                        </label>
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
                        filteredNodes.map((node) => {
                            // Determine visual styling based on network type
                            let borderHover = "hover:border-primary";
                            let iconBg = "bg-primary/10 text-primary";
                            let titleHover = "group-hover:text-primary";

                            if (node.type === 'Lab') { borderHover = "hover:border-blue-500"; iconBg = "bg-blue-500/10 text-blue-500"; titleHover = "group-hover:text-blue-500"; }
                            if (node.type === 'MakeWorks') { borderHover = "hover:border-green-500"; iconBg = "bg-green-500/10 text-green-500"; titleHover = "group-hover:text-green-500"; }
                            if (node.type === 'FabCity') { borderHover = "hover:border-purple-600"; iconBg = "bg-purple-600/10 text-purple-600"; titleHover = "group-hover:text-purple-600"; }
                            if (node.type === 'DistributedDesign') { borderHover = "hover:border-orange-500"; iconBg = "bg-orange-500/10 text-orange-500"; titleHover = "group-hover:text-orange-500"; }

                            return (
                                <Link key={node.id} href={node.url}>
                                    <div className={`group flex gap-4 p-4 border rounded-xl hover:shadow-md transition-all cursor-pointer bg-card ${borderHover}`}>
                                        <div className={`w-16 h-16 rounded-lg shrink-0 flex items-center justify-center overflow-hidden ${iconBg}`}>
                                            {node.avatar_url ? (
                                                <Image
                                                    src={node.avatar_url}
                                                    alt={node.name}
                                                    width={64}
                                                    height={64}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <MapPin className="h-6 w-6" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`font-semibold transition-colors ${titleHover}`}>
                                                {node.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {[node.location.city, node.location.country_code].filter(Boolean).join(", ") || "Location unknown"}
                                            </p>
                                            <p className="text-sm mt-2 line-clamp-2">{node.description || "No description provided."}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Interactive Map Area */}
            <div className="flex-1 relative bg-secondary/30 flex flex-col pt-16">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground z-10">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                        <p>Loading global map...</p>
                    </div>
                ) : (
                    <div className="flex-1 relative z-0 w-full h-full">
                        <Map
                            initialViewState={{
                                longitude: 10,
                                latitude: 45,
                                zoom: 3
                            }}
                            scrollZoom={true}
                            dragPan={true}
                            dragRotate={true}
                            mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
                            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
                        >
                            <NavigationControl position="bottom-right" />
                            {filteredNodes.map((node) => {
                                let markerBg = "bg-primary";
                                if (node.type === 'Lab') markerBg = "bg-blue-500";
                                if (node.type === 'MakeWorks') markerBg = "bg-green-500";
                                if (node.type === 'FabCity') markerBg = "bg-purple-600";
                                if (node.type === 'DistributedDesign') markerBg = "bg-orange-500";

                                return node.location?.latitude && node.location?.longitude ? (
                                    <Marker
                                        key={node.id}
                                        longitude={node.location.longitude}
                                        latitude={node.location.latitude}
                                        anchor="bottom"
                                        onClick={(e) => {
                                            e.originalEvent.stopPropagation();
                                            // Future: Open popup
                                        }}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer transform hover:scale-110 transition-transform text-white ${markerBg}`}>
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                    </Marker>
                                ) : null;
                            })}
                        </Map>
                    </div>
                )}
            </div>
        </div>
    );
}

export default dynamic(() => Promise.resolve(LabsPageContent), { ssr: false });
