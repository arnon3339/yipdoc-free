"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState([""])
  const passwordRef = useRef()
  const roleRef = useRef()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !passwordRef.current.value) {
      setError("All fields are necessary.");
      return;
    }
    try {
      const resUserExists = await fetch(`api/register?name=${name.toLowerCase()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.toLowerCase(),
          role: roleRef.current.value,
          password: passwordRef.current.value,
        }),
      });

      if (res.ok) {
        const form = e.target;
        setSuccess(true)
        setError("")
        form.reset();
        // router.replace("/");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="block w-full h-full">
    <div className="flex flex-row h-full w-full justify-center align-middle">
      <div className="flex flex-col h-full w-full items-center justify-center">
        <div className="shadow-lg w-96 p-5 rounded-lg border-t-4 border-green-400">
          <h1 className="text-xl font-bold my-4">Register</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => {
                e.preventDefault()
                setError("")
                setSuccess(false)
                setName(e.target.value)
              }}
            />
            <select className="border border-gray-500" ref={roleRef}>
              <option value={"CLIENT"}>User</option>
              <option value={"ADMIN"}>Admin</option>
            </select>
            <input
              ref={passwordRef}
              type="text"
              placeholder="Password"
            />
            <button className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
              Register
            </button>

            {error && !success&& (
              <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                {error}
              </div>
            )}
            {!error && success&& (
              <div className="bg-green-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                Successfully registered. 
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
    </div>
  );
}
