import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Engine from '@/models/Engine';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const engine = await Engine.findById(params.id);
    if (!engine) {
      return NextResponse.json({ error: 'Engine not found' }, { status: 404 });
    }
    return NextResponse.json(engine);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    await connectDB();

    console.log('Received update data:', body);

    // Validate engine_serial_number
    if (!body.engine_serial_number) {
      return NextResponse.json(
        { error: 'Engine serial number is required' },
        { status: 400 }
      );
    }

    // First, find the existing engine
    const existingEngine = await Engine.findById(params.id);
    if (!existingEngine) {
      return NextResponse.json({ error: 'Engine not found' }, { status: 404 });
    }

    // Create update data with all fields
    const updateData = {
      engine_model: body.engine_model,
      engine_serial_number: body.engine_serial_number,
      alternator_serial_number: body.alternator_serial_number,
      alternator_kva: body.alternator_kva,
      alternator_make: body.alternator_make,
      customer_name: body.customer_name,
      customer_address: body.customer_address,
      parameters: {
        voltage: body.parameters.voltage,
        kw: body.parameters.kw,
        pf: body.parameters.pf,
        amps: body.parameters.amps,
        water_temp: body.parameters.water_temp,
        lube_oil_temp: body.parameters.lube_oil_temp,
        lube_oil_pressure: body.parameters.lube_oil_pressure
      },
      description: body.description,
      parts_replaced: body.parts_replaced,
      recommendation: body.recommendation,
      employee_serial_number: body.employee_serial_number,
      date_of_fill: body.date_of_fill || new Date()
    };

    console.log('Update data being sent to MongoDB:', updateData);

    // Update the engine with the new data
    const engine = await Engine.findByIdAndUpdate(
      params.id,
      updateData,
      {
        new: true,
        runValidators: true,
        overwrite: false // Don't overwrite the entire document
      }
    );

    if (!engine) {
      return NextResponse.json({ error: 'Failed to update engine' }, { status: 500 });
    }

    // Verify the update
    const updatedEngine = await Engine.findById(params.id);
    console.log('Updated engine data:', updatedEngine);

    return NextResponse.json(updatedEngine);
  } catch (error: any) {
    console.error('Update error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error', 
        details: error?.message || 'Unknown error occurred'
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const engine = await Engine.findByIdAndDelete(params.id);
    if (!engine) {
      return NextResponse.json({ error: 'Engine not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Engine deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 