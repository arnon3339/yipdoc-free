"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


export default function LoginForm({children}) {
  const passwordRef = useRef()
  const nameRef = useRef()
  const pathname = usePathname()
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await signIn("credentials", {
        name: nameRef.current.value.toLowerCase(),
        password: passwordRef.current.value,
        redirect: false,
      });
      if (res.error) {
        setError("Invalid Credentials");
        return;
      }
      router.refresh()
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full w-full">
    <div className="top-0 sticky bg-gray-300 bg-opacity-80 w-full text-center py-2 z-50 animate-fade-in05s">
      <form className='flex flex-row justify-center items-center align-middle top-0 sticky  w-full
        p-1 z-50 max-sm:flex-col animate-fade-in1s' onSubmit={handleSubmit}>
        <label className="absolute left-4 top-2 text-4xl max-sm:invisible"></label>
          <input className="border border-gray-400 rounded py-2 px-3 text-gray-700 w-52 m-2 max-sm:w-3/4
          leading-tight bg-gray-200 focus:outline-none focus:shadow-outline focus:bg-white" 
          id="username" type="text" placeholder="Username" ref={nameRef}/>
          <input className="border border-gray-400 rounded py-2 px-3 text-gray-700 w-52 m-2 max-sm:w-3/4
          leading-tight bg-gray-200 focus:outline-none focus:shadow-outline focus:bg-white" 
          id="password" type="password" placeholder="password" ref={passwordRef}/>
          <button className='border border-gray-400 text-xl rounded-md bg-gradient-to-r bg-white
            text-green-800 p-1  hover:border-gray-800 h-1/2'>
              Login
          </button>
        </form>
      </div>
    {children}
    </div>
  );
}
