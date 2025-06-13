'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    email?: string;
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

export default function NewCustomerDetails() {
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
      email: '',
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

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [engineNumberSearch, setEngineNumberSearch] = useState('');

  const handleFetchByEngineNumber = async () => {
   if (!engineNumberSearch) return;
   try {
     const response = await fetch(`/api/customer-details/by-engine/${engineNumberSearch}`);
     if (!response.ok) {
       throw new Error('Failed to fetch customer details');
     }
     const data = await response.json();
     if (data) {
       setFormData({
         ...formData,
         tractorInfo: {
           ...formData.tractorInfo,
           engineNumber: engineNumberSearch,
           serialNo: data.tractorInfo.serialNo,
           chasisNo: data.tractorInfo.chasisNo,
           variant: data.tractorInfo.variant,
           model: data.tractorInfo.model,
           productionDate: data.tractorInfo.productionDate ? new Date(data.tractorInfo.productionDate) : null,
           deliveryDate: data.tractorInfo.deliveryDate ? new Date(data.tractorInfo.deliveryDate) : null,
           deliveredBy: data.tractorInfo.deliveredBy,
           installationDate: data.tractorInfo.installationDate ? new Date(data.tractorInfo.installationDate) : null,
           warrantyUpto: data.tractorInfo.warrantyUpto ? new Date(data.tractorInfo.warrantyUpto) : null,
         },
         serviceInfo: {
           ...formData.serviceInfo,
           customerName: data.serviceInfo.customerName,
           mobileNumber: data.serviceInfo.mobileNumber,
           email: data.serviceInfo.email,
           state: data.serviceInfo.state,
           district: data.serviceInfo.district,
           tehsil: data.serviceInfo.tehsil,
           village: data.serviceInfo.village,
         },
       });
     }
   } catch (error) {
     console.error('Error fetching customer details by engine number:', error);
     setSubmitError('Failed to fetch customer details for the given engine number.');
   }
 };

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    // Date validation
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      errors.endDate = 'End date must be after start date';
    }

    // Tractor Info validation
    if (!formData.tractorInfo.serialNo) {
      errors.tractorInfo = { ...errors.tractorInfo, serialNo: 'Serial number is required' };
    }
    if (!formData.tractorInfo.chasisNo) {
      errors.tractorInfo = { ...errors.tractorInfo, chasisNo: 'Chassis number is required' };
    }
    if (!formData.tractorInfo.engineNumber) {
      errors.tractorInfo = { ...errors.tractorInfo, engineNumber: 'Engine number is required' };
    }
    if (!formData.tractorInfo.variant) {
      errors.tractorInfo = { ...errors.tractorInfo, variant: 'Variant is required' };
    }
    if (!formData.tractorInfo.model) {
      errors.tractorInfo = { ...errors.tractorInfo, model: 'Model is required' };
    }
    if (!formData.tractorInfo.productionDate) {
      errors.tractorInfo = { ...errors.tractorInfo, productionDate: 'Production date is required' };
    }
    if (!formData.tractorInfo.deliveryDate) {
      errors.tractorInfo = { ...errors.tractorInfo, deliveryDate: 'Delivery date is required' };
    }
    if (!formData.tractorInfo.deliveredBy) {
      errors.tractorInfo = { ...errors.tractorInfo, deliveredBy: 'Delivered by is required' };
    }
    if (!formData.tractorInfo.installationDate) {
      errors.tractorInfo = { ...errors.tractorInfo, installationDate: 'Installation date is required' };
    }
    if (!formData.tractorInfo.warrantyUpto) {
      errors.tractorInfo = { ...errors.tractorInfo, warrantyUpto: 'Warranty end date is required' };
    }

    // Service Info validation
    if (!formData.serviceInfo.customerName) {
      errors.serviceInfo = { ...errors.serviceInfo, customerName: 'Customer name is required' };
    }
    if (!formData.serviceInfo.email) {
      errors.serviceInfo = { ...errors.serviceInfo, email: 'Email is required' };
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.serviceInfo.email)) {
      errors.serviceInfo = { ...errors.serviceInfo, email: 'Invalid email address' };
    }
    if (!formData.serviceInfo.mobileNumber) {
      errors.serviceInfo = { ...errors.serviceInfo, mobileNumber: 'Mobile number is required' };
    } else if (!/^[0-9]{10}$/.test(formData.serviceInfo.mobileNumber)) {
      errors.serviceInfo = { ...errors.serviceInfo, mobileNumber: 'Invalid mobile number format' };
    }
    if (!formData.serviceInfo.state) {
      errors.serviceInfo = { ...errors.serviceInfo, state: 'State is required' };
    }
    if (!formData.serviceInfo.district) {
      errors.serviceInfo = { ...errors.serviceInfo, district: 'District is required' };
    }
    if (!formData.serviceInfo.tehsil) {
      errors.serviceInfo = { ...errors.serviceInfo, tehsil: 'Tehsil is required' };
    }
    if (!formData.serviceInfo.village) {
      errors.serviceInfo = { ...errors.serviceInfo, village: 'Village is required' };
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/customer-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: formData.startDate?.toISOString(),
          endDate: formData.endDate?.toISOString(),
          tractorInfo: {
            ...formData.tractorInfo,
            productionDate: formData.tractorInfo.productionDate?.toISOString(),
            deliveryDate: formData.tractorInfo.deliveryDate?.toISOString(),
            installationDate: formData.tractorInfo.installationDate?.toISOString(),
            warrantyUpto: formData.tractorInfo.warrantyUpto?.toISOString(),
          },
          serviceInfo: formData.serviceInfo,
          additionalInfo: formData.additionalInfo,
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
      router.push('/customer-details');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    section: 'tractorInfo' | 'serviceInfo' | 'additionalInfo',
    name: string,
    value: string | Date | null
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));

    // Clear error when user starts typing
    if ((formErrors[section] as Record<string, string> | undefined)?.[name]) {
      setFormErrors(prev => ({
        ...prev,
        [section]: {
          ...(prev[section] as Record<string, string> | undefined),
          [name]: undefined,
        },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2B2A] tracking-wide mb-3 font-serif">
            Add Customer Details
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
         {/* Fetch by Engine Number */}
         <div className="bg-white rounded-lg shadow-sm p-4">
           <div className="flex items-center space-x-4">
             <input
               type="text"
               placeholder="Enter Engine Serial Number to fetch data"
               value={engineNumberSearch}
               onChange={(e) => setEngineNumberSearch(e.target.value)}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
             />
             <button
               type="button"
               onClick={handleFetchByEngineNumber}
               className="px-6 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6B5A45] transition-colors duration-200"
             >
               Fetch
             </button>
           </div>
         </div>

          {/* Date Range */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-8">
                <div>
                  <span className="text-sm text-[#4A4845]">Start Date</span>
                  <DatePicker
                    selected={formData.startDate}
                    onChange={(date: Date | null) => setFormData(prev => ({ ...prev, startDate: date }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select start date"
                  />
                  {formErrors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
                  )}
                </div>
                <div>
                  <span className="text-sm text-[#4A4845]">End Date</span>
                  <DatePicker
                    selected={formData.endDate}
                    onChange={(date: Date | null) => setFormData(prev => ({ ...prev, endDate: date }))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select end date"
                  />
                  {formErrors.endDate && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tractor Information */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-[#2D2B2A] mb-4">Tractor Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Serial No</label>
                <input
                  type="text"
                  value={formData.tractorInfo.serialNo}
                  onChange={(e) => handleInputChange('tractorInfo', 'serialNo', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.tractorInfo?.serialNo && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.tractorInfo.serialNo}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Chassis No</label>
                <input
                  type="text"
                  value={formData.tractorInfo.chasisNo}
                  onChange={(e) => handleInputChange('tractorInfo', 'chasisNo', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.tractorInfo?.chasisNo && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.tractorInfo.chasisNo}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Engine No</label>
                <input
                  type="text"
                  value={formData.tractorInfo.engineNumber}
                  onChange={(e) => handleInputChange('tractorInfo', 'engineNumber', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.tractorInfo?.engineNumber && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.tractorInfo.engineNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Variant</label>
                <input
                  type="text"
                  value={formData.tractorInfo.variant}
                  onChange={(e) => handleInputChange('tractorInfo', 'variant', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.tractorInfo?.variant && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.tractorInfo.variant}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Model</label>
                <input
                  type="text"
                  value={formData.tractorInfo.model}
                  onChange={(e) => handleInputChange('tractorInfo', 'model', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.tractorInfo?.model && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.tractorInfo.model}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Production Date</label>
                <DatePicker
                  selected={formData.tractorInfo.productionDate}
                  onChange={(date: Date | null) => handleInputChange('tractorInfo', 'productionDate', date)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select production date"
                />
                {formErrors.tractorInfo?.productionDate && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.tractorInfo.productionDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Delivery Date</label>
                <DatePicker
                  selected={formData.tractorInfo.deliveryDate}
                  onChange={(date: Date | null) => handleInputChange('tractorInfo', 'deliveryDate', date)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select delivery date"
                />
                {formErrors.tractorInfo?.deliveryDate && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.tractorInfo.deliveryDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Delivered By</label>
                <input
                  type="text"
                  value={formData.tractorInfo.deliveredBy}
                  onChange={(e) => handleInputChange('tractorInfo', 'deliveredBy', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.tractorInfo?.deliveredBy && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.tractorInfo.deliveredBy}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Installation Date</label>
                <DatePicker
                  selected={formData.tractorInfo.installationDate}
                  onChange={(date: Date | null) => handleInputChange('tractorInfo', 'installationDate', date)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select installation date"
                />
                {formErrors.tractorInfo?.installationDate && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.tractorInfo.installationDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Warranty Upto</label>
                <DatePicker
                  selected={formData.tractorInfo.warrantyUpto}
                  onChange={(date: Date | null) => handleInputChange('tractorInfo', 'warrantyUpto', date)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select warranty end date"
                />
                {formErrors.tractorInfo?.warrantyUpto && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.tractorInfo.warrantyUpto}</p>
                )}
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h2 className="text-lg font-semibold text-[#2D2B2A] mb-4">Service Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Customer Name</label>
                <input
                  type="text"
                  value={formData.serviceInfo.customerName}
                  onChange={(e) => handleInputChange('serviceInfo', 'customerName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.serviceInfo?.customerName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.serviceInfo.customerName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Mobile Number</label>
                <input
                  type="text"
                  value={formData.serviceInfo.mobileNumber}
                  onChange={(e) => handleInputChange('serviceInfo', 'mobileNumber', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.serviceInfo?.mobileNumber && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.serviceInfo.mobileNumber}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Email</label>
                <input
                  type="email"
                  value={formData.serviceInfo.email}
                  onChange={(e) => handleInputChange('serviceInfo', 'email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.serviceInfo?.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.serviceInfo.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">State</label>
                <input
                  type="text"
                  value={formData.serviceInfo.state}
                  onChange={(e) => handleInputChange('serviceInfo', 'state', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.serviceInfo?.state && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.serviceInfo.state}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">District</label>
                <input
                  type="text"
                  value={formData.serviceInfo.district}
                  onChange={(e) => handleInputChange('serviceInfo', 'district', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.serviceInfo?.district && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.serviceInfo.district}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Tehsil</label>
                <input
                  type="text"
                  value={formData.serviceInfo.tehsil}
                  onChange={(e) => handleInputChange('serviceInfo', 'tehsil', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.serviceInfo?.tehsil && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.serviceInfo.tehsil}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4845]">Village</label>
                <input
                  type="text"
                  value={formData.serviceInfo.village}
                  onChange={(e) => handleInputChange('serviceInfo', 'village', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
                />
                {formErrors.serviceInfo?.village && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.serviceInfo.village}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
         <div className="bg-white rounded-lg shadow-sm p-4">
           <h2 className="text-lg font-semibold text-[#2D2B2A] mb-4">Additional Information</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-[#4A4845]">Complaints</label>
               <input
                 type="text"
                 value={formData.additionalInfo?.complaints}
                 onChange={(e) => handleInputChange('additionalInfo', 'complaints', e.target.value)}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-[#4A4845]">Res</label>
               <input
                 type="text"
                 value={formData.additionalInfo?.res}
                 onChange={(e) => handleInputChange('additionalInfo', 'res', e.target.value)}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-[#4A4845]">Observation</label>
               <input
                 type="text"
                 value={formData.additionalInfo?.observation}
                 onChange={(e) => handleInputChange('additionalInfo', 'observation', e.target.value)}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-[#4A4845]">Description</label>
               <input
                 type="text"
                 value={formData.additionalInfo?.description}
                 onChange={(e) => handleInputChange('additionalInfo', 'description', e.target.value)}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-[#4A4845]">Parts</label>
               <input
                 type="text"
                 value={formData.additionalInfo?.parts}
                 onChange={(e) => handleInputChange('additionalInfo', 'parts', e.target.value)}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#8B7355] focus:ring-[#8B7355]"
               />
             </div>
           </div>
         </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#6B5A45] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>

          {submitError && (
            <p className="text-red-600 text-sm mt-2">{submitError}</p>
          )}
        </form>
      </div>
    </div>
  );
} 