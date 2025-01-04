import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, content, image , category, features } = await req.json();

  try {
    const template = await prisma.template.create({
      data: {
        title,
        description,
        image,
        category,
        features,
        content,
      },
    });

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating template' }, { status: 500 });
  }
}