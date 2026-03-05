import { NextResponse } from 'next/server';

export async function GET() {
    // Simulated latency for realism
    await new Promise(resolve => setTimeout(resolve, 300));

    const mockLocalFabricators = [
        {
            id: "mw-1",
            type: "Material Supplier",
            name: "EcoPlastics BCN",
            location: { city: "Barcelona", country: "Spain" },
            materials: ["Recycled  PLA", "Bio-Resin"],
            certified: true
        },
        {
            id: "mw-2",
            type: "Local Fabricator",
            name: "WoodWorks Studio",
            location: { city: "Berlin", country: "Germany" },
            materials: ["Plywood", "Timber"],
            certified: false
        }
    ];

    return NextResponse.json(
        { source: 'mock-makeworks', data: mockLocalFabricators },
        { headers: { 'Cache-Control': 'public, max-age=3600' } }
    );
}
