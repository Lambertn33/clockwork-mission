import Link from "next/link";
import Shell from "@components/Shell";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { IoIosClose, IoIosAlarm } from 'react-icons/io'
import axios from "axios";
import { Key, ReactChild, ReactFragment, ReactPortal } from "react";


export default function Bookings() {
     const { data: session, status } = useSession();
     const userId = session?.id
     const getUserBookings = async() =>{
        const response = await axios.get(`/api/bookings/${userId}`)
        const data = response.data
        return data
    }
    const {data:bookings , isLoading:isFetchingEvents , isError:isFailedToFetchEvents , error:errorFetchingEvents} = useQuery("events",getUserBookings)
    if(isFetchingEvents) return <h2>Please wait...</h2>
    if(isFailedToFetchEvents) return <h2>There is an error...</h2> 
  return (
    <Shell>
      <div className="w-full h-full">
         <div className="px-12 py-20">
            <div className=''>
               <h4 className='text-2xl font-bold'>Bookings</h4>
               <p className='font-semibold text-gray-400'>see upcoming and past events through your event type links</p>
            </div>
            <div className='mt-8'>
                <div className='flex gap-4'>
                  <p className='font-extrabold text-black'>Upcoming</p>
                  <p className='text-gray-400'>Past</p>
                  <p className='text-gray-400'>Canceled</p>
                </div>
            </div>
            {
               bookings.length > 0 ?
               bookings.map((booking: { id: Key | null | undefined; event_date: string | number | Date; from: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; duration: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; guest: { email: any; names:any }[]; event: { title: boolean | ReactChild | ReactFragment | ReactPortal | null | undefined; }; })=>{
                return(
                    <div key={booking.id} className='p-12 pt-8 mt-8 bg-white border border-gray-300 rounded-sm'>
                    <div className='flex justify-between'>
                        <div className='flex gap-8'>
                            <div className='flex flex-col'>
                                <span className='text-sm font-semibold'>{booking.event_date}</span>
                                <span className='text-sm text-gray-700'>{booking.from}</span>
                            </div>
                            <div className='flex flex-col'>
                                <span className='font-semibold'>{booking.duration} Min Meeting between {session?.user?.name} {booking?.guest[0] ? `and ${booking?.guest[0].names}` : ""}</span>
                                <span className='text-sm text-gray-700'>{booking.event.title}</span>
                                {booking.guest[0] && <span className='text-sm text-black'>{booking?.guest[0].email}</span>}
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className=''>
                            <button className='border '>
                                <div className='flex items-center justify-center gap-2 px-2 py-2'>
                                <IoIosAlarm className='text-lg font-bold'/>
                                <span className='font-semibold'>Reschedule</span>
                                </div>
                            </button>
                            <button className='border'>
                                <div className='flex items-center justify-center gap-2 px-2 py-2 '>
                                <IoIosClose className='text-lg font-bold'/>
                                <span className='font-semibold'>Cancel</span>
                                </div>
                            </button>
                            </div>
                        </div>
                    </div>
        </div>
                )
            })
               :
               <div className='flex justify-center p-4 bg-white'>
                        <span className='text-lg font-bold text-red-600'>Dear {session?.user?.name} you have no bookings yet</span>
               </div>
            }
         </div>
      </div>
    </Shell>
  );
}
