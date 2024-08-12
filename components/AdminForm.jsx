"use client";

import { signOut } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import HomeButton from "./HomeButton";

export default function AdminForm({children, session}) {

  const router = useRouter()

  const registerUser = () => {
    router.push("register")
  }

  if (!session)
    redirect("/")

  return (
    <div className="h-full w-full">
      <div className='sticky bg-gray-300 bg-opacity-80 w-full top-0 text-center py-2 z-50 animate-fade-in05s'>
        <label className="absolute left-4 top-2 text-4xl">
          <HomeButton />
          </label>
        <button className='border border-gray-400 text-xl rounded-md bg-gradient-to-r inline-block
            text-black p-1  hover:border-gray-800' onClick={registerUser}>
         Register 
        </button>
        <button className='border border-gray-400 text-xl rounded-md bg-gradient-to-r mx-2 inline-block
            text-red-800 p-1  hover:border-gray-800' onClick={(async () => {
              await signOut({redirect: false})
              router.refresh()
              router.replace("/")
              })}>
            Logout
        </button>
        <div className="inline-block absolute right-10 top-2 font-bold text-xl text-green-800 max-md:w-0">
          <div className="relative">
            <div className="absolute -left-64 visible w-72 truncate max-md:invisible">
              Admin:<span className="font-normal"> {session.user.name}</span>
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
