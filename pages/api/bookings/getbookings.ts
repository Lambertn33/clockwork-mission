import prisma from "@helpers/prisma"
import { NextApiRequest, NextApiResponse } from "next";

export default async(req: NextApiRequest, res: NextApiResponse,id:string) =>{
    const bookings = await prisma.booking.findMany({
        where:{
            userId:id
        },
        include:{
            event:true,
            guest:true
        }
    })
    return res.status(200).json(bookings)
}