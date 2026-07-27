import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const logToFile = (msg) => {
  try {
    fs.appendFileSync(path.join(process.cwd(), 'email_debug.log'), new Date().toISOString() + ' - ' + msg + '\n');
  } catch (e) {}
};

const sendEmail = async (options) => {
  try {
    logToFile(`[sendEmail] Triggered for email: ${options.email}, Subject: ${options.subject}`);

    // Determine if we have SMTP credentials configured
    const isSmtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER;

    if (!isSmtpConfigured) {
      logToFile('[sendEmail] SMTP NOT CONFIGURED! Check your .env file.');
      console.log('=====================================================');
      console.log('📧 MOCK EMAIL SENT (No SMTP Credentials Found)');
      console.log(`To: ${options.email}`);
      console.log(`Subject: ${options.subject}`);
      console.log('HTML Content:');
      console.log(options.html);
      console.log('=====================================================');
      return;
    }

    logToFile(`[sendEmail] Transporter created. SMTP_HOST: ${process.env.SMTP_HOST}, SMTP_USER: ${process.env.SMTP_USER}`);

    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Generate a plain text version of the HTML to dramatically reduce Spam Score
    const plainTextFallback = options.html ? options.html.replace(/<[^>]+>/g, '\n').replace(/\n\s*\n/g, '\n').trim() : '';

    const message = {
      from: `${process.env.FROM_NAME || 'AI Job Board'} <${process.env.FROM_EMAIL || 'noreply@aijobboard.com'}>`,
      to: options.email,
      replyTo: process.env.FROM_EMAIL || 'noreply@aijobboard.com',
      subject: options.subject,
      text: plainTextFallback,
      html: options.html,
      headers: {
        'X-Priority': '1 (Highest)',
        'X-Mailer': 'Nodemailer'
      }
    };

    logToFile(`[sendEmail] Sending email via transporter...`);
    const info = await transporter.sendMail(message);
    logToFile(`[sendEmail] SUCCESS! Email sent: ${info.messageId}`);
    console.log('Email sent: %s', info.messageId);
  } catch (error) {
    logToFile(`[sendEmail] ERROR: ${error.message} \n ${error.stack}`);
    console.error('Error sending email: ', error);
    // We don't throw the error so that the main application flow (like accepting a candidate) 
    // doesn't break just because the email failed to send.
  }
};

export default sendEmail;
