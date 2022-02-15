import prisma from "@helpers/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async (req: NextApiRequest, res: NextApiResponse) =>{
    try {
        const { startDate , from ,to ,id , duration , userId} = req.body
        //Inputs validation
        if(!startDate || !from){
            res.status(400).json({
                "message":"Please Fill All Fields"
            })
            return;
        }
        const newBooking = await prisma.booking.create({
            data:{
                event_date:startDate,
                from:from,
                to:to,
                duration:duration,
                event_type_id:id,
                userId:userId,
            }
        })    
       res.status(200).send({status:200 , message:"New booking created successfully"})
    } catch (error) {
        res.status(500).send({status:500 , message:error})
    }
}