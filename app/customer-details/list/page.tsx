'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface CustomerDetails {
  _id: string;
  startDate: string;
  endDate: string;
  tractorInfo: {
    engineNumber: string;
    model: string;
    deliveryDate: string;
    warrantyUpto: string;
  };
  serviceInfo: {
    customerName: string;
    mobileNumber: string;
    state: string;
    district: string;
  };
}

export default function CustomerDetailsList() {
  const [customers, setCustomers] = useState<CustomerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customer-details');
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        setCustomers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchTerm === '' || 
      customer.tractorInfo.engineNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.tractorInfo.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.serviceInfo.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.serviceInfo.mobileNumber.includes(searchTerm);

    const matchesDate = !selectedDate || 
      new Date(customer.tractorInfo.deliveryDate).toDateString() === selectedDate.toDateString();

    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F8]">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse text-[#009688] flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-[#009688] border-t-transparent rounded-full animate-spin mb-4"></div>
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
          <h2 className="text-xl md:text-2xl text-[#009688] tracking-widest font-medium border-t border-b border-[#E8E4E1] py-3 inline-block px-8">
            CUSTOMER DETAILS
          </h2>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg border border-[#E8E4E1] p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-[#009688]" />
              </div>
              <input
                type="text"
                placeholder="Search by engine number, model, customer name, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-[#E8E4E1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent text-[#2D2B2A] placeholder-[#009688]"
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
                  className="px-3 py-1.5 rounded-lg border border-[#E8E4E1] focus:border-[#009688] focus:ring-1 focus:ring-[#009688] bg-white text-black placeholder-[#B4A69C]"
                />
              </div>
              <Link
                href="/customer-details"
                className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#009688] hover:bg-[#00796B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B4A69C] transition-all duration-200"
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#009688] uppercase tracking-wider">
                    Engine Serial No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#009688] uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#009688] uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#009688] uppercase tracking-wider">
                    Delivery Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#009688] uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#009688] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E8E4E1]">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-[#009688]">
                      No entries found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer._id}
                      onClick={() => window.location.href = `/customer-details/${customer._id}`}
                      className="hover:bg-[#FAF9F8] cursor-pointer transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2B2A]">
                        {customer.tractorInfo.engineNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2B2A]">
                        {customer.tractorInfo.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2B2A]">
                        {customer.serviceInfo.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2B2A]">
                        {new Date(customer.tractorInfo.deliveryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2D2B2A]">
                        {`${customer.serviceInfo.district}, ${customer.serviceInfo.state}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={`/customer-details/edit/${customer._id}`}
                            className="text-[#009688] hover:text-[#00796B] transition-colors duration-200"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to delete this entry?')) {
                                try {
                                  const response = await fetch(`/api/customer-details/${customer._id}`, {
                                    method: 'DELETE',
                                  });
                                  if (response.ok) {
                                    setCustomers(customers.filter(c => c._id !== customer._id));
                                  }
                                } catch (error) {
                                  console.error('Error deleting customer:', error);
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