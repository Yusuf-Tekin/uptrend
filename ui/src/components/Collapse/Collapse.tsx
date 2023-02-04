


import React from 'react'


interface ICollapse {
    children?:JSX.Element,
    isOpen:boolean
}

const Collapse:React.FC<ICollapse> = ({children,isOpen}) => {
  return (
    <div className={`py-4 ${isOpen ? 'block' :'hidden'} transition-all origin-top`}>
        {children}
    </div>
  )
}

export default Collapse