import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CustomerDetails from '@/models/CustomerDetails';

export async function GET(
  request: NextRequest,
  { params }: { params: { engineNumber: string } }
) {
  const { engineNumber } = params;

  if (!engineNumber) {
    return NextResponse.json({ error: 'Engine number is required' }, { status: 400 });
  }

  try {
    await dbConnect();

    const customer = await CustomerDetails.findOne({ 'tractorInfo.engineNumber': engineNumber });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error fetching customer details by engine number:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}