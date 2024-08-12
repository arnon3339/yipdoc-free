import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import AdminForm from "./AdminForm";
import ClietForm from "./ClientForm";
import LoginForm from "./LoginForm";

export default async function TopBar({children})
{
  const session = await getServerSession(authOptions)

  if (!session)
    return (
    <LoginForm>
      {children}
      </LoginForm>
      )
  else if (session.user.role == "ADMIN")
    return (
    <AdminForm  session={session}>
      {children}
    </AdminForm>
    )
  else
    return (
    <ClietForm  session={session}>
      {children}
      </ClietForm>
    )

}