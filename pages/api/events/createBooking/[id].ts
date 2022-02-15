import prisma from "@helpers/prisma"
import { NextApiRequest, NextApiResponse } from "next";
import { useSession } from "next-auth/react";

export default async(req: NextApiRequest, res: NextApiResponse) =>{
    const id = req?.query?.id
    const eventType = await prisma.event.findUnique({
        where:{
            id:String(id)
        },
        select:{
            id:true,
            title:true,
            description:true,
            URL:true,
            minutes:true,
            userId:true
        }
    })
    return res.status(200).json(eventType)
}