import { GenericUser, GenericLab, GenericActivity, OrchestrationNode } from "@/types";

/**
 * apiClient.ts
 * 
 * Centralized service layer for fetching data from the external Unified Dashboard APIs.
 * This file handles HTTP requests, authentication token injection, and data adapting/normalization
 * so the React components remain purely display-focused.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_UNIFIED_API_URL || "https://api.example.com/v1";

interface AdapterConfig {
    token?: string;
    params?: Record<string, string>;
}

export const UnifiedApiClient = {
    /**
     * Future Adapter: Fetch and normalize a Maker Profile
     */
    async fetchUser(idOrSlug: string, config?: AdapterConfig): Promise<GenericUser> {
        // TODO: Replace with actual fetch to unified API
        return {
            id: idOrSlug,
            first_name: "Mock",
            last_name: "User",
            avatar_url: null,
            bio: "Profile data fetched and adapted from external source.",
            city: "Global",
            country_code: "GL",
            links: [],
            badges: []
        };
    },

    /**
     * Future Adapter: Fetch and normalize a Lab Profile
     */
    async fetchLab(idOrSlug: string, config?: AdapterConfig): Promise<GenericLab> {
        // TODO: Replace with actual fetch to unified API
        return {
            id: idOrSlug,
            name: "Mock Global Lab",
            slug: "mock-global-lab",
            description: "Lab data fetched and adapted from external source.",
            location: { latitude: 0, longitude: 0 },
            links: []
        };
    },

    /**
     * Future Adapter: Fetch and normalize global activity feed
     */
    async fetchActivity(config?: AdapterConfig): Promise<GenericActivity[]> {
        // TODO: Replace with actual fetch to unified API
        return [];
    },

    /**
     * Bioregional Orchestration Adapter:
     * Pulls live data from the /api/federation proxy routes and normalizes
     * different ecosystem actors into a single `OrchestrationNode` interface.
     */
    async fetchOrchestrationNodes(): Promise<OrchestrationNode[]> {
        const nodes: OrchestrationNode[] = [];

        try {
            // Fetch live/mock FabLabs from federation cache
            try {
                const labRes = await fetch('/api/federation/fablabs');
                if (labRes.ok) {
                    const labs = await labRes.json();

                    // The mock data returns the array directly. The old live API nested it under data.labs or similar.
                    const labsArray = Array.isArray(labs) ? labs : (labs.data || []);

                    labsArray.forEach((l: any) => {
                        // Ensure stringent number conversion. react-map-gl silently drops pins if coords are strings
                        const lat = Number(l.latitude);
                        const lng = Number(l.longitude);

                        if (!isNaN(lat) && !isNaN(lng)) {
                            nodes.push({
                                id: `lab-${l.id}`,
                                type: 'Lab',
                                name: l.name || 'Unnamed Lab',
                                description: l.blurb || l.description || "Digital Fabrication Infrastructure",
                                location: {
                                    latitude: lat,
                                    longitude: lng,
                                    city: l.city,
                                    country_code: l.country_code
                                },
                                avatar_url: l.avatar_url,
                                url: `/labs/${l.slug ? l.slug : l.id}`
                            });
                        }
                    });
                }
            } catch (labErr) {
                console.error("Error parsing Fab Labs:", labErr);
            }

            // Fetch Mock Make Works (Material Suppliers)
            try {
                const mwRes = await fetch('/api/federation/makeworks');
                if (mwRes.ok) {
                    const mwJson = await mwRes.json();
                    const suppliers = mwJson.data || [];
                    suppliers.forEach((s: any) => {
                        // Make Works mock data might not have coordinates, spoofing European range for visualization
                        const lat = 41.0 + Math.random() * 10;
                        const lng = -5.0 + Math.random() * 20;
                        nodes.push({
                            id: `mw-${s.id}`,
                            type: 'MakeWorks',
                            name: s.name,
                            description: `Material Supplier: ${s.materials?.join(', ')}`,
                            location: {
                                latitude: lat,
                                longitude: lng,
                                city: s.location?.city,
                                country_code: s.location?.country
                            },
                            url: '#'
                        });
                    });
                }
            } catch (mwErr) {
                console.error("Error parsing Make Works:", mwErr);
            }

            // Fetch Mock Fab City Hubs
            try {
                const fcRes = await fetch('/api/federation/fabcity');
                if (fcRes.ok) {
                    const fcJson = await fcRes.json();
                    const cities = fcJson.data || [];
                    cities.forEach((c: any) => {
                        if (c.location?.latitude && c.location?.longitude) {
                            nodes.push({
                                id: `fc-${c.id}`,
                                type: 'FabCity',
                                name: c.initiative,
                                description: c.description,
                                location: {
                                    latitude: c.location.latitude,
                                    longitude: c.location.longitude,
                                    city: c.city,
                                    country_code: c.country
                                },
                                url: c.website || '#'
                            });
                        }
                    });
                }
            } catch (fcErr) {
                console.error("Error parsing Fab City Hubs:", fcErr);
            }

            // Fetch Mock Distributed Design Projects (Design Talent)
            try {
                const ddRes = await fetch('/api/federation/distributed-design');
                if (ddRes.ok) {
                    const ddJson = await ddRes.json();
                    const projects = ddJson.data || [];
                    projects.forEach((p: any) => {
                        // Spoofing European/Global range for visualization
                        const lat = 35.0 + Math.random() * 20;
                        const lng = -10.0 + Math.random() * 30;
                        nodes.push({
                            id: p.id,
                            type: 'DistributedDesign',
                            name: p.name,
                            description: `Design Talent by ${p.author} - Category: ${p.category}`,
                            location: {
                                latitude: lat,
                                longitude: lng,
                                city: 'Global/Digital',
                                country_code: 'INT' // International / Digital
                            },
                            url: p.files_url || '#'
                        });
                    });
                }
            } catch (ddErr) {
                console.error("Error parsing Distributed Design:", ddErr);
            }

        } catch (e) {
            console.error("Master Orchestration Fetch Failed:", e);
        }

        return nodes;
    }
};
