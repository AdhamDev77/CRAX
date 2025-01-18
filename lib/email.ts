import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.BASE_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Account",
    html: `
      <p>Please verify your account by clicking the button below:</p>
      <a href="${verificationLink}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Account</a>
    `,
  });
};

// Send team invitation email
export const sendTeamInvitationEmail = async (email: string, role: string) => {
  const invitationLink = `${process.env.BASE_URL}/teams/accept-invitation?email=${email}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "You've Been Invited to a Team",
    html: `
      <p>You have been invited to join a team as a <strong>${role}</strong>.</p>
      <p>Click the button below to accept the invitation:</p>
      <a href="${invitationLink}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Accept Invitation</a>
    `,
  });
};