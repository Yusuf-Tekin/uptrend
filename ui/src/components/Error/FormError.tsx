


import React from 'react'

interface IProps {
    message:string;
}

const FormError:React.FC<IProps> = ({message}) => {
  return (
    <span className='px-2 py-1 rounded-md bg-red-500 text-white text-xs animate-bounce'>
        {message}
    </span>
  )
}

export default FormError