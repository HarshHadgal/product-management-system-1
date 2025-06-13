import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CustomerDetails from '@/models/CustomerDetails';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const customerDetails = await CustomerDetails.findById(params.id);

    if (!customerDetails) {
      return NextResponse.json(
        { error: 'Customer details not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(customerDetails);
  } catch (error) {
    console.error('Error fetching customer details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer details' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const data = await request.json();

    const updatedCustomerDetails = await CustomerDetails.findByIdAndUpdate(
      params.id,
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const deletedCustomerDetails = await CustomerDetails.findByIdAndDelete(
      params.id
    );

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