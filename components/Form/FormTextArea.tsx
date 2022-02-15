import React from 'react'


export default function FormTextArea({label , value,onChange,...otherProps}:Iprops['TextArea']) {
    return (
      <div className='mt-4 mb-4'>
          <div className='flex justify-between'>
          {label && <label htmlFor="" className='font-bold'>{label}</label>}
      </div>
      <div>
        <textarea
         className='px-2 py-2 text-sm border border-gray-300 rounded-sm w-96 focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500'
         value={value}
         onChange={onChange}
         />  
                                     
      </div>
      </div>
    )
}
interface Iprops {
    TextArea:{
        label:string,
        value:string,
        onChange:any
    }
}