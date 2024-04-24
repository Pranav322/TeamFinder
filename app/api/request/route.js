import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req) {
  const { projectId, userEmail, projectOwnerEmail } =  await req.json();

  if (!projectId || !userEmail || !projectOwnerEmail) {
    return NextResponse.json({ error: 'Missing parameters' });
  }

  if (!isValidEmail(userEmail) || !isValidEmail(projectOwnerEmail)) {
    return NextResponse.json({ error: 'Invalid email format' });
  }
  

  const notification = await prisma.notification.create({
    data: {
      userEmail,
      projectowneremail: projectOwnerEmail,
      projectId
    }
  });
  const message = `${userEmail} wants to join your project`;

  return NextResponse.json({ message });
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

