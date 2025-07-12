'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface Engine {
  _id: string;
  engine_model: string;
  engine_serial_number: string;
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
    running_hours: number;
    latest_meter_reading: number;
  };
  description: string;
  parts_replaced: string;
  recommendation: string;
  employee_serial_number: string;
  employee_serial_alias: string;
  date_of_fill: string;
}

export default function FieldServiceReport() {
  const [engines, setEngines] = useState<Engine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    engine_model: '',
    engine_serial_number: '',
    alternator_kva: '',
    alternator_make: '',
    customer_name: '',
    customer_address: '',
    parameters: {
      voltage: '',
      kw: '',
      pf: '',
      amps: '',
      water_temp: '',
      lube_oil_temp: '',
      lube_oil_pressure: '',
      running_hours: '',
      latest_meter_reading: ''
    },
    description: '',
    parts_replaced: '',
    recommendation: '',
    employee_serial_number: '',
    employee_serial_alias: '',
    date_of_fill: new Date().toISOString().split('T')[0]
  });

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
      engine.engine_model?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      engine.engine_serial_number?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      engine.customer_name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      engine.employee_serial_number?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      (engine.employee_serial_alias && engine.employee_serial_alias?.toLowerCase().includes(searchTerm?.toLowerCase()));

    const matchesDate = !selectedDate || 
      new Date(engine.date_of_fill).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesDate;
  });

  const handleParameterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/engines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          parameters: {
            ...formData.parameters,
            running_hours: Number(formData.parameters.running_hours),
            latest_meter_reading: Number(formData.parameters.latest_meter_reading)
          }
        }),
      });

      if (response.ok) {
        const newEngine = await response.json();
        setEngines([...engines, newEngine]);
        setFormData({
          engine_model: '',
          engine_serial_number: '',
          alternator_kva: '',
          alternator_make: '',
          customer_name: '',
          customer_address: '',
          parameters: {
            voltage: '',
            kw: '',
            pf: '',
            amps: '',
            water_temp: '',
            lube_oil_temp: '',
            lube_oil_pressure: '',
            running_hours: '',
            latest_meter_reading: ''
          },
          description: '',
          parts_replaced: '',
          recommendation: '',
          employee_serial_number: '',
          employee_serial_alias: '',
          date_of_fill: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E8E4E1] p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-[#8B7355]" />
              </div>
              <input
                type="text"
                placeholder="Search by engine model, serial number, customer name, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-[#E8E4E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent text-[#2D2B2A] placeholder-[#8B7355]"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-[#4A4845]">Filter Date:</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  isClearable
                  placeholderText="Select date"
                  className="px-3 py-1.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
                  customInput={
                    <input
                      className="px-3 py-1.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
                      placeholder="Select date"
                    />
                  }
                />
              </div>
              <Link
                href="/add"
                className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#8B7355] hover:bg-[#6B5A45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B4A69C] transition-all duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add New Entry
              </Link>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E8E4E1] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E8E4E1]">
              <thead className="bg-[#FAF9F8]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5A45] uppercase tracking-wider">
                    Employee Serial Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5A45] uppercase tracking-wider">
                    Employee Serial Alias
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5A45] uppercase tracking-wider">
                    Engine Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5A45] uppercase tracking-wider">
                    Engine Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5A45] uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6B5A45] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6B5A45] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E8E4E1]">
                {filteredEngines.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-[#6B5A45]">
                      No entries found
                    </td>
                  </tr>
                ) : (
                  filteredEngines.map((engine) => (
                    <tr
                      key={engine._id}
                      onClick={() => window.location.href = `/details/${engine._id}`}
                      className="hover:bg-[#FAF9F8] cursor-pointer transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2B2A]">
                        {engine.employee_serial_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2B2A]">
                        {engine.employee_serial_alias || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2B2A]">
                        {engine.engine_model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2B2A]">
                        {engine.engine_serial_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2B2A]">
                        {engine.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2B2A]">
                        {new Date(engine.date_of_fill).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <div className="flex justify-end space-x-3" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/edit/${engine._id}`}
                            className="text-[#8B7355] hover:text-[#6B5A45] transition-colors duration-200"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this entry?')) {
                                try {
                                  const response = await fetch(`/api/engines/${engine._id}`, {
                                    method: 'DELETE',
                                  });
                                  if (response.ok) {
                                    setEngines(engines.filter(e => e._id !== engine._id));
                                  }
                                } catch (error) {
                                  console.error('Error deleting engine:', error);
                                }
                              }
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 
