import React, { useEffect, useState } from 'react'
import prisma from '@helpers/prisma'
import { BsClockFill } from 'react-icons/bs'
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router'
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import DatePicker from 'react-datepicker'
import { useQuery , useMutation , useQueryClient } from "react-query";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

export default function index() {
    const { data: session, status } = useSession();
    const router = useRouter()
    const [startDate , setStartDate] = useState(new Date())
    const [eventDate , setEventDate] = useState('')
    const [from , setFrom] = useState('')
    const [to , setTo] = useState('')
    const [hasError , setHasError] = useState(false)
    const [errorMessage , setErrorMessage] = useState('')
    const [isSaving , setIsSaving] = useState(false)
    const userId = session?.id
    const  id = router?.query["event"]
    const queryClient = useQueryClient()

    const isWeekday = (date:any) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
      };
     const formatTime = ( date:any) => {
         let fromTime = `${date.getHours()}:${date.getMinutes()}`
         setStartDate(date)
         setEventDate(date.toISOString().slice(0, 10))
         setFrom(fromTime)
         setTo(fromTime)
     }
    const createNewBooking = async(booking:Booking) =>{
       try {
         setIsSaving(true)
         const response = await axios.post('/api/events/createBooking/post',booking)
         if(response.data.status == 200){
            router.push({
                pathname:"/events/[user]/[event]/[date]",
                query:{
                    user:session?.user?.name,
                    event:id,
                    date:eventDate
                }
            })
            console.log('rrr')
         }
       } catch (error:any) {
            setIsSaving(false) 
            setHasError(true)
            setErrorMessage(error.response.data.message)
       }

    }
    const useCreateNewBooking = ()=>{
        return useMutation(createNewBooking)
    }
    const { mutate } = useCreateNewBooking()

    const handleSubmit = (e:any) =>{
       e.preventDefault()
       const { minutes:duration} = eventType
       const newBooking = {startDate,from,to,id,duration , userId}
       mutate( newBooking)

    }
    const getSingleEventType= async() =>{
        const response = await axios.get(`/api/events/createBooking/${id}`)
        return response.data
    }
    const {data:eventType,isLoading:isFetchingEvent , isError:isFetchingEventError,error:fetchingEventError} = useQuery('singleEvent',getSingleEventType)
    if(isFetchingEvent ) {
        return <h2>Please wait...</h2>
    }
    else if(isFetchingEventError){
        return <h2>There is an error...</h2>
    }
  return (
    <div className='w-screen h-screen bg-gray-100'>
       <div className='flex items-center justify-center w-full h-full'>
          <div className='p-16 px-40 bg-white border'>
                <div className='flex justify-center'>
                    {
                        hasError &&
                        <span className='py-4 font-bold text-red-500'>
                            {
                                errorMessage
                            }
                        </span>
                    }
                </div>
                <div className='flex gap-2'>
                   <div className='flex flex-col items-start'>
                     <span className='text-lg text-gray-400 uppercase'>{session?.user?.name}</span>
                     <h3 className='text-3xl font-bold text-black'>{eventType?.minutes} minutes meeting</h3>
                     <h3 className='text-xl font-bold text-black'>{eventType?.title}</h3>
                     <div className='flex items-center gap-2 mt-4'>
                        <BsClockFill className='text-gray-500'/>
                        <span>{eventType?.minutes} minutes</span>
                     </div>
                   </div>
                   <hr className='h-full border border-red-700'/>
                   <div className='flex flex-col items-start'>
                            <span className='mb-2 font-bold'>Select Date and Time</span>
                            <DatePicker
                                 className='p-2 border'
                                 selected={startDate}
                                 onChange={(date:any) => formatTime(date)}
                                 filterDate={isWeekday}
                                 minDate={new Date()}
                                 showTimeSelect
                                timeIntervals={eventType.minutes}
                                minTime={setHours(setMinutes(new Date(), 0),8)}
                                maxTime={setHours(setMinutes(new Date(), 10), 20)}
                                />

                       </div>
                </div>
                <div className='flex justify-center mt-4'>
                    <button onClick={handleSubmit}
                        className={!isSaving ? 'bg-black text-white p-3 rounded-sm': 'bg-gray-400 text-white p-3 rounded-sm'}>
                           <span className='font-bold'>
                               {!isSaving ? "Proceed":"Please wait..."}
                           </span>
                    </button>
                </div>
          </div>
       </div>
    </div>
  )
}
interface Booking{
    startDate: any;
    from: any;
    to: any;
    id: any;
    duration:any
    userId: any;
}

