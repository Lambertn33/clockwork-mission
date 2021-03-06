import prisma from "@helpers/prisma"
import { NextApiRequest, NextApiResponse } from "next";
import { useSession } from "next-auth/react";

export default async(req: NextApiRequest, res: NextApiResponse) =>{
    const id = req?.query?.id
    const eventType = await prisma.event.findUnique({
        where:{
            id:String(id)
        },
        include:{
            booking:true
        }
    })
    return res.status(200).json(eventType)
}