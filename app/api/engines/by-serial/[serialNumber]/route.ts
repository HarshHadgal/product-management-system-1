import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Engine from '@/models/Engine';

export async function GET(
  request: NextRequest,
  { params }: { params: { serialNumber: string } }
) {
  const { serialNumber } = params;

  if (!serialNumber) {
    return NextResponse.json({ error: 'Serial number is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const engine = await Engine.findOne({ engine_serial_number: serialNumber }).sort({ date_of_fill: -1 });

    if (!engine) {
      return NextResponse.json({ error: 'Engine not found' }, { status: 404 });
    }

    return NextResponse.json(engine);
  } catch (error) {
    console.error('Error fetching engine details by serial number:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}