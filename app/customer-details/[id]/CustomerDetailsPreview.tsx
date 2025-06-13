'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as htmlToImage from 'html-to-image';

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
  additionalInfo?: {
   complaints: string;
   res: string;
   observation: string;
   description: string;
   parts: string;
 };
  createdAt: string;
}

export default function CustomerDetailsPreview({ id }: { id: string }) {
  const router = useRouter();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const printContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await fetch(`/api/customer-details/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch customer details');
        }
        const data = await response.json();
        setCustomerDetails(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customer details:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  const handlePrint = async () => {
    if (printContentRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(printContentRef.current, {
          quality: 1.0,
          backgroundColor: '#ffffff',
        });

        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Customer Details - Print</title>
                <style>
                  body { margin: 0; padding: 20px; }
                  img { width: 100%; height: auto; }
                </style>
              </head>
              <body>
                <img src="${dataUrl}" alt="Customer Details" />
                <script>
                  window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                      window.close();
                    };
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      } catch (error) {
        console.error('Error generating print preview:', error);
        alert('Failed to generate print preview. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!customerDetails) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
        <div className="text-xl text-gray-600">Customer details not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Customer Details</h1>
            <p className="mt-2 text-gray-600">View complete customer information</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href={`/customer-details/edit/${id}`}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
            >
              <span>Edit</span>
            </Link>
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 flex items-center space-x-2 shadow-sm"
            >
              <span>Print</span>
            </button>
          </div>
        </div>

        <div ref={contentRef} className="bg-white rounded-xl shadow-lg p-8 space-y-8 border border-gray-100">
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="bg-teal-600 w-1 h-6 mr-3 rounded"></span>
                Dates
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-gray-500">Start Date</span>
                  <p className="mt-1 text-lg font-medium">{new Date(customerDetails.startDate).toLocaleDateString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-gray-500">End Date</span>
                  <p className="mt-1 text-lg font-medium">{new Date(customerDetails.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="bg-teal-600 w-1 h-6 mr-3 rounded"></span>
                Tractor Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(customerDetails.tractorInfo).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-gray-500">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </span>
                    <p className="mt-1 text-lg font-medium">
                      {key.toLowerCase().includes('date')
                        ? new Date(value).toLocaleDateString()
                        : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="bg-teal-600 w-1 h-6 mr-3 rounded"></span>
                Service Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(customerDetails.serviceInfo).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                    <span className="text-sm font-medium text-gray-500">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </span>
                    <p className="mt-1 text-lg font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>

           {customerDetails.additionalInfo && (
             <div className="bg-gray-50 rounded-lg p-6">
               <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                 <span className="bg-teal-600 w-1 h-6 mr-3 rounded"></span>
                 Additional Information
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {Object.entries(customerDetails.additionalInfo).map(([key, value]) => (
                   <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
                     <span className="text-sm font-medium text-gray-500">
                       {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                     </span>
                     <p className="mt-1 text-lg font-medium">{value}</p>
                   </div>
                 ))}
               </div>
             </div>
           )}
          </div>
        </div>

        <div ref={printContentRef} className="hidden">
          <div className="bg-white p-8 space-y-8">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">Customer Details</h1>
            
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-teal-600">
                Dates
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">Start Date</span>
                  <p className="mt-1 text-lg">{new Date(customerDetails.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">End Date</span>
                  <p className="mt-1 text-lg">{new Date(customerDetails.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-teal-600">
                Tractor Information
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {Object.entries(customerDetails.tractorInfo).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium text-gray-500">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </span>
                    <p className="mt-1 text-lg">
                      {key.toLowerCase().includes('date')
                        ? new Date(value).toLocaleDateString()
                        : value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-teal-600">
                Service Information
              </h2>
              <div className="grid grid-cols-3 gap-6">
                {Object.entries(customerDetails.serviceInfo).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-sm font-medium text-gray-500">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </span>
                    <p className="mt-1 text-lg">{value}</p>
                  </div>
                ))}
              </div>
            </div>

           {customerDetails.additionalInfo && (
             <div className="mb-8">
               <h2 className="text-2xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-teal-600">
                 Additional Information
               </h2>
               <div className="grid grid-cols-3 gap-6">
                 {Object.entries(customerDetails.additionalInfo).map(([key, value]) => (
                   <div key={key}>
                     <span className="text-sm font-medium text-gray-500">
                       {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                     </span>
                     <p className="mt-1 text-lg">{value}</p>
                   </div>
                 ))}
               </div>
             </div>
           )}
          </div>
        </div>
      </div>
    </div>
  );
} 