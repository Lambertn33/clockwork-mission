import React, { useEffect, useState } from 'react'
import FormInput from '@components/Form/FormInput'
import FormTextArea from '@components/Form/FormTextArea'
import FormErrorMessage from '@components/Form/FormErrorMessage'
import { FcGlobe } from 'react-icons/fc'
import {BsClockFill} from 'react-icons/bs'
import {BsFillCalendarEventFill} from 'react-icons/bs'
import axios from 'axios'
import {useRouter} from 'next/router'
import { useMutation, useQuery } from 'react-query'
import { useSession } from "next-auth/react";

export default function Index() {
  const { data: session, status } = useSession();
  const router = useRouter()
  const  id  = router?.query["event"]
  const [names , setNames] = useState('')
  const [email , setEmail] = useState('')
  const [description , setDescription] = useState('')
  const [hasError , setHasError] = useState(false)
  const [errorMessage , setErrorMessage] = useState('')
  const [isSaving , setIsSaving] = useState(false)


  const getSingleEventType= async() =>{
        const response = await axios.get(`/api/events/createGuest/${id}`)
        return response.data
    }
function hideErrorMessage(){
  setHasError(false)
}

const {data:eventType,isLoading:isFetchingEvent , isError:isFetchingEventError,error:fetchingEventError} = useQuery('singleEventForGuest',getSingleEventType)
const createNewGuest = async(guest:Guest) =>{
    try {
        setIsSaving(true)
        const userId = session?.id
        const response = await axios.post('/api/events/createGuest/post',guest)
         if(response.data.status == 200){
             router.push({
                pathname:"/bookings/success",
                query:{
                    eventId:eventType.id,
                    bookingId:eventType.booking[0].id,
                    guestNames:names
                }
             })
         }
    } catch (error:any) {
        if(error.response.status !==200){
            setIsSaving(false)
            setErrorMessage(error.response.data.message)
            setHasError(true)
        }
    }
}
const useCreateNewGuest = ()=>{
    return useMutation(createNewGuest)
}
const { mutate } = useCreateNewGuest()

const handleSubmit = (e:any) =>{
  e.preventDefault()
  const newGuest = { names,email,description,eventType}
   mutate(newGuest)
}

if(isFetchingEvent ) {
  return <h2>Please wait...</h2>
}
else if(isFetchingEventError){
  return <h2>There is an error...</h2> 
}
  return (
    <div className='w-screen h-screen bg-gray-100'>
                 <div className='flex items-center justify-center w-full h-full'>
                     <div className='px-4 bg-white'>
                         <div className='grid grid-cols-2'>
                             <div className='col-span-1'>
                                 <div className='flex flex-col items-start mt-4'>
                                     <FcGlobe className='text-5xl'/>
                                     <span className='text-sm font-semibold text-gray-400'>{session?.user?.name}</span>
                                     <h2 className='text-2xl font-bold text-black'>{eventType?.minutes} Min Meeting</h2>
                                     <div className='mt-2'>
                                         <div className='flex items-center '>
                                             <BsClockFill />
                                             <span className='ml-2 text-sm font-semibold text-gray-400'>{eventType.minutes} Minutes</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             <div className='col-span-1'>
                                <form onSubmit={handleSubmit}>
                                <div className='py-4'>
                                {hasError && <FormErrorMessage
                                 errorMessage={errorMessage}
                                 onHide={hideErrorMessage}
                                 />}
                                </div> 
                                <FormInput 
                                         type="text"
                                         placeholder="Username"
                                         label="Guest names" 
                                         value={names}
                                         onChange = {(e: any)=>setNames(e.target.value)}         
                                     />
                                <FormInput 
                                         type="email"
                                         placeholder="you@example.com"
                                         label="Guest Email Address"     
                                         value={email}
                                         onChange = {(e: any)=>setEmail(e.target.value)}         
                                     />
                                 <FormTextArea
                                  label="Additional Notes"
                                   value={description}
                                    onChange={(e: any)=>setDescription(e.target.value)}/>


                                 <div className='flex mb-4 ml-4'>
                                     <button type="submit" className={
                                         !isSaving ? 'px-4 py-1 bg-black rounded-md' :'px-4 py-1 bg-gray-400 rounded-md'
                                     }>
                                         <span className='font-bold text-white'>
                                             {
                                                 !isSaving ? "Confirm" :"Please wait.."
                                             }
                                         </span>
                                     </button>
                                     <button type="button"  className='px-4 py-1 ml-4 bg-white border border-black rounded-md'>
                                         <span className='font-bold text-black'>Cancel</span>
                                     </button>
                                 </div>
                                </form>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
  )
}
interface Guest{
    names:String,
    email:String,
    description:String,
    eventType:any
}
