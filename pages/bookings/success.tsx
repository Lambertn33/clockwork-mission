import React from 'react'
import {useRouter} from 'next/router'
import { useQuery } from 'react-query'
import { useSession } from "next-auth/react";
import axios from 'axios';
import { IoIosCheckmark, IoLogoGoogle } from 'react-icons/io';

export default function Success() {
    const { data: session, status } = useSession();
    const router = useRouter()
    const  eventId  = router?.query["eventId"]
    const  guestNames  = router?.query["guestNames"]
    const getSingleEventType= async() =>{
        const response = await axios.get(`/api/events/createGuest/${eventId}`)
        return response.data
    }
    const {data:eventType,isLoading:isFetchingEvent , isError:isFetchingEventError,error:fetchingEventError} = useQuery('singleEventForSuccess',getSingleEventType)
    if(isFetchingEvent ) {
        return <h2>Please wait...</h2>
      }
      else if(isFetchingEventError){
        return <h2>There is an error...</h2> 
      }


    return (
        <div className='w-screen h-screen bg-gray-100'>
            <div className='flex items-center justify-center w-full h-full'>
                <div className='px-8 bg-white max-w-4'>
                    <div className='flex justify-center m-4'>
                        <div className='bg-green-200 rounded-full'>
                            <IoIosCheckmark className='text-4xl text-green-600' />
                        </div>
                    </div>
                    <div className='mt-4'>
                        <h2 className='text-lg font-bold text-center'>This Meeting is scheduled</h2>
                        <p className='mt-2 text-sm'>we emailed you and other attendees a calendar invitation with all <br /> the details</p>
                    </div>
                    <hr className='m-4' />
                    <div className='flex justify-between gap-2 mb-4'>
                        <p className='text-sm font-semibold'>What</p>
                        <div className='flex flex-col gap-1'>
                            <p className='text-xs text-left'> Meeting between {session?.user?.name} and</p>
                            <p className='text-xs text-left'>{guestNames}</p>
                         </div>
                    </div>
                    <div className='flex items-center justify-between gap-2 mb-4'>
                                <p className='text-sm font-semibold'>Add To Calendar</p>
                                <div className='flex gap-4'>
                                    <div className='p-2 border border-gray-200'>
                                       <IoLogoGoogle className='text-4xl text-black' />
                                    </div>
                                    <div className='p-2 border border-gray-200'>
                                       <IoLogoGoogle className='text-4xl text-black' />
                                    </div>
                                    <div className='p-2 border border-gray-200'>
                                       <IoLogoGoogle className='text-4xl text-black' />
                                    </div>
                                    <div className='p-2 border border-gray-200'>
                                       <IoLogoGoogle className='text-4xl text-black' />
                                    </div>
                                </div>
                            </div>
                </div>
            </div>
        </div>
    )
}
