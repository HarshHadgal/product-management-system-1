import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CustomerDetails from '@/models/CustomerDetails';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();

    const customerDetails = await CustomerDetails.create(data);
    return NextResponse.json(customerDetails, { status: 201 });
  } catch (error) {
    console.error('Error creating customer details:', error);
    return NextResponse.json(
      { error: 'Failed to create customer details' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const customerDetails = await CustomerDetails.find({}).sort({ createdAt: -1 });
    return NextResponse.json(customerDetails);
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer details' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    const deletedCustomerDetails = await CustomerDetails.findByIdAndDelete(id);
    if (!deletedCustomerDetails) {
      return NextResponse.json(
        { error: 'Customer details not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Customer details deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer details:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer details' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const data = await request.json();

    const updatedCustomerDetails = await CustomerDetails.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!updatedCustomerDetails) {
      return NextResponse.json(
        { error: 'Customer details not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCustomerDetails);
  } catch (error) {
    console.error('Error updating customer details:', error);
    return NextResponse.json(
      { error: 'Failed to update customer details' },
      { status: 500 }
    );
  }
} 