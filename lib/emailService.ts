import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendServiceDueNotification(
  customerName: string,
  customerEmail: string,
  serviceDueDate: Date,
  vehicleDetails: {
    serialNo: string;
    model: string;
  }
) {
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2D2B2A;">Service Due Reminder</h2>
      <p>Dear ${customerName},</p>
      <p>This is a reminder that your vehicle is due for service in 7 days.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
        <h3 style="color: #8B7355; margin-top: 0;">Vehicle Details:</h3>
        <p><strong>Serial Number:</strong> ${vehicleDetails.serialNo}</p>
        <p><strong>Model:</strong> ${vehicleDetails.model}</p>
        <p><strong>Service Due Date:</strong> ${serviceDueDate.toLocaleDateString()}</p>
      </div>
      
      <p>Please contact us to schedule your service appointment.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="color: #666;">Best Regards,</p>
        <p style="color: #8B7355; font-weight: bold;">Arsons Tech Solutions</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: 'Service Due Reminder - Arsons Tech Solutions',
      html: emailContent,
    });
    console.log(`Service reminder sent to ${customerEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending service reminder:', error);
    return false;
  }
} 