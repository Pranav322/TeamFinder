import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
    const body = await req.json();

    return new Promise((resolve) => {
        if (body.email) {
            prisma.project.findMany({
                where: {
                    userEmail: body.email,
                },
            })
            .then((projects) => {
                if (!projects || projects.length === 0) {
                    resolve(
                        NextResponse.json({
                            message: 'No projects found for the provided email',
                            status: 404,
                        })
                    );
                } else {
                    resolve(
                        NextResponse.json({
                            message: 'Projects sent successfully',
                            status: 200,
                            data: projects,
                        })
                    );
                }
            })
            .catch(() => {
                resolve(
                    NextResponse.json({
                        message: 'Error fetching projects',
                        status: 500,
                    })
                );
            });
        } else {
            resolve(
                NextResponse.json({
                    message: 'Missing email in request body',
                    status: 400,
                })
            );
        }
    });
}
