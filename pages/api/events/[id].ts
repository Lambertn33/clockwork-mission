import prisma from "@helpers/prisma"
import { NextApiRequest, NextApiResponse } from "next";

export default async(req: NextApiRequest, res: NextApiResponse) =>{
    const userId = req?.query?.id;
    const events = await prisma.event.findMany({
        where: {
            userId: String(userId)
        },
        include: {
            booking:true
        }
    });
    return res.status(200).json(events);
}