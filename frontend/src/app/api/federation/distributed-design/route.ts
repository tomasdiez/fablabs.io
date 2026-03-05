import { NextResponse } from 'next/server';

export async function GET() {
    // Simulated latency for realism
    await new Promise(resolve => setTimeout(resolve, 400));

    const mockOpenSourceProjects = [
        {
            id: "dd-1",
            name: "Open Source Smart Hive",
            category: "Agriculture Tech",
            author: "Distributed Design Team",
            license: "Creative Commons BY-SA",
            files_url: "https://example.com/files/smart-hive"
        },
        {
            id: "dd-2",
            name: "Parametric Furniture Set",
            category: "Furniture",
            author: "Open Design Lab",
            license: "Creative Commons Zero (CC0)",
            files_url: "https://example.com/files/furniture-set"
        }
    ];

    return NextResponse.json(
        { source: 'mock-distributed-design', data: mockOpenSourceProjects },
        { headers: { 'Cache-Control': 'public, max-age=3600' } }
    );
}
