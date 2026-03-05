import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Mock validation of the DIDO transaction
        if (!body.designId || !body.labId || !body.supplierId) {
            return NextResponse.json(
                { error: 'Missing required DIDO transaction parameters (designId, labId, supplierId)' },
                { status: 400 }
            );
        }

        // Simulate ledger recording latency
        await new Promise(resolve => setTimeout(resolve, 800));

        // Generate mock transaction receipt
        const receipt = {
            transactionHash: `0x${Math.random().toString(16).slice(2, 42)}`,
            timestamp: new Date().toISOString(),
            status: 'COMMITTED',
            network: 'FabCity OS (Interfacer Mock Layer)',
            details: {
                design_blueprint: body.designId,
                manufacturing_node: body.labId,
                material_source: body.supplierId
            }
        };

        return NextResponse.json(
            { success: true, receipt },
            { headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process transaction' },
            { status: 500 }
        );
    }
}
