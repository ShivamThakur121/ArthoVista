const Notification = require('../models/Notification');
const User = require('../models/User');
const sendEmail = require('./email');

const sendNotification = async (recipient, title, message, type) => {
  try {
    await Notification.create({
      recipient,
      title,
      message,
      type,
      readStatus: false
    });

    if (recipient === 'All') {
      // Fetch all active staff & employee profiles
      const employees = await User.find({ status: { $ne: 'Inactive' } });
      const emails = [...new Set(employees.map(emp => emp.email).filter(Boolean))];

      console.log(`[Notification Broadcast] Dispatching email to ${emails.length} employee address(es): ${emails.join(', ')}`);

      if (emails.length > 0) {
        for (const email of emails) {
          sendEmail({
            to: email,
            subject: `[Company Update] ${title}`,
            text: `${message}\n\nThis is an automated notification from AttendanceHub.`,
            html: `<div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
              <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding: 16px 20px; border-radius: 12px; color: #ffffff; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 18px; font-weight: 700;">${title}</h2>
              </div>
              <div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-line;">
                ${message}
              </div>
              <br/>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
              <p style="font-size: 11px; color: #94a3b8; margin: 0;">This is an automated event broadcast from AttendanceHub Portal.</p>
            </div>`
          });
        }
      }
    } else {
      const user = await User.findById(recipient);
      if (user && user.email) {
        await sendEmail({
          to: user.email,
          subject: `[Notification] ${title}`,
          text: `${message}\n\nLog in to your dashboard to review.`,
          html: `<div style="font-family: Arial, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
            <h3 style="color: #4f46e5; margin-top: 0;">${title}</h3>
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">${message}</p>
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" style="display: inline-block; background: linear-gradient(135deg, #4f46e5, #6366f1); color: #ffffff; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 13px; font-weight: bold; margin-top: 16px;">Go to Dashboard</a>
          </div>`
        });
      }
    }
  } catch (err) {
    console.error('Failed to create/send notification dispatch:', err.message);
  }
};

module.exports = { sendNotification };
