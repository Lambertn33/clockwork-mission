import prisma from "@helpers/prisma";
import { NextApiRequest, NextApiResponse } from "next";


export default async (req:NextApiRequest,res:NextApiResponse) =>{
    const { names , email , description , eventType} = req.body
    //check empty fields

    if(!names || !email ||!description ){
        res.status(400).json({
            "message":"Please Fill All Fields",
        })
        return;
    }
    try {
        const newGuest = await prisma.guest.create({
            data:{
                names:names,
                email:email,
                description:description,
                booking_id:eventType.booking[0].id
            }
        })
        if(newGuest){
            res.status(200).json({ status: 200, message: "Guest Created successfully" });
        }
    } catch (error) {
        res.status(500).json({
            "message":error
        })
        return;
    }
}