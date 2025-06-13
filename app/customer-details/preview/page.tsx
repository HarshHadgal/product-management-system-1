import PreviewCustomerDetails from './components/PreviewComponent'; './components/PreviewComponent';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PreviewCustomerDetails />
    </Suspense>
  );
}
