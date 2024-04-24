import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    if (req.method === 'GET') {
        try {
            const projects = await prisma.notification.findMany();
            return NextResponse.json(projects);
        } catch (error) {
            return NextResponse.json({ error: error.message });
        }
    } else {
        return NextResponse.json({ error: 'Invalid request method' });
    }
}