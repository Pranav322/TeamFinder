// app/api/notifications/[id]/route.js
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  const { id } = params;
  const { status } = await req.json();

  try {
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedNotification);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}