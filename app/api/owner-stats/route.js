import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('userEmail');

  if (!userEmail) {
    return NextResponse.json({ error: 'User email is required' }, { status: 400 });
  }

  try {
    // Get all notifications for projects owned by the user
    const notifications = await prisma.notification.findMany({
      where: {
        projectowneremail: userEmail
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            techStack: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Separate by status
    const pending = notifications.filter(n => n.status === 'pending');
    const approved = notifications.filter(n => n.status === 'approved');
    const rejected = notifications.filter(n => n.status === 'rejected');

    // Get unique approved projects with their team members (excluding project owner)
    const approvedProjects = approved.reduce((acc, notification) => {
      const projectId = notification.projectId;
      if (!acc[projectId]) {
        acc[projectId] = {
          ...notification.project,
          teamMembers: []
        };
      }
      // Only add team members who are not the project owner
      if (notification.userEmail !== userEmail) {
        acc[projectId].teamMembers.push({
          userEmail: notification.userEmail,
          joinedAt: notification.createdAt
        });
      }
      return acc;
    }, {});

    const stats = {
      totalRequests: notifications.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      activeProjects: Object.keys(approvedProjects).length
    };

    return NextResponse.json({
      stats,
      pendingRequests: pending,
      approvedProjects: Object.values(approvedProjects),
      rejectedRequests: rejected
    });

  } catch (error) {
    console.error('Error fetching owner stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}

