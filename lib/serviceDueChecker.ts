import cron from 'node-cron';
import { sendServiceDueNotification } from './emailService';
import dbConnect from './dbConnect';
import CustomerDetails from '../models/CustomerDetails';

export async function checkServiceDueDates() {
  try {
    await dbConnect();

    // Get the date 7 days from now
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    // Find all customer details where service is due in 7 days
    const customerDetails = await CustomerDetails.find({
      'tractorInfo.warrantyUpto': {
        $gte: new Date(),
        $lte: sevenDaysFromNow
      }
    });

    // Send notifications for each customer
    for (const customer of customerDetails) {
      await sendServiceDueNotification(
        customer.serviceInfo.customerName,
        customer.serviceInfo.email,
        customer.tractorInfo.warrantyUpto,
        {
          serialNo: customer.tractorInfo.serialNo,
          model: customer.tractorInfo.model
        }
      );
    }

    console.log(`Checked service due dates. Sent ${customerDetails.length} notifications.`);
  } catch (error) {
    console.error('Error checking service due dates:', error);
  }
}

// Schedule the check to run every day at 9 AM
export function startServiceDueChecker() {
  cron.schedule('0 9 * * *', checkServiceDueDates);
  console.log('Service due checker scheduled to run daily at 9 AM');
} 