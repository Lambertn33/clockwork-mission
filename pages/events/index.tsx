import React, { useState } from 'react'
import Shell from "@components/Shell";
import { useSession } from "next-auth/react";
import { useQuery , useMutation , useQueryClient } from "react-query";
import axios from "axios";
import { BsClockFill } from 'react-icons/bs'
import {FaUserAlt} from 'react-icons/fa'
import { GoLinkExternal } from 'react-icons/go'
import Link from 'next/link';

export default function Index() {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const[unformattedUrl , setUnformattedUrl] = useState('')
    const [description, setDescription] = useState('')
    const [minutes, setMinutes] = useState('')
    const [hasError , setHasError] = useState(false)
    const [errorMessage , setErrorMessage] = useState('')
    const [isSaving , setIsSaving] = useState(false)
    const queryClient = useQueryClient()

    const userId = session?.id
    const getUserEventTypes = async() =>{
        const response = await axios.get(`/api/events/${userId}`)
        const data = response.data
        return data
    }
    const togglePopup = () => {
        setHasError(false)
        setErrorMessage("");
        setTitle('')
        setUrl('')
        setDescription('')
        setMinutes('')
        setIsOpen(!isOpen);
    }
    const settingTitle = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(e.target.value)
        setUnformattedUrl(title.replace(/ /g,'-'))
        setUrl(`${window.location.hostname}/${unformattedUrl}`)
    }
    const createNewEvent = async(eventType:EventType)=>{
        try {
            setIsSaving(true)
            const response = await axios.post('/api/events/post',eventType)
            if(response.data.status == 200){
                setIsSaving(false)
                setTitle('')
                setUrl('')
                setDescription('')
                setMinutes('')
                setIsOpen(false)
                queryClient.invalidateQueries('events')
            }
            } catch (error:any) {
                if(error.response.status !==200){
                    setIsSaving(false)
                    setErrorMessage(error.response.data.message)
                    setHasError(true)
                }
            }
    }
    const useCreateNewEvent = ()=>{
        return useMutation(createNewEvent)
    }
    const { mutate} = useCreateNewEvent()

    const handleSubmit = (e:any) =>{
       e.preventDefault()
       const userId:any = session?.id
       const newEventType ={ title,unformattedUrl,description,minutes,userId}
       mutate(newEventType)
    }

    const {data:events , isLoading:isFetchingEvents , isError:isFailedToFetchEvents , error:errorFetchingEvents} = useQuery("events",getUserEventTypes)
    if(isFetchingEvents) return <h2>Please wait...</h2>
    if(isFailedToFetchEvents) return <h2>There is an error...</h2>
    return (
        <Shell>
            <div className='w-full h-full'>
                <div className='px-12 py-20'>
                    <div className='flex justify-between'>
                        <div>
                            <h4 className='text-2xl font-bold'>Event Types</h4>
                            <p className='font-semibold text-gray-400'>Create events to share for people to book on your calendar.</p>
                        </div>
                        <div>
                            <button className='px-4 py-1 text-white bg-black' onClick={()=>setIsOpen(!isOpen)}>
                                <div className='flex items-center justify-around'>
                                    <span className='text-lg font-bold'>+</span>
                                    <span className='font-bold'>New Event Type</span>
                                </div>
                            </button>
                        </div>
                    </div>
                    {
                        isOpen &&
                            <div className='popup-box'>
                                <div className="box">
                                    <div className="">
                                        {
                                            hasError &&
                                            <div className='flex justify-center'>
                                                <span className='font-bold text-red-500'>{errorMessage}</span>
                                            </div>
                                        }
                                        <p className="text-xl font-bold">Add a new event type</p>
                                        <p className="font-semibold text-gray-400">Create a new event type for people to book times with.</p>
                                        <form onSubmit={handleSubmit}  className="flex flex-col max-w-2xl gap-3 py-3">
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold text-left">Title</label>
                                                <input type="text" name="" id="" className="w-full p-2 text-sm border" placeholder="Quick Chat" value={title} onChange={settingTitle} />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold text-left">Url</label>
                                                <div className="flex items-center">
                                                    <p className="p-2 px-4 font-semibold text-gray-400 border-t border-b border-l bg-gray-50">https://cal.com/{session?.user?.name}/</p>
                                                    <input type="text" name="" id="" readOnly className="w-full px-4 py-2 text-sm border" placeholder="" value={unformattedUrl}  />
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold text-left">Description</label>
                                                <textarea name="" id=""  placeholder="A Quick Video Meeting" className="w-full px-4 py-2 text-sm border"  value={description} onChange={e => setDescription(e.target.value)}/>
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-sm font-semibold text-left">Length</label>
                                                <div className="flex border">
                                                    <input type="number" name="" id="" className="w-full px-4 py-2 text-sm" placeholder="" value={minutes} onChange={e => setMinutes(e.target.value)} />
                                                    <p className="p-2 px-4 text-gray-400 ">Minutes</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-4">
                                                <button className="p-2 px-4 border" onClick={togglePopup}>Cancel</button>
                                                <button className={isSaving ? "p-2 px-4 text-white bg-gray-400": "p-2 px-4 text-white bg-black"}>
                                                    {
                                                        isSaving ? "Please wait...":"Continue"
                                                    }
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                             </div>
                        }
                        <div className='mt-4'>
                           {
                                !isFetchingEvents && events.length > 0 ? 
                                events.map((event: any)=>{
                                    return(
                                      <div key={event.id} className='p-4 pt-4 bg-white border border-gray-300 rounded-sm'>
                                       <div className='flex justify-between'>
                                           <div>
                                              <span className='text-sm font-bold'>{event.minutes} Min Meeting</span><span className='text-xs'>/{session?.user?.name}/{event.minutes}min</span>
                                              <div className='flex items-center gap-4 mt-4'>
                                                  <div className='flex items-center'>
                                                      <BsClockFill className='text-gray-500'/>
                                                      <span className='ml-1 text-sm text-gray-500'>{event.minutes}min</span>
                                                  </div>
                                                  <div className='flex items-center'>
                                                      <FaUserAlt className='text-gray-500'/>
                                                      <span className='ml-1 text-sm text-gray-500'>1-on-1</span>
                                                  </div>
                                              </div>
                                           </div>
                                           {
                                               event?.booking.length === 0 ?
                                               <div className='flex items-center px-4'>
                                               <Link href={{
                                                   pathname:'/events/[user]/[event]',
                                                   query:{event:event.id , user:session?.user?.name}
                                               }}>
                                                  <a target="_blank">
                                                  <GoLinkExternal/>
                                                  </a>
                                               </Link>
                                           </div>:
                                           <span className='font-bold text-sm text-red-500'>
                                               Event booked..
                                           </span>
                                           }
                                       </div>
                                      </div>
                                    )
                                })
                               :
                               <div className='flex justify-center p-4 bg-white'>
                                  <span className='text-lg font-bold text-red-600'>Dear {session?.user?.name} you have no event types yet</span>
                               </div>
                           }
                        </div>
                </div>
            </div>
        </Shell>
    )
}

interface EventType{
    title: string;
    unformattedUrl: string;
    description: string;
    minutes: string;
    userId: string;
}
