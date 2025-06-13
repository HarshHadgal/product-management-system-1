'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import EngineForm from '../../components/EngineForm';
import type { EngineFormData } from '../../components/EngineForm';

export default function EditEnginePage() {
  const params = useParams();
  const router = useRouter();
  const [engine, setEngine] = useState<EngineFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEngine = async () => {
      try {
        const response = await fetch(`/api/engines/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch engine data');
        }
        const data = await response.json();
        console.log('Fetched engine data:', data);
        setEngine(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching engine data:', error);
        setLoading(false);
      }
    };

    fetchEngine();
  }, [params.id]);

  const handleFormSubmit = async (formData: EngineFormData) => {
    try {
      console.log('Form data before submission:', formData);
      
      // Ensure engine_serial_number is included and not empty
      if (!formData.engine_serial_number?.trim()) {
        throw new Error('Engine serial number is required');
      }

      // Create the update data
      const updateData = {
        engine_model: formData.engine_model,
        engine_serial_number: formData.engine_serial_number.trim(),
        alternator_serial_number: formData.alternator_serial_number,
        alternator_kva: formData.alternator_kva,
        alternator_make: formData.alternator_make,
        customer_name: formData.customer_name,
        customer_address: formData.customer_address,
        parameters: {
          voltage: formData.parameters.voltage,
          kw: formData.parameters.kw,
          pf: formData.parameters.pf,
          amps: formData.parameters.amps,
          water_temp: formData.parameters.water_temp,
          lube_oil_temp: formData.parameters.lube_oil_temp,
          lube_oil_pressure: formData.parameters.lube_oil_pressure
        },
        description: formData.description,
        parts_replaced: formData.parts_replaced,
        recommendation: formData.recommendation,
        employee_serial_number: formData.employee_serial_number,
        date_of_fill: formData.date_of_fill || new Date()
      };

      console.log('Update data being sent:', updateData);

      const response = await fetch(`/api/engines/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update engine');
      }

      const updatedEngine = await response.json();
      console.log('Updated engine data:', updatedEngine);

      // Update the local state
      setEngine(updatedEngine);

      // Wait for a moment to ensure the update is processed
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refresh the page data
      router.refresh();
      
      // Navigate back to the details page
      router.push(`/details/${params.id}`);
    } catch (error: any) {
      console.error('Error updating engine:', error);
      alert(error.message || 'An error occurred while updating the engine');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F8]">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse text-[#8B7355] flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-[#8B7355] border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="text-lg font-medium">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!engine) {
    return (
      <div className="min-h-screen bg-[#FAF9F8]">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-[#8B7355]">
            Engine not found
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex justify-between items-center mb-8">
            <Link
              href={`/details/${params.id}`}
              className="inline-flex items-center text-[#8B7355] hover:text-[#6B5A45] transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Details
            </Link>
          </div>

          <EngineForm initialData={engine} onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
} 