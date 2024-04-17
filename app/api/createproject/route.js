import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function POST(req){
    const body = await req.json()

    const result = await prisma.project.create({
        data:{
            ...body
        },

    })

    if (!result) return NextResponse.json({
        message:'error',
        status:500
    })
    return NextResponse.json({message:'ok' , status:200 , data:result})
  
}