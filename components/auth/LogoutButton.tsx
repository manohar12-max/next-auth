"use client"

import { signOut } from 'next-auth/react'
import React from 'react'

const LogoutButton = ({children}:{children?:React.ReactNode}) => {
  const onClick = () => {
    signOut()
  }
  return (
   <span className='cursor-pointer'  onClick={onClick}>{children}</span>
  )
}

export default LogoutButton
