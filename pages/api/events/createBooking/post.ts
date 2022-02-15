import prisma from "@helpers/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async (req: NextApiRequest, res: NextApiResponse) =>{
    try {
        const { eventDate , from ,to ,eventTypeId , duration , userId} = req.body
        //Inputs validation
        if(!eventDate || !from){
            res.status(400).json({
                "message":"Please Fill All Fields"
            })
            return;
        }
        const newBooking = await prisma.booking.create({
            data:{
                event_date:eventDate,
                from:from,
                to:to,
                duration:duration,
                event_type_id:eventTypeId,
                userId:userId,
            }
        })    
       res.status(200).send({status:200 , message:"New booking created successfully"})
    } catch (error) {
        res.status(500).send({status:500 , message:error})
    }
}