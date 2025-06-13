import { Suspense } from 'react';
import EditCustomerDetailsForm from './EditCustomerDetailsForm';

export default function EditCustomerDetailsPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B7355]"></div>
      </div>
    }>
      <EditCustomerDetailsForm id={params.id} />
    </Suspense>
  );
} 