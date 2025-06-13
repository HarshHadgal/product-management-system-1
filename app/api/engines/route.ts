import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Engine from '@/models/Engine';

export async function GET() {
  try {
    await connectDB();
    const engines = await Engine.find({}).sort({ date_of_fill: -1 });
    return NextResponse.json(engines);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    await connectDB();
    const engine = await Engine.create(body);
    return NextResponse.json(engine, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 