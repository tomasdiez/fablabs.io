import { NextResponse } from 'next/server';
import { federationCache } from '@/services/federationCache';

const FABLABS_API_MACHINES_URL = 'https://api.fablabs.io/v0/machines.json';
const CACHE_KEY = 'fablabs_live_machines';

export async function GET() {
    try {
        const cachedMachines = federationCache.get(CACHE_KEY);
        if (cachedMachines) {
            return NextResponse.json(
                { source: 'cache', data: cachedMachines },
                { headers: { 'Cache-Control': 'public, max-age=900' } }
            );
        }

        const response = await fetch(FABLABS_API_MACHINES_URL, {
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`External API responded with ${response.status}`);
        }

        const data = await response.json();

        federationCache.set(CACHE_KEY, data);

        return NextResponse.json(
            { source: 'live', data },
            { headers: { 'Cache-Control': 'public, max-age=900' } }
        );

    } catch (error: any) {
        console.error("Federation Gateway - Fablabs Machines Error:", error);
        return NextResponse.json({ error: "Failed to fetch aggregated machine data" }, { status: 500 });
    }
}
