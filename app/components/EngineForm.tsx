'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export interface EngineFormData {
  _id?: string;
  engine_model: string;
  engine_serial_number: string;
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
    running_hours: number;
    latest_meter_reading: number;
  };
  description: string;
  parts_replaced: string;
  recommendation: string;
  complaints: string;
  employee_serial_number: string;
  employee_serial_alias: string;
  date_of_fill: Date;
}

interface EngineFormProps {
  initialData?: EngineFormData;
  onSubmit: (data: EngineFormData) => Promise<void>;
}

export default function EngineForm({ initialData, onSubmit }: EngineFormProps) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<EngineFormData>({
    defaultValues: {
      ...initialData,
      engine_serial_number: initialData?.engine_serial_number || '',
    }
  });
  const [engineNumberSearch, setEngineNumberSearch] = useState('');

  const handleFetchByEngineNumber = async () => {
   if (!engineNumberSearch) return;
   try {
     const response = await fetch(`/api/engines/by-serial/${engineNumberSearch}`);
     if (!response.ok) {
       throw new Error('Failed to fetch engine details');
     }
     const data = await response.json();
     if (data) {
       setValue('engine_model', data.engine_model);
       setValue('alternator_serial_number', data.alternator_serial_number);
       setValue('alternator_kva', data.alternator_kva);
       setValue('alternator_make', data.alternator_make);
       setValue('customer_name', data.customer_name);
       setValue('customer_address', data.customer_address);
       setValue('parameters.voltage', data.parameters.voltage);
       setValue('parameters.kw', data.parameters.kw);
       setValue('parameters.pf', data.parameters.pf);
       setValue('parameters.amps', data.parameters.amps);
       setValue('parameters.water_temp', data.parameters.water_temp);
       setValue('parameters.lube_oil_temp', data.parameters.lube_oil_temp);
       setValue('parameters.lube_oil_pressure', data.parameters.lube_oil_pressure);
       setValue('parameters.running_hours', data.parameters.running_hours);
       setValue('parameters.latest_meter_reading', data.parameters.latest_meter_reading);
      setValue('description', data.description);
      setValue('parts_replaced', data.parts_replaced);
      setValue('complaints', data.complaints);
      setValue('recommendation', data.recommendation);
     }
   } catch (error) {
     console.error('Error fetching engine details by serial number:', error);
     alert('Failed to fetch engine details for the given serial number.');
   }
 };

  // Watch the engine_serial_number field for changes
  const engineSerialNumber = watch('engine_serial_number');

  const submitForm = async (data: EngineFormData) => {
    try {
      // Validate engine_serial_number
      if (!data.engine_serial_number?.trim()) {
        alert('Engine serial number is required');
        return;
      }

      // Log the form data before submission
      console.log('Form data in EngineForm:', {
        ...data,
        engine_serial_number: data.engine_serial_number.trim()
      });

      await onSubmit({
        ...data,
        engine_serial_number: data.engine_serial_number.trim()
      });
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-8 max-w-4xl mx-auto p-8 border border-[#E8E4E1] rounded-xl shadow-lg bg-white">
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
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-[#8B7355] uppercase" style={{ fontFamily: 'Times New Roman, serif' }}>ENGINE DETAILS</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
        {/* Engine Details - First Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Engine Model</label>
            <input
              type="text"
              {...register('engine_model', { required: 'Engine model is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter engine model"
            />
            {errors.engine_model && (
              <p className="mt-1 text-sm text-red-600">{errors.engine_model.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">
              Engine Serial Number
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              {...register('engine_serial_number', {
                required: 'Engine serial number is required',
                validate: value => value.trim() !== '' || 'Engine serial number cannot be empty'
              })}
              defaultValue={initialData?.engine_serial_number || ''}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter engine serial number"
            />
            {errors.engine_serial_number && (
              <p className="mt-1 text-sm text-red-600">{errors.engine_serial_number.message}</p>
            )}
          </div>
        </div>

        {/* Alternator Details - Second Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Alternator Serial Number</label>
            <input
              type="text"
              {...register('alternator_serial_number', { required: 'Serial number is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter alternator serial number"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Alternator KVA</label>
            <input
              type="number"
              {...register('alternator_kva', { required: 'KVA is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter alternator KVA"
            />
          </div>
        </div>

        {/* Additional Alternator Details - Third Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Alternator Make</label>
            <input
              type="text"
              {...register('alternator_make', { required: 'Make is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter alternator make"
            />
          </div>
        </div>

        {/* Customer Details - New Row */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Customer Name</label>
            <input
              type="text"
              {...register('customer_name', { required: 'Customer name is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter customer name"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Customer Address</label>
            <input
              type="text"
              {...register('customer_address', { required: 'Address is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter customer address"
            />
          </div>
        </div>

        {/* Employee and Date Details - Spanning Two Columns */}
        <div className="md:col-span-2 grid grid-cols-2 gap-x-8">
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Employee Serial Name</label>
            <input
              type="text"
              {...register('employee_serial_number', { required: 'Employee serial number is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter employee serial number"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Employee Alias</label>
            <input
              type="text"
              {...register('employee_serial_alias')}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter employee serial alias"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Date of Fill</label>
            <DatePicker
              selected={watch('date_of_fill')}
              onChange={(date) => {
                const event = {
                  target: {
                    name: 'date_of_fill',
                    value: date
                  }
                };
                register('date_of_fill').onChange(event);
              }}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              isClearable
              placeholderText="Select date"
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              customInput={
                <input
                  className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
                  placeholder="Select date"
                />
              }
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <h3 className="text-3xl font-bold text-[#8B7355] uppercase text-center mb-8" style={{ fontFamily: 'Times New Roman, serif' }}>PARAMETERS FOR GENSET</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Voltage</label>
            <input
              type="number"
              {...register('parameters.voltage', { required: 'Voltage is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter voltage"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">KW</label>
            <input
              type="number"
              {...register('parameters.kw', { required: 'KW is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter KW"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Power Factor</label>
            <input
              type="number"
              step="0.01"
              {...register('parameters.pf', { required: 'Power factor is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter power factor"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Amps</label>
            <input
              type="number"
              {...register('parameters.amps', { required: 'Amps is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter amps"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Water Temperature</label>
            <input
              type="number"
              {...register('parameters.water_temp', { required: 'Water temperature is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter water temperature"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Lube Oil Temperature</label>
            <input
              type="number"
              {...register('parameters.lube_oil_temp', { required: 'Lube oil temperature is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter lube oil temperature"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Lube Oil Pressure</label>
            <input
              type="number"
              {...register('parameters.lube_oil_pressure', { required: 'Lube oil pressure is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter lube oil pressure"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Running Hours</label>
            <input
              type="number"
              {...register('parameters.running_hours', { required: 'Running hours is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter running hours"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Latest Meter Reading</label>
            <input
              type="number"
              {...register('parameters.latest_meter_reading', { required: 'Latest meter reading is required' })}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter latest meter reading"
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-[#8B7355] uppercase" style={{ fontFamily: 'Times New Roman, serif' }}>ADDITIONAL INFORMATION</h3>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C] resize-none"
              placeholder="Enter description"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Parts Replaced</label>
            <input
              type="text"
              {...register('parts_replaced')}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C]"
              placeholder="Enter parts replaced"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Complaints</label>
            <textarea
              {...register('complaints')}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C] resize-none"
              placeholder="Enter complaints"
            />
          </div>
          <div>
            <label className="block text-sm font-normal text-black uppercase tracking-wider mb-2">Recommendation</label>
            <textarea
              {...register('recommendation')}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-[#E8E4E1] focus:border-[#8B7355] focus:ring-1 focus:ring-[#8B7355] bg-white text-black placeholder-[#B4A69C] resize-none"
              placeholder="Enter recommendation"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t border-[#E8E4E1]">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-[#E8E4E1] rounded-lg shadow-sm text-sm font-medium text-[#4A4845] bg-white hover:bg-[#FAF9F8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B4A69C] transition-all duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-6 py-2.5 border border-[#8B7355] rounded-lg text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          {initialData ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
} 