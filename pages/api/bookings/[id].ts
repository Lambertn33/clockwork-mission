import prisma from "@helpers/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async(req: NextApiRequest, res: NextApiResponse) =>{
    const userId = req?.query?.id;
    const bookings = await prisma.booking.findMany({
        where: {
            userId: String(userId)
        },
        include: {
            event: true,
            guest: true
        },
    })
    return res.status(200).json(bookings);
}