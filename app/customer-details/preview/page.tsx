'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { generatePDF } from 'react-to-pdf';

interface CustomerDetails {
  startDate: Date;
  endDate: Date;
  tractorInfo: {
    serialNo: string;
    chasisNo: string;
    engineNumber: string;
    variant: string;
    model: string;
    productionDate: Date;
    deliveryDate: Date;
    deliveredBy: string;
    installationDate: Date;
    warrantyUpto: Date;
  };
  serviceInfo: {
    customerName: string;
    mobileNumber: string;
    state: string;
    district: string;
    tehsil: string;
    village: string;
  };
}

export default function PreviewCustomerDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<CustomerDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        const processedData = {
          ...parsedData,
          startDate: new Date(parsedData.startDate),
          endDate: new Date(parsedData.endDate),
          tractorInfo: {
            ...parsedData.tractorInfo,
            productionDate: new Date(parsedData.tractorInfo.productionDate),
            deliveryDate: new Date(parsedData.tractorInfo.deliveryDate),
            installationDate: new Date(parsedData.tractorInfo.installationDate),
            warrantyUpto: new Date(parsedData.tractorInfo.warrantyUpto),
          },
        };
        setFormData(processedData);
      } catch (error) {
        console.error('Error parsing form data:', error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDownloadPDF = async () => {
    if (targetRef.current) {
      try {
        await generatePDF(() => targetRef.current, {
          filename: `customer-details-${formData?.tractorInfo.serialNo}.pdf`,
          page: { margin: 20 }
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      setIsLoading(true); // Show loading state while submitting
      const response = await fetch('/api/customer-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate.toISOString(),
          tractorInfo: {
            ...formData.tractorInfo,
            productionDate: formData.tractorInfo.productionDate.toISOString(),
            deliveryDate: formData.tractorInfo.deliveryDate.toISOString(),
            installationDate: formData.tractorInfo.installationDate.toISOString(),
            warrantyUpto: formData.tractorInfo.warrantyUpto.toISOString(),
          },
          serviceInfo: formData.serviceInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      const result = await response.json();
      
      // Show success message
      alert('Customer Details submitted successfully!');
      
      // Navigate to the list view
      router.push('/customer-details/list');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B7355]"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#2D2B2A] mb-4">No Data Available</h2>
          <Link
            href="/customer-details"
            className="text-[#8B7355] hover:text-[#6B5A45] underline"
          >
            Go back to form
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F8] py-8">
      <div ref={targetRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2B2A] tracking-wide mb-3 font-serif">
            Vehicle History
          </h1>
        </div>

        {/* Date Range */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div>
                <span className="text-sm text-[#4A4845]">Start Date</span>
                <div className="text-[#2D2B2A] font-medium">{formatDate(formData.startDate)}</div>
              </div>
              <div>
                <span className="text-sm text-[#4A4845]">End Date</span>
                <div className="text-[#2D2B2A] font-medium">{formatDate(formData.endDate)}</div>
              </div>
            </div>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md">GO</button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tractor Information */}
          <div className="bg-[#009688] text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold mb-2">Tractor Information</h2>
            <div className="bg-white text-[#2D2B2A] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-[#4A4845]">Serial No</div>
                  <div className="font-medium">{formData.tractorInfo.serialNo}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Production Date</div>
                  <div className="font-medium">{formatDate(formData.tractorInfo.productionDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Chassis No</div>
                  <div className="font-medium">{formData.tractorInfo.chasisNo}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Delivery Date</div>
                  <div className="font-medium">{formatDate(formData.tractorInfo.deliveryDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Engine No</div>
                  <div className="font-medium">{formData.tractorInfo.engineNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Delivered By</div>
                  <div className="font-medium">{formData.tractorInfo.deliveredBy}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Variant</div>
                  <div className="font-medium">{formData.tractorInfo.variant}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Installation Date</div>
                  <div className="font-medium">{formatDate(formData.tractorInfo.installationDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Model</div>
                  <div className="font-medium">{formData.tractorInfo.model}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Warranty Upto</div>
                  <div className="font-medium">{formatDate(formData.tractorInfo.warrantyUpto)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Last Serviced By */}
          <div className="bg-[#009688] text-white p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold mb-2">Last Serviced By</h2>
            <div className="bg-white text-[#2D2B2A] rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-[#4A4845]">Customer</div>
                  <div className="font-medium">{formData.serviceInfo.customerName}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Mobile</div>
                  <div className="font-medium">{formData.serviceInfo.mobileNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">State</div>
                  <div className="font-medium">{formData.serviceInfo.state}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">District</div>
                  <div className="font-medium">{formData.serviceInfo.district}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Tehsil</div>
                  <div className="font-medium">{formData.serviceInfo.tehsil}</div>
                </div>
                <div>
                  <div className="text-sm text-[#4A4845]">Village</div>
                  <div className="font-medium">{formData.serviceInfo.village}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <div className="flex space-x-4">
            <button
              onClick={() => router.push('/customer-details/list')}
              className="px-6 py-2 bg-gray-100 text-[#4A4845] rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Service History
            </button>
            <button
              onClick={() => router.push('/customer-details/list')}
              className="px-6 py-2 bg-gray-100 text-[#4A4845] rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Parts Details
            </button>
            <button
              onClick={() => router.push('/customer-details/list')}
              className="px-6 py-2 bg-gray-100 text-[#4A4845] rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Job Level Defect
            </button>
            <button
              onClick={() => router.push('/customer-details/list')}
              className="px-6 py-2 bg-gray-100 text-[#4A4845] rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Free Service/Paid Warranty History
            </button>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => router.back()}
              className="px-6 py-2 border border-[#8B7355] text-[#8B7355] rounded-lg hover:bg-[#8B7355] hover:text-white transition-colors duration-200"
            >
              Back to Edit
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
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6B5A45] transition-colors duration-200"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 