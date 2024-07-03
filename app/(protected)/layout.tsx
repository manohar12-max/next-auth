
import React from 'react'
import Navbar from './_components/Navbar';

const Protectedlayout = ({
    children
}:{children:React.ReactNode}) => {
    return (
        <div
          className='h-full w-full flex flex-col items-center justify-center gap-y-2
        bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800'
        >
          <Navbar/>
          {children}
        </div>
      );
}

export default Protectedlayout
