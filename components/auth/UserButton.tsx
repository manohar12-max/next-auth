"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { FaUser } from 'react-icons/fa'
import useCurrentUser from "@/hooks/useCurrentUser";
import LogoutButton from './LogoutButton'
import { ExitIcon } from '@radix-ui/react-icons'

const UserButton = () => {
    const user=useCurrentUser()
  return (
    <DropdownMenu>
        <DropdownMenuTrigger>
             <Avatar>
                <AvatarImage src={user?.image || undefined}/>
                <AvatarFallback className='bg-sky-500'>
                    <FaUser className='text-white'/>
                </AvatarFallback>
             </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-40' align='end'>
            <LogoutButton>
                <DropdownMenuItem>
                   <ExitIcon className='w-4 h-4 mr-2'/> Logout
                </DropdownMenuItem>
            </LogoutButton>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserButton
