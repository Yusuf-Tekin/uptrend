import React from 'react'
import { LayoutInterface } from '../types/global'


const Default: React.FC<LayoutInterface> = ({children}) => {
  return (
    <React.Fragment>
        {children}
    </React.Fragment>
  )
}

export default Default