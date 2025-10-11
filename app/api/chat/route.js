import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Get chat messages for a project
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  const userEmail = searchParams.get('userEmail');

  if (!projectId || !userEmail) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Check if user has access to this project (either owner or approved member)
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        notifications: {
          where: {
            userEmail: userEmail,
            status: 'approved'
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user is project owner or approved member
    const isOwner = project.userEmail === userEmail;
    const isApprovedMember = project.notifications.length > 0;

    if (!isOwner && !isApprovedMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get chat messages
    const messages = await prisma.chat.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(messages);

  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// Send a new chat message
export async function POST(req) {
  const { projectId, userEmail, message } = await req.json();

  if (!projectId || !userEmail || !message) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Check if user has access to this project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        notifications: {
          where: {
            userEmail: userEmail,
            status: 'approved'
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Check if user is project owner or approved member
    const isOwner = project.userEmail === userEmail;
    const isApprovedMember = project.notifications.length > 0;

    if (!isOwner && !isApprovedMember) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Create chat message
    const chatMessage = await prisma.chat.create({
      data: {
        projectId,
        userEmail,
        message: message.trim()
      }
    });

    return NextResponse.json(chatMessage);

  } catch (error) {
    console.error('Error creating chat message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}




