import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('userEmail');

  if (!userEmail) {
    return NextResponse.json({ error: 'User email is required' }, { status: 400 });
  }

  try {
    // Optimized stats and data fetching using parallel queries and database-level aggregation
    const [statsData, pendingRequests, rejectedRequests, projectsData] = await Promise.all([
      // 1. Get counts for each status using groupBy
      prisma.notification.groupBy({
        by: ['status'],
        where: {
          projectowneremail: userEmail
        },
        _count: {
          _all: true
        }
      }),
      // 2. Fetch only pending notifications with project info
      prisma.notification.findMany({
        where: {
          projectowneremail: userEmail,
          status: 'pending'
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
      }),
      // 3. Fetch only rejected notifications with project info
      prisma.notification.findMany({
        where: {
          projectowneremail: userEmail,
          status: 'rejected'
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
      }),
      // 4. Fetch unique projects with approved notifications and their team members
      prisma.project.findMany({
        where: {
          userEmail: userEmail,
          notifications: {
            some: {
              status: 'approved'
            }
          }
        },
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          techStack: true,
          notifications: {
            where: {
              status: 'approved'
            },
            select: {
              userEmail: true,
              createdAt: true
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })
    ]);

    // Calculate stats from grouped data
    const stats = {
      totalRequests: statsData.reduce((acc, curr) => acc + curr._count._all, 0),
      pending: statsData.find(s => s.status === 'pending')?._count._all || 0,
      approved: statsData.find(s => s.status === 'approved')?._count._all || 0,
      rejected: statsData.find(s => s.status === 'rejected')?._count._all || 0,
      activeProjects: projectsData.length
    };

    // Format approved projects and their team members
    const approvedProjects = projectsData.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      techStack: project.techStack,
      teamMembers: project.notifications
        .filter(n => n.userEmail !== userEmail)
        .map(n => ({
          userEmail: n.userEmail,
          joinedAt: n.createdAt
        }))
    }));

    return NextResponse.json({
      stats,
      pendingRequests,
      approvedProjects,
      rejectedRequests
    });

  } catch (error) {
    console.error('Error fetching owner stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
