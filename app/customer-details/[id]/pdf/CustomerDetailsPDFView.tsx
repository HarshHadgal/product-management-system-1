'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

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
  additionalInfo?: {
   complaints: string;
   res: string;
   observation: string;
   description: string;
   parts: string;
 };
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #E5E7EB',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#4B5563',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
    border: '1 solid #E5E7EB',
    borderRadius: 4,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#111827',
    borderBottom: '1 solid #E5E7EB',
    paddingBottom: 5,
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: '#111827',
  },
  divider: {
    borderBottom: '1 solid #E5E7EB',
    marginVertical: 15,
  },
  gridItemFull: {
   width: '100%',
   paddingHorizontal: 10,
   marginBottom: 10,
 },
});

const CustomerDetailsPDF = ({ data }: { data: CustomerDetails }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Details</Text>
        <Text style={styles.subtitle}>Complete Information Report</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tractor Information</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Serial No</Text>
            <Text style={styles.value}>{data.tractorInfo.serialNo}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Chassis No</Text>
            <Text style={styles.value}>{data.tractorInfo.chasisNo}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Engine Number</Text>
            <Text style={styles.value}>{data.tractorInfo.engineNumber}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Variant</Text>
            <Text style={styles.value}>{data.tractorInfo.variant}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Model</Text>
            <Text style={styles.value}>{data.tractorInfo.model}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Production Date</Text>
            <Text style={styles.value}>
              {new Date(data.tractorInfo.productionDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Delivery Date</Text>
            <Text style={styles.value}>
              {new Date(data.tractorInfo.deliveryDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Delivered By</Text>
            <Text style={styles.value}>{data.tractorInfo.deliveredBy}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Installation Date</Text>
            <Text style={styles.value}>
              {new Date(data.tractorInfo.installationDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Warranty Upto</Text>
            <Text style={styles.value}>
              {new Date(data.tractorInfo.warrantyUpto).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Service Information</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Customer Name</Text>
            <Text style={styles.value}>{data.serviceInfo.customerName}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Mobile Number</Text>
            <Text style={styles.value}>{data.serviceInfo.mobileNumber}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{data.serviceInfo.email}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>State</Text>
            <Text style={styles.value}>{data.serviceInfo.state}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>District</Text>
            <Text style={styles.value}>{data.serviceInfo.district}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Tehsil</Text>
            <Text style={styles.value}>{data.serviceInfo.tehsil}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Village</Text>
            <Text style={styles.value}>{data.serviceInfo.village}</Text>
          </View>
        </View>
      </View>

     {data.additionalInfo && (
       <View style={styles.section}>
         <Text style={styles.sectionTitle}>Additional Information</Text>
         <View style={styles.grid}>
           <View style={styles.gridItem}>
             <Text style={styles.label}>Complaints</Text>
             <Text style={styles.value}>{data.additionalInfo.complaints}</Text>
           </View>
           <View style={styles.gridItem}>
             <Text style={styles.label}>Res</Text>
             <Text style={styles.value}>{data.additionalInfo.res}</Text>
           </View>
           <View style={styles.gridItem}>
             <Text style={styles.label}>Observation</Text>
             <Text style={styles.value}>{data.additionalInfo.observation}</Text>
           </View>
           <View style={styles.gridItem}>
             <Text style={styles.label}>Description</Text>
             <Text style={styles.value}>{data.additionalInfo.description}</Text>
           </View>
           <View style={styles.gridItemFull}>
             <Text style={styles.label}>Parts</Text>
             <Text style={styles.value}>{data.additionalInfo.parts}</Text>
           </View>
         </View>
       </View>
     )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dates</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Start Date</Text>
            <Text style={styles.value}>
              {new Date(data.startDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>End Date</Text>
            <Text style={styles.value}>
              {new Date(data.endDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Created At</Text>
            <Text style={styles.value}>
              {new Date(data.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default function CustomerDetailsPDFView({ id }: { id: string }) {
  const router = useRouter();
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        const response = await fetch(`/api/customer-details/${id}`);
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

    fetchCustomerDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !customerDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">{error || 'Customer details not found'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-wide mb-3 font-serif">
            Customer Details
          </h1>
          <p className="text-xl text-gray-600 font-serif">
            Preview and download customer information
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-end space-x-4 mb-8">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
            >
              Back
            </button>
            <PDFDownloadLink
              document={<CustomerDetailsPDF data={customerDetails} />}
              fileName={`customer-details-${customerDetails.serviceInfo.customerName}.pdf`}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200"
            >
              {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
            </PDFDownloadLink>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            {/* ... rest of your preview JSX ... */}
          </div>
        </div>
      </div>
    </div>
  );
} 