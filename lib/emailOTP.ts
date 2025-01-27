// import sgMail from "@sendgrid/mail";
// import logger from "@/lib/logger"; // Use the Winston logger
// import { z } from "zod";
// export const emailSchema = z.string().email("Invalid email address");

// // OTP validation schema
// export const otpSchema = z.string().length(6, "OTP must be 6 digits");

// // Locale validation schema
// export const localeSchema = z.string().default("en");

// // Expiry minutes validation schema
// export const expiryMinutesSchema = z.number().min(1).max(60).default(5);

// // Set SendGrid API key
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// // Validate environment variables at startup
// if (!process.env.SENDGRID_API_KEY || !process.env.EMAIL_USER) {
//   throw new Error("Missing required environment variables for SendGrid.");
// }

// // OTP email template
// const getOTPEmailTemplate = (otp: string, expiryMinutes: number, locale: string = "en") => {
//   const translations = {
//     en: {
//       subject: "Your One-Time Password (OTP)",
//       heading: "Your One-Time Password (OTP)",
//       body: `Your OTP is: <strong>${otp}</strong>`,
//       expiry: `This OTP will expire in ${expiryMinutes} minutes.`,
//       footer: "If you did not request this OTP, please ignore this email.",
//     },
//     // Add more languages as needed
//   };

//   const { subject, heading, body, expiry, footer } = translations[locale] || translations.en;

//   return `
//     <!DOCTYPE html>
//     <html lang="${locale}">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>${subject}</title>
//       <style>
//         body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
//         .container { max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
//         .header { font-size: 24px; color: #333; margin-bottom: 20px; }
//         .content { font-size: 16px; color: #555; line-height: 1.6; }
//         .otp { font-size: 32px; font-weight: bold; color: #0070f3; margin: 20px 0; }
//         .footer { font-size: 14px; color: #888; margin-top: 20px; }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">${heading}</div>
//         <div class="content">
//           <p>${body}</p>
//           <div class="otp">${otp}</div>
//           <p>${expiry}</p>
//         </div>
//         <div class="footer">${footer}</div>
//       </div>
//     </body>
//     </html>
//   `;
// };

// // Rate limiting setup (optional)
// const rateLimit = new Map<string, number>(); // Store email and last sent timestamp
// const RATE_LIMIT_DURATION = 60 * 1000; // 1 minute

// /**
//  * Send OTP email with enhanced features.
//  * @param email - The recipient's email address.
//  * @param otp - The OTP to send.
//  * @param expiryMinutes - The number of minutes until the OTP expires (default: 5).
//  * @param locale - The locale for the email content (default: "en").
//  * @throws Error if the email fails to send.
//  */
// export const sendOTPEmail = async (
//   email: string,
//   otp: string,
//   expiryMinutes: number = 5,
//   locale: string = "en"
// ): Promise<void> => {
//   // Validate inputs using Zod
//   emailSchema.parse(email);
//   otpSchema.parse(otp);
//   localeSchema.parse(locale);
//   expiryMinutesSchema.parse(expiryMinutes);

//   // Rate limiting check
//   const now = Date.now();
//   const lastSent = rateLimit.get(email);
//   if (lastSent && now - lastSent < RATE_LIMIT_DURATION) {
//     throw new Error("Please wait before requesting another OTP.");
//   }

//   // Prepare email content
//   const msg = {
//     to: email,
//     from: process.env.EMAIL_USER,
//     subject: "Your One-Time Password (OTP)",
//     html: getOTPEmailTemplate(otp, expiryMinutes, locale),
//   };

//   // Retry mechanism
//   const MAX_RETRIES = 3;
//   let retries = 0;

//   while (retries < MAX_RETRIES) {
//     try {
//       await sgMail.send(msg);
//       rateLimit.set(email, now); // Update rate limit timestamp
//       logger.info(`OTP email sent to ${email}`);
//       return;
//     } catch (error) {
//       retries++;
//       logger.error(`Failed to send OTP email (attempt ${retries}):`, error);

//       if (retries === MAX_RETRIES) {
//         throw new Error("Failed to send OTP email after multiple attempts.");
//       }

//       // Wait before retrying
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//     }
//   }
// };