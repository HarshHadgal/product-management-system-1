'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface PartData {
  [key: string]: any;
}

export default function PartsDataPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [partsData, setPartsData] = useState<PartData[]>([]);
  const [filteredData, setFilteredData] = useState<PartData[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('partsData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setPartsData(parsedData);
      setFilteredData(parsedData);
      setSuccess('Data loaded successfully');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess('');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);

    if (value === '') {
      setFilteredData(partsData);
    } else {
      const filtered = partsData.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(value.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  };

  const handleSelectItem = (item: PartData) => {
    setSearchTerm(item.partName || '');
    setShowDropdown(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      setPartsData(result.data);
      setFilteredData(result.data);
      
      // Save data to localStorage
      localStorage.setItem('partsData', JSON.stringify(result.data));
      
      setSuccess('File uploaded successfully!');
      
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all parts data?')) {
      localStorage.removeItem('partsData');
      setPartsData([]);
      setFilteredData([]);
      setSearchTerm('');
      setSuccess('Data cleared successfully');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2B2A] tracking-wide mb-3 font-serif">
            Parts Data
          </h1>
          <p className="text-xl text-gray-600 font-serif">
            Search and manage parts information
          </p>
        </div>

        {/* File Upload Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#009688] file:text-white
                  hover:file:bg-[#00796B]"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`px-6 py-2.5 rounded-lg text-white font-medium
                  ${!file || uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#009688] hover:bg-[#00796B]'
                  } transition-colors duration-200`}
              >
                {uploading ? 'Uploading...' : 'Upload File'}
              </button>
              {partsData.length > 0 && (
                <button
                  onClick={handleClearData}
                  className="px-6 py-2.5 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                  Clear Data
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 text-red-600 text-sm">{error}</div>
          )}

          {success && (
            <div className="mt-4 text-green-600 text-sm">{success}</div>
          )}
        </div>

        {/* Search Section */}
        {partsData.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-[#2D2B2A] mb-4">Search Parts</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by part name, number, or any other field..."
                  value={searchTerm}
                  onChange={handleSearch}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688] focus:border-transparent"
                />
                
                {showDropdown && filteredData.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredData.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectItem(item)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {item.partName || item.PartName || 'N/A'} - {item.partNumber || item.PartNumber || 'N/A'}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            {searchTerm && filteredData.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-[#2D2B2A] mb-4">Search Results</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(filteredData[0]).map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 