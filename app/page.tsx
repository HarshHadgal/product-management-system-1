'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
  date_of_fill: string;
}

export default function Home() {
  const [engines, setEngines] = useState<Engine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchEngines = async () => {
      try {
        const response = await fetch('/api/engines');
        if (!response.ok) {
          throw new Error('Failed to fetch engines');
        }
        const data = await response.json();
        setEngines(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching engines:', error);
        setLoading(false);
      }
    };

    fetchEngines();
  }, []);

  const filteredEngines = engines.filter(engine => {
    const matchesSearch = searchTerm === '' || 
      engine.engine_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.alternator_serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engine.employee_serial_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDate = !selectedDate || 
      new Date(engine.date_of_fill).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesDate;
  });

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

  return (
    <div className="min-h-screen bg-[#FAF9F8] flex flex-col items-center justify-center">
      {/* Company Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-[#2D2B2A] tracking-wide mb-3 font-serif">
          ARSONS TECH SOLUTIONS
        </h1>
        <h2 className="text-xl md:text-2xl text-[#8B7355] tracking-widest font-medium border-t border-b border-[#E8E4E1] py-3 inline-block px-8">
          SERVICE MANAGEMENT SYSTEM
        </h2>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href="/field-service-report"
          className="px-8 py-4 bg-[#8B7355] text-white rounded-lg hover:bg-[#6B5A45] transition-colors duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform flex items-center justify-center min-w-[250px]"
        >
          Field Service Report
        </Link>
        <Link
          href="/customer-details"
          className="px-8 py-4 bg-[#009688] text-white rounded-lg hover:bg-[#00796B] transition-colors duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform flex items-center justify-center min-w-[250px]"
        >
          Customer Details
        </Link>
        <Link
          href="/parts-data"
          className="px-8 py-4 bg-[#009688] text-white rounded-lg hover:bg-[#00796B] transition-colors duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform flex items-center justify-center min-w-[250px]"
        >
          Parts Data
        </Link>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-[#4A4845] text-sm">
        <p>© 2024 Arsons Tech Solutions. All rights reserved.</p>
      </div>
    </div>
  );
}
