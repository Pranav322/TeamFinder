import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('userEmail');

  if (!userEmail) {
    return NextResponse.json({ error: 'User email is required' }, { status: 400 });
  }

  try {
    // Get all projects where user is either owner or approved member
    const userProjects = await prisma.project.findMany({
      where: {
        OR: [
          { userEmail: userEmail }, // User is project owner
          {
            notifications: {
              some: {
                userEmail: userEmail,
                status: 'approved'
              }
            }
          }
        ]
      },
      include: {
        chats: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        notifications: {
          where: {
            userEmail: userEmail,
            status: 'approved'
          }
        }
      }
    });

    // Get last seen timestamps (we'll use localStorage for now, but could be stored in DB)
    // For now, we'll show all messages as "unread" if they're from the last 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const chatSummary = userProjects.map(project => {
      const latestMessage = project.chats[0];
      const isOwner = project.userEmail === userEmail;
      
      // Count unread messages (messages from last 24 hours for now)
      const unreadCount = project.chats.filter(chat => 
        chat.createdAt > oneDayAgo && chat.userEmail !== userEmail
      ).length;

      return {
        projectId: project.id,
        projectTitle: project.title,
        projectImage: project.imageUrl,
        latestMessage: latestMessage ? {
          message: latestMessage.message,
          userEmail: latestMessage.userEmail,
          createdAt: latestMessage.createdAt,
          isFromUser: latestMessage.userEmail === userEmail
        } : null,
        unreadCount: Math.min(unreadCount, 99), // Cap at 99
        isOwner: isOwner,
        hasUnread: unreadCount > 0
      };
    }).filter(project => project.latestMessage); // Only show projects with messages

    // Sort by latest message time
    chatSummary.sort((a, b) => {
      if (!a.latestMessage && !b.latestMessage) return 0;
      if (!a.latestMessage) return 1;
      if (!b.latestMessage) return -1;
      return new Date(b.latestMessage.createdAt) - new Date(a.latestMessage.createdAt);
    });

    const totalUnread = chatSummary.reduce((sum, project) => sum + project.unreadCount, 0);

    return NextResponse.json({
      totalUnread,
      chats: chatSummary
    });

  } catch (error) {
    console.error('Error fetching unread messages:', error);
    return NextResponse.json({ error: 'Failed to fetch unread messages' }, { status: 500 });
  }
}
