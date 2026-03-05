import { NextResponse } from 'next/server';
import { federationCache } from '@/services/federationCache';

const FABLABS_API_URL = 'https://fablabs.io/labs.json';
const CACHE_KEY = 'fablabs_live_labs';

export async function GET() {
    // Return mock data since the live API is unreachable
    const mockLabs = [
        {
            id: "lab-1",
            name: "Fab Lab Barcelona",
            slug: "fab-lab-barcelona",
            blurb: "The first Fab Lab in the EU, located at IAAC.",
            latitude: 41.3962,
            longitude: 2.1947,
            city: "Barcelona",
            country_code: "ES"
        },
        {
            id: "lab-2",
            name: "Fab Lab Oulu",
            slug: "fab-lab-oulu",
            blurb: "A versatile digital fabrication facility located inside the University of Oulu.",
            latitude: 65.0593,
            longitude: 25.4662,
            city: "Oulu",
            country_code: "FI"
        },
        {
            id: "lab-3",
            name: "Fab Lab Boston",
            slug: "fab-lab-boston",
            blurb: "One of the original MIT Fab Labs.",
            latitude: 42.3601,
            longitude: -71.0942,
            city: "Boston",
            country_code: "US"
        },
        {
            id: "lab-4",
            name: "Fab Lab Lima",
            slug: "fab-lab-lima",
            blurb: "Connecting the South American maker community.",
            latitude: -12.0464,
            longitude: -77.0428,
            city: "Lima",
            country_code: "PE"
        },
        {
            id: "lab-5",
            name: "Fab Lab Tokyo",
            slug: "fab-lab-tokyo",
            blurb: "Driving digital fabrication in Japan.",
            latitude: 35.6762,
            longitude: 139.6503,
            city: "Tokyo",
            country_code: "JP"
        }
    ];

    return NextResponse.json(
        mockLabs,
        { headers: { 'Cache-Control': 'public, max-age=900' } }
    );
}
