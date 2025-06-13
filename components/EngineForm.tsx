'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export interface EngineFormData {
  _id?: string;
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
  date_of_fill: Date;
}

interface EngineFormProps {
  initialData?: EngineFormData;
  isEditing?: boolean;
}

export default function EngineForm({ initialData, isEditing }: EngineFormProps) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<EngineFormData>({
    defaultValues: initialData || {
      parameters: {
        voltage: 0,
        kw: 0,
        pf: 0,
        amps: 0,
        water_temp: 0,
        lube_oil_temp: 0,
        lube_oil_pressure: 0,
      },
      date_of_fill: new Date(),
    },
  });

  const onSubmit = async (data: EngineFormData) => {
    try {
      const url = isEditing ? `/api/engines/${initialData?._id}` : '/api/engines';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save engine data');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error saving engine data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Engine Model</label>
          <input
            type="text"
            {...register('engine_model', { required: 'Engine model is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.engine_model && (
            <p className="mt-1 text-sm text-red-600">{errors.engine_model.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Alternator Serial Number</label>
          <input
            type="text"
            {...register('alternator_serial_number', { required: 'Serial number is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.alternator_serial_number && (
            <p className="mt-1 text-sm text-red-600">{errors.alternator_serial_number.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Alternator KVA</label>
          <input
            type="number"
            {...register('alternator_kva', { required: 'KVA is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Alternator Make</label>
          <input
            type="text"
            {...register('alternator_make', { required: 'Make is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Customer Name</label>
          <input
            type="text"
            {...register('customer_name', { required: 'Customer name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Customer Address</label>
          <input
            type="text"
            {...register('customer_address', { required: 'Address is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Voltage</label>
            <input
              type="number"
              {...register('parameters.voltage', { required: 'Voltage is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">KW</label>
            <input
              type="number"
              {...register('parameters.kw', { required: 'KW is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Power Factor</label>
            <input
              type="number"
              step="0.01"
              {...register('parameters.pf', { required: 'Power factor is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Amps</label>
            <input
              type="number"
              {...register('parameters.amps', { required: 'Amps is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Water Temperature</label>
            <input
              type="number"
              {...register('parameters.water_temp', { required: 'Water temperature is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Lube Oil Temperature</label>
            <input
              type="number"
              {...register('parameters.lube_oil_temp', { required: 'Lube oil temperature is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Lube Oil Pressure</label>
            <input
              type="number"
              {...register('parameters.lube_oil_pressure', { required: 'Lube oil pressure is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Parts Replaced</label>
          <textarea
            {...register('parts_replaced')}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Recommendation</label>
          <textarea
            {...register('recommendation')}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Employee Serial Number</label>
          <input
            type="text"
            {...register('employee_serial_number', { required: 'Employee serial number is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Date</label>
          <DatePicker
            selected={watch('date_of_fill')}
            onChange={(date: Date | null) => date && setValue('date_of_fill', date)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-[#8B7355] rounded-lg text-[#8B7355] hover:bg-[#8B7355] hover:text-white transition-all duration-200"
        >
          {isEditing ? 'Update' : 'Save'}
        </button>
      </div>
    </form>
  );
} 