"use client";

import { DoubleArrowUpIcon } from "@radix-ui/react-icons"
import { useState, useEffect } from "react";

export default function ToTopButton({children}) {
  const [visible, setVisible] = useState(false) 
  const [scrollTop, setScrollTop] = useState("")
  useEffect(() => {
   const handleScroll = event => {
      if (event.currentTarget.scrollY > 200){ 
        setVisible(true) 
      }  
      else if (event.currentTarget.scrollY <= 200){ 
        setVisible(false) 
      } 

    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll)
    
  }, [])


  return (
    <div className="relative">
      <div className="absolute top-0 right-2 block w-14 h-full max-sm:right-0">
        <div className={`sticky top-[90vh] right-0 block h-12 w-12 
         bg-gray-400 rounded-full opacity-50 ${visible? "visible": "invisible"}`}>
        <button className="h-full w-full block px-2 opacity-100" onClick={(e) => {
          e.preventDefault()
          window.scrollTo({top: 0, left: 0, behavior: 'smooth'})
        }}>
          <DoubleArrowUpIcon width={30} height={30}></DoubleArrowUpIcon>
        </button>
          <h1>{scrollTop}</h1>
        </div>
      </div>
      {children}
    </div>
  )
};
