import { Suspense } from 'react';
import CustomerDetailsPDFView from './CustomerDetailsPDFView';

export default function CustomerDetailsPDFPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    }>
      <CustomerDetailsPDFView id={params.id} />
    </Suspense>
  );
} 