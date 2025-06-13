'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CustomerDetails {
  _id: string;
  startDate: string;
  endDate: string;
  tractorInfo: {
    serialNo: string;
    chasisNo: string;
    engineNumber: string;
    variant: string;
    model: string;
    productionDate: string;
    deliveryDate: string;
    deliveredBy: string;
    installationDate: string;
    warrantyUpto: string;
  };
  serviceInfo: {
    customerName: string;
    mobileNumber: string;
    email: string;
    state: string;
    district: string;
    tehsil: string;
    village: string;
  };
  createdAt: string;
}

export default function CustomerDetailsPage() {
  const router = useRouter();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch('/api/customer-details');
      if (!response.ok) {
        throw new Error('Failed to fetch customer details');
      }
      const data = await response.json();
      setCustomerDetails(data);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      setError('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const response = await fetch(`/api/customer-details/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete customer details');
      }

      // Refresh the list
      fetchCustomerDetails();
      alert('Entry deleted successfully');
    } catch (error) {
      console.error('Error deleting customer details:', error);
      alert('Failed to delete entry');
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/customer-details/edit/${id}`);
  };

  const handlePrint = async (id: string) => {
    router.push(`/customer-details/${id}/pdf`);
  };

  const handleRowClick = (id: string) => {
    router.push(`/customer-details/${id}`);
  };

  const filteredCustomerDetails = customerDetails.filter((customer) => {
    const searchMatch =
      customer.serviceInfo.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.tractorInfo.serialNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.tractorInfo.engineNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const dateMatch = !filterDate || new Date(customer.createdAt).toDateString() === filterDate.toDateString();

    return searchMatch && dateMatch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2B2A] tracking-wide mb-3 font-serif">
            Customer Details
          </h1>
          <p className="text-xl text-gray-600 font-serif">
            View and manage all customer information
          </p>
        </div>

        <div className="flex justify-end mb-8">
          <Link
            href="/customer-details/new"
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
          >
            Add New Entry
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by customer name, serial no, or engine no..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div>
              <DatePicker
                selected={filterDate}
                onChange={setFilterDate}
                placeholderText="Date"
                className="rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engine No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installation Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomerDetails.map((customer) => (
                  <tr 
                    key={customer._id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(customer._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.serviceInfo.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.tractorInfo.serialNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.tractorInfo.engineNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.tractorInfo.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(customer.tractorInfo.installationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEdit(customer._id)}
                          className="text-teal-600 hover:text-teal-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handlePrint(customer._id)}
                          className="text-teal-600 hover:text-teal-800"
                        >
                          Print
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 