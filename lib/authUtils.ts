import { randomBytes, pbkdf2Sync } from 'crypto';
import axios from 'axios';

// Password utilities
export const hashPassword = (password: string): string => {
  const salt = randomBytes(16).toString('hex');
  const hashedPassword = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${hashedPassword}:${salt}`;
};

export const verifyPassword = (password: string, storedHash: string): boolean => {
  const [hashedPassword, salt] = storedHash.split(':');
  const hashedInputPassword = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hashedInputPassword === hashedPassword;
};

// OTP utilities
const otpStore: Record<string, { otp: string; expiresAt: number }> = {};

export const generateOTP = (email: string): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes

  otpStore[email] = { otp, expiresAt };
  return otp;
};

export const verifyOTP = (email: string, otp: string): boolean => {
  const storedOTP = otpStore[email];

  if (!storedOTP || storedOTP.expiresAt < Date.now()) {
    return false; // OTP expired or doesn't exist
  }

  return storedOTP.otp === otp;
};

// Email utilities
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  try {
    const response = await axios.post('/api/send-otp', {
      to: email,
      subject: 'Your One-Time Password (OTP)',
      html: `
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Failed to send OTP email:', error);

    // Handle axios errors
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to send OTP email: ${error.response?.data?.message || error.message}`);
    }

    throw new Error('Failed to send OTP email');
  }
};