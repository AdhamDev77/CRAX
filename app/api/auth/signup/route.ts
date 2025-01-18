import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { hashPassword, generateVerificationToken } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { validateSignupInput } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { email, password, accountType, teamName, teamFocus, teamSize } = await request.json();

    // Validate input
    const validationError = validateSignupInput(email, password);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Check if the email is already registered
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Generate a verification token
    const verificationToken = generateVerificationToken();

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        accountType,
        verificationToken,
        verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      },
    });

    // If the user is creating a team
    if (accountType === "team" && teamName) {
      const team = await prisma.team.create({
        data: {
          name: teamName,
          focus: teamFocus,
          teamSize,
          adminId: user.id,
        },
      });

      // Add the user as an admin of the team
      await prisma.teamMember.create({
        data: {
          userId: user.id,
          teamId: team.id,
          role: "admin",
        },
      });
    }

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { message: "Signup successful. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}