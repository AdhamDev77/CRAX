import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { NextApiRequest } from "next";

// Helper function to get the session
const getServerSession = async (req: NextApiRequest) => {
  const session = await getSession({ req });
  return session;
};

// GET: Fetch all team members
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    // Fetch all team members for the given team
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId },
      include: { user: true }, // Include user details
    });

    return NextResponse.json(teamMembers, { status: 200 });
  } catch (error) {
    console.error("Fetch team members error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching team members" },
      { status: 500 }
    );
  }
}

// POST: Add a new team member
export async function POST(request: Request) {
  try {
    const { teamId, email, role } = await request.json();

    if (!teamId || !email || !role) {
      return NextResponse.json(
        { error: "Team ID, email, and role are required" },
        { status: 400 }
      );
    }

    // Check if the email is already a member of the team
    const existingMember = await prisma.teamMember.findFirst({
      where: { teamId, email },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "This email is already a member of the team" },
        { status: 400 }
      );
    }

    // Add the new team member
    const newMember = await prisma.teamMember.create({
      data: {
        teamId,
        email,
        role,
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Add team member error:", error);
    return NextResponse.json(
      { error: "An error occurred while adding the team member" },
      { status: 500 }
    );
  }
}

// PUT: Update a team member's role
export async function PUT(request: Request) {
  try {
    const { teamMemberId, role } = await request.json();

    if (!teamMemberId || !role) {
      return NextResponse.json(
        { error: "Team member ID and role are required" },
        { status: 400 }
      );
    }

    // Update the team member's role
    const updatedMember = await prisma.teamMember.update({
      where: { id: teamMemberId },
      data: { role },
    });

    return NextResponse.json(updatedMember, { status: 200 });
  } catch (error) {
    console.error("Update team member error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the team member" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a team member
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const teamMemberId = searchParams.get("teamMemberId");

    if (!teamMemberId) {
      return NextResponse.json(
        { error: "Team member ID is required" },
        { status: 400 }
      );
    }

    // Delete the team member
    await prisma.teamMember.delete({
      where: { id: teamMemberId },
    });

    return NextResponse.json(
      { message: "Team member removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Remove team member error:", error);
    return NextResponse.json(
      { error: "An error occurred while removing the team member" },
      { status: 500 }
    );
  }
}
