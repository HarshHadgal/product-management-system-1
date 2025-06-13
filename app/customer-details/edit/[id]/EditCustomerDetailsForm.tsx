'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface CustomerDetails {
  startDate: Date | null;
  endDate: Date | null;
  tractorInfo: {
    serialNo: string;
    chasisNo: string;
    engineNumber: string;
    variant: string;
    model: string;
    productionDate: Date | null;
    deliveryDate: Date | null;
    deliveredBy: string;
    installationDate: Date | null;
    warrantyUpto: Date | null;
  };
  serviceInfo: {
    customerName: string;
    mobileNumber: string;
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
}

interface FormErrors {
  startDate?: string;
  endDate?: string;
  tractorInfo?: {
    serialNo?: string;
    chasisNo?: string;
    engineNumber?: string;
    variant?: string;
    model?: string;
    productionDate?: string;
    deliveryDate?: string;
    deliveredBy?: string;
    installationDate?: string;
    warrantyUpto?: string;
  };
  serviceInfo?: {
    customerName?: string;
    mobileNumber?: string;
    state?: string;
    district?: string;
    tehsil?: string;
    village?: string;
  };
  additionalInfo?: {
   complaints?: string;
   res?: string;
   observation?: string;
   description?: string;
   parts?: string;
 };
}

export default function EditCustomerDetailsForm({ id }: { id: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState<CustomerDetails>({
    startDate: null,
    endDate: null,
    tractorInfo: {
      serialNo: '',
      chasisNo: '',
      engineNumber: '',
      variant: '',
      model: '',
      productionDate: null,
      deliveryDate: null,
      deliveredBy: '',
      installationDate: null,
      warrantyUpto: null,
    },
    serviceInfo: {
      customerName: '',
      mobileNumber: '',
      state: '',
      district: '',
      tehsil: '',
      village: '',
    },
    additionalInfo: {
     complaints: '',
     res: '',
     observation: '',
     description: '',
     parts: '',
   },
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(`/api/customer-details/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customer details');
      }
      const data = await response.json();
      
      // Convert date strings to Date objects
      const processedData = {
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        tractorInfo: {
          ...data.tractorInfo,
          productionDate: new Date(data.tractorInfo.productionDate),
          deliveryDate: new Date(data.tractorInfo.deliveryDate),
          installationDate: new Date(data.tractorInfo.installationDate),
          warrantyUpto: new Date(data.tractorInfo.warrantyUpto),
        },
        serviceInfo: data.serviceInfo,
        additionalInfo: data.additionalInfo || {
         complaints: '',
         res: '',
         observation: '',
         description: '',
         parts: '',
       },
      };
      
      setFormData(processedData);
    } catch (error) {
      console.error('Error fetching customer details:', error);
      setSubmitError('Failed to load customer details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(`/api/customer-details/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tractorInfo: {
            ...formData.tractorInfo,
            productionDate: formData.tractorInfo.productionDate?.toISOString(),
            deliveryDate: formData.tractorInfo.deliveryDate?.toISOString(),
            installationDate: formData.tractorInfo.installationDate?.toISOString(),
            warrantyUpto: formData.tractorInfo.warrantyUpto?.toISOString(),
          },
          startDate: formData.startDate?.toISOString(),
          endDate: formData.endDate?.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update customer details');
      }

      router.push(`/customer-details/${id}`);
    } catch (error) {
      console.error('Error updating customer details:', error);
      setSubmitError('Failed to update customer details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof CustomerDetails] as Record<string, any>),
        [field]: value
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B7355]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Edit Customer Details</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-lg shadow-sm p-6">
          {/* Dates Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                dateFormat="MM/dd/yyyy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                dateFormat="MM/dd/yyyy"
              />
            </div>
          </div>

          {/* Tractor Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tractor Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial No
                </label>
                <input
                  type="text"
                  value={formData.tractorInfo.serialNo}
                  onChange={(e) => handleInputChange('tractorInfo', 'serialNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chassis No
                </label>
                <input
                  type="text"
                  value={formData.tractorInfo.chasisNo}
                  onChange={(e) => handleInputChange('tractorInfo', 'chasisNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Engine Number
                </label>
                <input
                  type="text"
                  value={formData.tractorInfo.engineNumber}
                  onChange={(e) => handleInputChange('tractorInfo', 'engineNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variant
                </label>
                <input
                  type="text"
                  value={formData.tractorInfo.variant}
                  onChange={(e) => handleInputChange('tractorInfo', 'variant', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.tractorInfo.model}
                  onChange={(e) => handleInputChange('tractorInfo', 'model', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Production Date
                </label>
                <DatePicker
                  selected={formData.tractorInfo.productionDate}
                  onChange={(date) => handleInputChange('tractorInfo', 'productionDate', date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  dateFormat="MM/dd/yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Date
                </label>
                <DatePicker
                  selected={formData.tractorInfo.deliveryDate}
                  onChange={(date) => handleInputChange('tractorInfo', 'deliveryDate', date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  dateFormat="MM/dd/yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivered By
                </label>
                <input
                  type="text"
                  value={formData.tractorInfo.deliveredBy}
                  onChange={(e) => handleInputChange('tractorInfo', 'deliveredBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Installation Date
                </label>
                <DatePicker
                  selected={formData.tractorInfo.installationDate}
                  onChange={(date) => handleInputChange('tractorInfo', 'installationDate', date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  dateFormat="MM/dd/yyyy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Upto
                </label>
                <DatePicker
                  selected={formData.tractorInfo.warrantyUpto}
                  onChange={(date) => handleInputChange('tractorInfo', 'warrantyUpto', date)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                  dateFormat="MM/dd/yyyy"
                />
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.serviceInfo.customerName}
                  onChange={(e) => handleInputChange('serviceInfo', 'customerName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="text"
                  value={formData.serviceInfo.mobileNumber}
                  onChange={(e) => handleInputChange('serviceInfo', 'mobileNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.serviceInfo.state}
                  onChange={(e) => handleInputChange('serviceInfo', 'state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  value={formData.serviceInfo.district}
                  onChange={(e) => handleInputChange('serviceInfo', 'district', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tehsil
                </label>
                <input
                  type="text"
                  value={formData.serviceInfo.tehsil}
                  onChange={(e) => handleInputChange('serviceInfo', 'tehsil', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village
                </label>
                <input
                  type="text"
                  value={formData.serviceInfo.village}
                  onChange={(e) => handleInputChange('serviceInfo', 'village', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

         {/* Additional Information */}
         <div>
           <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Complaints
               </label>
               <input
                 type="text"
                 value={formData.additionalInfo?.complaints || ''}
                 onChange={(e) => handleInputChange('additionalInfo', 'complaints', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Res
               </label>
               <input
                 type="text"
                 value={formData.additionalInfo?.res || ''}
                 onChange={(e) => handleInputChange('additionalInfo', 'res', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Observation
               </label>
               <input
                 type="text"
                 value={formData.additionalInfo?.observation || ''}
                 onChange={(e) => handleInputChange('additionalInfo', 'observation', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Description
               </label>
               <input
                 type="text"
                 value={formData.additionalInfo?.description || ''}
                 onChange={(e) => handleInputChange('additionalInfo', 'description', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Parts
               </label>
               <input
                 type="text"
                 value={formData.additionalInfo?.parts || ''}
                 onChange={(e) => handleInputChange('additionalInfo', 'parts', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
               />
             </div>
           </div>
         </div>
          
          {submitError && (
            <div className="text-red-600 mt-2">{submitError}</div>
          )}
          
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 