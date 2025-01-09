// app/api/request/route.js
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { projectId, userEmail, projectOwnerEmail } = await req.json();

  if (!projectId || !userEmail || !projectOwnerEmail) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Check for existing pending request
    const existingRequest = await prisma.notification.findFirst({
      where: {
        projectId,
        userEmail,
        status: 'pending',
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You have already sent a request for this project' },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userEmail,
        projectowneremail: projectOwnerEmail,
        projectId,
        status: 'pending'
      }
    });

    return NextResponse.json({ 
      message: `Request sent successfully`,
      notification 
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Failed to send request' }, { status: 500 });
  }
}