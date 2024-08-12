import RegisterForm from "@/components/RegisterForm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";


export const metadata = {
  title: "Admin - User registration",
};

export default async function Register() {

  const session = await getServerSession(authOptions)
  if (session && session.user.role == "ADMIN")
    return (
      <div className="absolute top-0 left-0 w-full h-full">
        <RegisterForm />
      </div>
    )
  
  redirect("/")

}
