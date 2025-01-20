import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendTeamInvitationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    // Parse the request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    // Validate the request body
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body must be a valid JSON object" },
        { status: 400 }
      );
    }

    const { email, role, teamId } = body;

    if (!email || !role || !teamId) {
      return NextResponse.json(
        { error: "Email, role, and teamId are required" },
        { status: 400 }
      );
    }

    // Check if the email is already invited
    const existingInvitation = await prisma.teamMember.findFirst({
      where: { email, teamId },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: "This email has already been invited to the team" },
        { status: 400 }
      );
    }

    // Create the team member
    const teamMember = await prisma.teamMember.create({
      data: {
        email,
        role,
        teamId,
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