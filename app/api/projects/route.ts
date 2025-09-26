import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userEmail = searchParams.get('userEmail');
        
        // Build where clause to exclude user's own projects
        const whereClause = userEmail ? {
            userEmail: {
                not: userEmail
            }
        } : {};
        
        const projects = await prisma.project.findMany({
            where: whereClause,
            include: {
                notifications: {
                    where: userEmail ? {
                        userEmail: userEmail
                    } : undefined
                }
            }
        });
        
        // Transform projects to include request status
        const projectsWithStatus = projects.map(project => ({
            ...project,
            requestStatus: project.notifications.length > 0 ? project.notifications[0].status : null
        }));
        
        return NextResponse.json(projectsWithStatus);
    } catch (error) {
        // Narrow down the error type
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
