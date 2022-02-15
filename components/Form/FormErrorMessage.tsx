import React from 'react'
import {IoClose} from 'react-icons/io5'

export default function FormErrorMessage({onHide , errorMessage}:Iprops['formError']) {
    return (
        <div className='flex justify-around p-2 bg-red-600 rounded-sm'>
                <span className='font-extrabold text-white'>{errorMessage}</span>
                <IoClose onClick={()=>onHide()} className='my-1 font-bold text-white' />
        </div>
    )
}

interface Iprops{
    formError:{
        errorMessage:string,
        onHide:Function
    }
}