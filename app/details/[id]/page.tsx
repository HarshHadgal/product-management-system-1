'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import generatePDF from 'react-to-pdf';
import type { EngineFormData } from '../../components/EngineForm';

export default function EngineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [engine, setEngine] = useState<EngineFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEngine = async () => {
      try {
        const response = await fetch(`/api/engines/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch engine data');
        }
        const data = await response.json();
        setEngine(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching engine data:', error);
        setLoading(false);
      }
    };

    fetchEngine();
  }, [params.id]);

  const handleDownloadPDF = async () => {
    if (targetRef.current) {
      try {
        const options = {
          filename: `service-report-${engine?.alternator_serial_number}.pdf`,
          page: { margin: 20 }
        };
        generatePDF(() => targetRef.current, options);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      }
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
      <div ref={targetRef} className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
              href="/"
              className="inline-flex items-center text-[#8B7355] hover:text-[#6B5A45] transition-colors duration-200"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to List
            </Link>
            <div className="flex space-x-4">
              <Link
                href={`/edit/${params.id}`}
                className="inline-flex items-center px-4 py-2 border border-[#8B7355] rounded-lg text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all duration-200"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Edit Entry
              </Link>
              <button
                onClick={handleDownloadPDF}
                className="inline-flex items-center px-4 py-2 border border-[#8B7355] rounded-lg text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Print
              </button>
            </div>
          </div>

          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold text-[#8B7355] uppercase" style={{ fontFamily: 'Times New Roman, serif' }}>ENGINE DETAILS</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            {/* Engine Details - First Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Engine Model</p>
                <p className="text-lg text-[#2D2B2A]">{engine.engine_model}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Engine Serial Number</p>
                <p className="text-lg text-[#2D2B2A]">{engine.engine_serial_number}</p>
              </div>
            </div>

            {/* Alternator Details - Second Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Alternator Serial Number</p>
                <p className="text-lg text-[#2D2B2A]">{engine.alternator_serial_number}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Alternator KVA</p>
                <p className="text-lg text-[#2D2B2A]">{engine.alternator_kva}</p>
              </div>
            </div>

            {/* Additional Alternator Details - Third Column */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Alternator Make</p>
                <p className="text-lg text-[#2D2B2A]">{engine.alternator_make}</p>
              </div>
            </div>

            {/* Customer Details - New Row */}
            <div className="space-y-6">
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Customer Name</p>
                <p className="text-lg text-[#2D2B2A]">{engine.customer_name}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Customer Address</p>
                <p className="text-lg text-[#2D2B2A]">{engine.customer_address}</p>
              </div>
            </div>

            {/* Employee and Date Details - Spanning Two Columns */}
            <div className="md:col-span-2 grid grid-cols-2 gap-x-8">
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Employee Serial Name</p>
                <p className="text-lg text-[#2D2B2A]">{engine.employee_serial_number}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Employee Alias</p>
                <p className="text-lg text-[#2D2B2A]">{engine.employee_serial_alias || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Date of Fill</p>
                <p className="text-lg text-[#2D2B2A]">{new Date(engine.date_of_fill).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-3xl font-bold text-[#8B7355] uppercase text-center mb-8" style={{ fontFamily: 'Times New Roman, serif' }}>PARAMETERS FOR GENSET</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Voltage</p>
                <p className="text-lg text-[#2D2B2A]">{engine.parameters.voltage}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">KW</p>
                <p className="text-lg text-[#2D2B2A]">{engine.parameters.kw}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Power Factor</p>
                <p className="text-lg text-[#2D2B2A]">{engine.parameters.pf}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Amps</p>
                <p className="text-lg text-[#2D2B2A]">{engine.parameters.amps}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Water Temperature</p>
                <p className="text-lg text-[#2D2B2A]">{engine.parameters.water_temp}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Lube Oil Temperature</p>
                <p className="text-lg text-[#2D2B2A]">{engine.parameters.lube_oil_temp}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Lube Oil Pressure</p>
                <p className="text-lg text-[#2D2B2A]">{engine.parameters.lube_oil_pressure}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Running Hours</p>
                <p className="text-lg text-[#2D2B2A]">{engine.parameters.running_hours}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Latest Meter Reading</p>
                <p className="text-lg text-[#2D2B2A]">{engine.parameters.latest_meter_reading}</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-[#8B7355] uppercase" style={{ fontFamily: 'Times New Roman, serif' }}>ADDITIONAL INFORMATION</h3>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Description</p>
                <p className="text-lg text-[#2D2B2A]">{engine.description}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Parts Replaced</p>
                <p className="text-lg text-[#2D2B2A]">{engine.parts_replaced || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Complaints</p>
                <p className="text-lg text-[#2D2B2A]">{engine.complaints || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-normal text-black uppercase tracking-wider mb-2">Recommendation</p>
                <p className="text-lg text-[#2D2B2A]">{engine.recommendation || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 