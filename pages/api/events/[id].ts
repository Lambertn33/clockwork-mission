import prisma from "@helpers/prisma"
import { NextApiRequest, NextApiResponse } from "next";

export default async(req: NextApiRequest, res: NextApiResponse) =>{
    const userId = req?.query?.id;
    const events = await prisma.event.findMany({
        where: {
            userId: String(userId)
        },
        select: {
            id:true,
            title:true,
            description:true,
            URL:true,
            minutes:true,
            userId:true
        }
    });
    return res.status(200).json(events);
}