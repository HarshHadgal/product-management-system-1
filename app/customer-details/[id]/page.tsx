import { Suspense } from 'react';
import CustomerDetailsPreview from './CustomerDetailsPreview';

export default function CustomerDetailsPreviewPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B7355]"></div>
      </div>
    }>
      <CustomerDetailsPreview id={params.id} />
    </Suspense>
  );
} 