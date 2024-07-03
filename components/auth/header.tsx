import React from 'react'
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface Headerprops{
label:string;

}


const Header = ({
    label
  }: Headerprops
) => {
  return (
    <div className={cn('w-full flex flex-col gap-y-4 items-center justify-center',font.className)}>
        <h1
          className={cn(
            "text-6xl font-semibold ",
            font.className
          )}
        >
          AUTH
        </h1>
        <p>{label}</p>
    </div>
  )
}

export default Header
