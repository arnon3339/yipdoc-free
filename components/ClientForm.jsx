"use client";

import { signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import HomeButton from "./HomeButton";
import { usePathname } from "next/navigation";


export default function ClietForm({children, session}) {

  const router = useRouter()
  const pathname = usePathname()

  if (!session)
    redirect("/")

  return (
    <div className="h-full w-full">
       <div className='top-0 sticky bg-gray-300 bg-opacity-80 w-full text-center py-2 z-50 animate-fade-in05s'>
        <label className="absolute left-4 top-2 text-4xl">
          <HomeButton />
          </label>
      <button className='border border-gray-400 text-xl rounded-md bg-gradient-to-r bg-white
           text-black p-1  hover:border-gray-800' onClick={() => 
           {
            if (pathname == "/submit")
              window.open("/submit?edit=false")
              // router.replace("/submit?edit=false")
            else
              router.push("/submit?edit=false")
            }}>
        New
      </button>
      <button className='border border-gray-400 text-xl rounded-md bg-gradient-to-r mx-2 bg-white
          text-red-800 p-1  hover:border-gray-800' onClick={(async () => {
            await signOut({redirect: false})
              router.refresh()
            })}>
          Logout
      </button> 
        <div className="inline-block bg-black absolute right-10 top-2 font-bold text-xl text-black max-md:w-0">
          <div className="relative">
            <div className="absolute -left-64 visible w-72 truncate max-md:invisible max-md:w-0">
              User:<span className="font-normal"> {session.user.name}</span>
            </div>
            <div className="block bg-white w-10 h-10 text-2xl pt-1 rounded-full invisible absolute top-0 right-0 max-md:visible">
              {session?.user?.name.slice(0, 1).toUpperCase()}
            </div>
          </div>
          </div>
    </div> 
    {children}
    </div>
  );
}
