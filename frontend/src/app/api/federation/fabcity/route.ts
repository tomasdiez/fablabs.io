import { NextResponse } from 'next/server';

export async function GET() {
    // Simulated latency
    await new Promise(resolve => setTimeout(resolve, 250));

    const mockFabCities = [
        {
            id: "fc-1",
            city: "Barcelona",
            country: "Spain",
            initiative: "Fab City Hub Barcelona",
            description: "The pioneering node of the global Fab City network, driving localization and circular economy design.",
            location: { latitude: 41.3962, longitude: 2.1947 },
            website: "https://fab.city/barcelona"
        },
        {
            id: "fc-2",
            city: "Paris",
            country: "France",
            initiative: "Fab City Grand Paris",
            description: "A collective intelligence network building productive, resilient, and inclusive cities.",
            location: { latitude: 48.8566, longitude: 2.3522 },
            website: "https://fab.city/paris"
        },
        {
            id: "fc-3",
            city: "Amsterdam",
            country: "Netherlands",
            initiative: "Fab City Amsterdam",
            description: "Focusing on smart city integration, open design, and circular manufacturing.",
            location: { latitude: 52.3676, longitude: 4.9041 },
            website: "https://fab.city/amsterdam"
        }
    ];

    return NextResponse.json(
        { source: 'mock-fabcity', data: mockFabCities },
        { headers: { 'Cache-Control': 'public, max-age=3600' } }
    );
}
