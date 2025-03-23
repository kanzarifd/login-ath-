import nodemailer from 'nodemailer';

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use an app-specific password
  }
});

// Email templates
const templates = {
  verifyEmail: (name, verificationUrl) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Welcome to Our Platform!</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">
          ${verificationUrl}
        </p>
        <p>This verification link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `
  }),
  
  resetPassword: (name, resetUrl) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">
          ${resetUrl}
        </p>
        <p>This reset link will expire in 1 hour.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `
  })
};

// Rate limiting setup
const emailLimits = new Map();
const RATE_LIMIT = {
  MAX_EMAILS: 5,
  TIME_WINDOW: 3600000 // 1 hour in milliseconds
};

const isRateLimited = (userId) => {
  const now = Date.now();
  const userLimit = emailLimits.get(userId) || { count: 0, timestamp: now };

  // Reset if time window has passed
  if (now - userLimit.timestamp > RATE_LIMIT.TIME_WINDOW) {
    userLimit.count = 0;
    userLimit.timestamp = now;
  }

  // Check if limit exceeded
  if (userLimit.count >= RATE_LIMIT.MAX_EMAILS) {
    return true;
  }

  // Increment count
  userLimit.count++;
  emailLimits.set(userId, userLimit);
  return false;
};

// Send email with rate limiting
const sendEmail = async (to, template) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export { sendEmail, templates, isRateLimited };
