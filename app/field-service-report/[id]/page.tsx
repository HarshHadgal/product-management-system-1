'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import generatePDF from 'react-to-pdf';

interface Engine {
  _id: string;
  engine_model: string;
  alternator_serial_number: string;
  alternator_kva: number;
  alternator_make: string;
  customer_name: string;
  customer_address: string;
  parameters: {
    voltage: number;
    kw: number;
    pf: number;
    amps: number;
    water_temp: number;
    lube_oil_temp: number;
    lube_oil_pressure: number;
  };
  description: string;
  parts_replaced: string;
  recommendation: string;
  employee_serial_number: string;
  employee_serial_alias: string;
  date_of_fill: string;
}

export default function EngineDetails() {
  const router = useRouter();
  const params = useParams();
  const [engine, setEngine] = useState<Engine | null>(null);
  const [loading, setLoading] = useState(true);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEngine = async () => {
      try {
        const response = await fetch(`/api/engines/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch engine details');
        }
        const data = await response.json();
        setEngine(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching engine:', error);
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEngine();
    }
  }, [params.id]);

  const handleDownloadPDF = async () => {
    if (targetRef.current) {
      try {
        await generatePDF(() => targetRef.current, {
          filename: `service-report-${engine?.alternator_serial_number}.pdf`,
          page: { margin: 20 }
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B7355]"></div>
      </div>
    );
  }

  if (!engine) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#2D2B2A] mb-4">Engine Not Found</h2>
          <button
            onClick={() => router.back()}
            className="text-[#8B7355] hover:text-[#6B5A45] underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F8] py-8">
      <div ref={targetRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2B2A] tracking-wide mb-3 font-serif">
            ARSONS TECH SOLUTIONS
          </h1>
          <h2 className="text-xl md:text-2xl text-[#8B7355] tracking-widest font-medium border-t border-b border-[#E8E4E1] py-3 inline-block px-8">
            FIELD SERVICE REPORT
          </h2>
        </div>

        {/* Engine Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#2D2B2A] mb-4">Engine Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#4A4845]">Engine Model</p>
                  <p className="text-[#2D2B2A] font-medium">{engine.engine_model}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4A4845]">Serial Number</p>
                  <p className="text-[#2D2B2A] font-medium">{engine.alternator_serial_number}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4A4845]">KVA Rating</p>
                  <p className="text-[#2D2B2A] font-medium">{engine.alternator_kva}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4A4845]">Alternator Make</p>
                  <p className="text-[#2D2B2A] font-medium">{engine.alternator_make}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-[#2D2B2A] mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-[#4A4845]">Customer Name</p>
                  <p className="text-[#2D2B2A] font-medium">{engine.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4A4845]">Address</p>
                  <p className="text-[#2D2B2A] font-medium">{engine.customer_address}</p>
                </div>
                <div>
                  <p className="text-sm text-[#4A4845]">Service Date</p>
                  <p className="text-[#2D2B2A] font-medium">
                    {new Date(engine.date_of_fill).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-[#2D2B2A] mb-4">Parameters</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-[#4A4845]">Voltage</p>
              <p className="text-[#2D2B2A] font-medium">{engine.parameters.voltage} V</p>
            </div>
            <div>
              <p className="text-sm text-[#4A4845]">Power</p>
              <p className="text-[#2D2B2A] font-medium">{engine.parameters.kw} kW</p>
            </div>
            <div>
              <p className="text-sm text-[#4A4845]">Power Factor</p>
              <p className="text-[#2D2B2A] font-medium">{engine.parameters.pf}</p>
            </div>
            <div>
              <p className="text-sm text-[#4A4845]">Current</p>
              <p className="text-[#2D2B2A] font-medium">{engine.parameters.amps} A</p>
            </div>
            <div>
              <p className="text-sm text-[#4A4845]">Water Temperature</p>
              <p className="text-[#2D2B2A] font-medium">{engine.parameters.water_temp}°C</p>
            </div>
            <div>
              <p className="text-sm text-[#4A4845]">Lube Oil Temperature</p>
              <p className="text-[#2D2B2A] font-medium">{engine.parameters.lube_oil_temp}°C</p>
            </div>
            <div>
              <p className="text-sm text-[#4A4845]">Lube Oil Pressure</p>
              <p className="text-[#2D2B2A] font-medium">{engine.parameters.lube_oil_pressure} bar</p>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-[#2D2B2A] mb-4">Service Details</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#4A4845]">Description</p>
              <p className="text-[#2D2B2A] whitespace-pre-wrap">{engine.description}</p>
            </div>
            <div>
              <p className="text-sm text-[#4A4845]">Parts Replaced</p>
              <p className="text-[#2D2B2A] whitespace-pre-wrap">{engine.parts_replaced}</p>
            </div>
            <div>
              <p className="text-sm text-[#4A4845]">Recommendations</p>
              <p className="text-[#2D2B2A] whitespace-pre-wrap">{engine.recommendation}</p>
            </div>
          </div>
        </div>

        {/* Employee and Date Details - Spanning Two Columns */}
        <div className="md:col-span-2 grid grid-cols-3 gap-x-8">
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Employee Serial Number</label>
            <div className="bg-white border border-[#E8E4E1] rounded-lg p-3 text-black">{engine.employee_serial_number || 'N/A'}</div>
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Employee Serial Alias</label>
            <div className="bg-white border border-[#E8E4E1] rounded-lg p-3 text-black">{engine.employee_serial_alias || 'N/A'}</div>
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Date of Fill</label>
            <div className="bg-white border border-[#E8E4E1] rounded-lg p-3 text-black">
              {engine.date_of_fill ? new Date(engine.date_of_fill).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-[#8B7355] text-[#8B7355] rounded-lg hover:bg-[#8B7355] hover:text-white transition-colors duration-200"
          >
            Back
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
} 