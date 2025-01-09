// app/api/accepted-projects/route.js
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({
      message: 'Missing email in request body',
      status: 400,
    });
  }

  try {
    // Add logging to debug
    console.log('Searching for accepted projects for email:', body.email);
    
    const acceptedProjects = await prisma.notification.findMany({
      where: {
        userEmail: body.email,
        status: 'accepted',
      },
      include: {
        project: true,
      },
    });

    console.log('Found accepted projects:', acceptedProjects);

    // Extract just the project data
    const projects = acceptedProjects.map(notification => notification.project);
    
    console.log('Filtered project data:', projects);

    return NextResponse.json({
      message: 'Projects fetched successfully',
      status: 200,
      data: projects,
    });
  } catch (error) {
    console.error('Error fetching accepted projects:', error);
    return NextResponse.json({
      message: 'Error fetching projects',
      status: 500,
    });
  }
}