import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const {
      email,
      accountType,
      userType,
      goals,
      designPreferences,
      experienceLevel,
      referralSource,
      teamName,
      teamFocus,
      teamSize,
    } = await request.json();

    // Validate the request body
    if (!email || !accountType) {
      return NextResponse.json(
        { error: "Email and account type are required" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return NextResponse.json(
        { error: "User not found. Please sign up first." },
        { status: 404 }
      );
    }

    // Update the user with all onboarding data
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        accountType,
        userType,
        goals: goals || [],
        designPreferences: designPreferences || [],
        experienceLevel,
        referralSource,
      },
    });

    let team = null;

    // If the user is creating a team
    if (accountType === "team" && teamName) {
      team = await prisma.team.create({
        data: {
          name: teamName,
          focus: teamFocus,
          teamSize,
          adminId: updatedUser.id,
        },
      });

      // Add the user as an admin of the team
      await prisma.teamMember.create({
        data: {
          userId: updatedUser.id,
          teamId: team.id,
          role: "admin",
        },
      });
    }

    return NextResponse.json(
      {
        message: "Account updated successfully.",
        user: updatedUser,
        team: team ? team : null, // Return team ID if team was created
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the account" },
      { status: 500 }
    );
  }
}