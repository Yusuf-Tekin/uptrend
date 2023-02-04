


import React from 'react'

interface IProps {

    bgColor?:string | any;
    textColor?:string | any;
    text:string;
    customClass?:string;
}


const Badge:React.FC<IProps> = ({textColor,bgColor,text,customClass}) => {

  return (
    <div className={`text-xs p-1 px-2 rounded-md ${customClass} ${textColor} ${bgColor}`} title="Role">
        {text}
    </div>
  )
}

export default Badge