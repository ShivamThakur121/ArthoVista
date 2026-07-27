const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || user === 'your_smtp_username' || !pass || pass === 'your_smtp_password') {
    console.log(`[Development Mode Email Dispatch - Mocked (SMTP credentials missing in .env)]`);
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Body: ${options.text}`);
    return { success: true, mocked: true };
  }

  try {
    const isSecure = port === 465 || process.env.SMTP_SECURE === 'true';

    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: isSecure,
      auth: {
        user: user,
        pass: pass
      }
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || `"Attendance System" <${user}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email dispatched successfully to ${options.to}. MsgID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Email delivery failure to ${options.to}:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = sendEmail;
