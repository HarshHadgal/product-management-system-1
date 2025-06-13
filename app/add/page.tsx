'use client';

import { useRouter } from 'next/navigation';
import EngineForm from '../components/EngineForm';
import type { EngineFormData } from '../components/EngineForm';
// import Navbar from '../components/Navbar';

export default function AddEnginePage() {
  const router = useRouter();

  const handleFormSubmit = async (formData: EngineFormData) => {
    try {
      const response = await fetch('/api/engines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add engine');
      }

      router.push('/');
    } catch (error) {
      console.error('Error adding engine:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F8]">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Company Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2B2A] tracking-wide mb-3 font-serif">
            ARSONS TECH SOLUTIONS
          </h1>
          <h2 className="text-xl md:text-2xl text-[#8B7355] tracking-widest font-medium border-t border-b border-[#E8E4E1] py-3 inline-block px-8">
            FIELD SERVICE REPORT
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-[#E8E4E1] p-8">
          <EngineForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
} 