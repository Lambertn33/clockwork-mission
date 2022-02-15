import prisma from "@helpers/prisma"
import { NextApiRequest, NextApiResponse } from "next";
import { useSession } from "next-auth/react";

export default async(req: NextApiRequest, res: NextApiResponse) =>{
    const eventType = await prisma.event.findUnique({
        where:{
            id:req?.query?.id
        },
        include:{
            booking:true
        }
    })
    return res.status(200).json(eventType)
}