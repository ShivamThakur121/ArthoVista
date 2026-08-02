const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const toAddresses = Array.isArray(options.to) ? options.to : [options.to];

  // If Mailercloud API key is configured, use it for HTTP transactional sending
  if (process.env.MAILERCLOUD_API_KEY) {
    try {
      const fromEmail = options.from || process.env.SMTP_FROM || 'support@arthovista.com';
      const fromName = options.fromName || 'Attendance Hub';
      
      const payload = {
        version: "1.0",
        email: {
          from: fromEmail,
          fromName: fromName,
          subject: options.subject,
          html: options.html,
          text: options.text,
          recipients: {
            to: toAddresses.map(email => ({ email }))
          }
        }
      };

      const res = await fetch('https://email-api.mailercloud.com/email', {
        method: 'POST',
        headers: {
          'Authorization': process.env.MAILERCLOUD_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const responseText = await res.text();
      let responseJson = {};
      try {
        responseJson = JSON.parse(responseText);
      } catch (e) {}

      if (res.status === 200 && responseJson.status === 'SUCCESS') {
        console.log(`Email dispatched successfully to ${toAddresses.length} recipient(s) via Mailercloud API.`);
        return { success: true, messageId: responseJson.statusCode };
      } else {
        throw new Error(responseJson.message || responseText);
      }
    } catch (err) {
      console.error(`Email delivery failure via Mailercloud API:`, err.message);
      return { success: false, error: err.message };
    }
  }

  // Fallback to Nodemailer SMTP
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || user === 'your_smtp_username' || !pass || pass === 'your_smtp_password') {
    console.log(`[Development Mode Email Dispatch - Mocked (SMTP credentials missing in .env)]`);
    console.log(`To: ${toAddresses.join(', ')}`);
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
      },
      debug: true,
      logger: true
    });

    // If multiple addresses, use BCC to protect privacy
    const mailOptions = {
      from: options.from || process.env.SMTP_FROM || `"Attendance System" <${user}>`,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    if (toAddresses.length > 1) {
      mailOptions.to = user; // Send to self
      mailOptions.bcc = toAddresses; // BCC others
    } else {
      mailOptions.to = toAddresses[0];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email dispatched successfully. MsgID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`Email delivery failure:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = sendEmail;
