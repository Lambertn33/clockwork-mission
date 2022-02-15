import prisma from "@helpers/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async(req:NextApiRequest , res:NextApiResponse)=>{
    try {
        const { title , unformattedUrl , description , minutes , userId } = req.body;
        //Inputs validation
        if(!title || !unformattedUrl ||!description || !minutes){
            res.status(400).json({
                "message":"Please Fill All Fields"
            })
            return;
        }
        //make event title unique to a user
        const checkTitleForCurrentUser = await prisma.event.findFirst({
            where:{
                userId:userId,
                AND:{
                    title:title
                }
            }
        })
        if(checkTitleForCurrentUser){
            res.status(400).json({
                "message":`Your already have an event titled ${title}`
            })
            return;
        }

        //new Event Type
        const newEvent = await prisma.event.create({
            data:{
                title:title,
                URL:unformattedUrl,
                description:description,
                userId:userId,
                minutes:minutes
            }
        })
       
        //Everything done..
    
       res.status(200).send({status:200 , message:"New event created successfully"})
    } catch (error) {
        res.status(500).json({
            "message":error
        })
        return;
    }
}