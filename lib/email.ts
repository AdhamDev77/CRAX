// import sgMail from "@sendgrid/mail";

// // Set SendGrid API key
// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// // Send verification email
// export const sendVerificationEmail = async (email: string, token: string) => {
//   const verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`;

//   const msg = {
//     to: email,
//     from: process.env.EMAIL_USER!,
//     subject: "Verify Your Account",
//     html: `
//       <p>Please verify your account by clicking the button below:</p>
//       <a href="${verificationLink}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Account</a>
//     `,
//   };

//   try {
//     await sgMail.send(msg);
//     console.log(`Verification email sent to ${email}`);
//   } catch (error) {
//     console.error("Failed to send verification email:", error);
//     throw new Error("Failed to send verification email");
//   }
// };

// // Send team invitation email
// export const sendTeamInvitationEmail = async (email: string, role: string) => {
//   const invitationLink = `${process.env.BASE_URL}/teams/accept-invitation?email=${email}`;

//   const msg = {
//     to: email,
//     from: process.env.EMAIL_USER!,
//     subject: "You've Been Invited to a Team",
//     html: `
//       <p>You have been invited to join a team as a <strong>${role}</strong>.</p>
//       <p>Click the button below to accept the invitation:</p>
//       <a href="${invitationLink}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
//     `,
//   };

//   try {
//     await sgMail.send(msg);
//     console.log(`Team invitation email sent to ${email}`);
//   } catch (error) {
//     console.error("Failed to send team invitation email:", error);
//     throw new Error("Failed to send team invitation email");
//   }
// };