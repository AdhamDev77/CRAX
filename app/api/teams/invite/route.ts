import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendTeamInvitationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, role } = await request.json();

    // Check if the email is already invited
    const existingInvitation = await prisma.teamMember.findFirst({
      where: { email },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: "This email has already been invited" },
        { status: 400 }
      );
    }

    // Create the team member
    const teamMember = await prisma.teamMember.create({
      data: {
        email,
        role,
      },
    });

    // Send invitation email
    await sendTeamInvitationEmail(email, role);

    return NextResponse.json(
      { message: "Invitation sent successfully", teamMember },
      { status: 201 }
    );
  } catch (error) {
    console.error("Invitation error:", error);
    return NextResponse.json(
      { error: "An error occurred while sending the invitation" },
      { status: 500 }
    );
  }
}
