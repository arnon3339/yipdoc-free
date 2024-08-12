import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import SubmitForm from "@/components/SubmitForm"


export const metadata = {
  title: "Document submission",
};

async function getData({edit, docid}){
  if (edit == "false")
    return {
        data: {
          userName: null,
          date: "",
          topic: "",
          name: "",
          description: "",
          urFiles: [],
          reFiles: [],
          status: "QUEUE"
        }
      } 
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/editor?docid=${docid}`,
      {
        method: "GET",
        next: {
          revalidate: 0,
          cache: "no-store" | "force-cache",
        }
      })
    const resData = await res.json()
    if (res.ok)
    {
      return {
        data: {
          userName: resData.document.user_name,
          date: resData.document.date,
          topic: resData.document.topic,
          name: resData.document.name,
          description: resData.document.description,
          urFiles: resData.files.filter(value => value["role"] == 'CLIENT')
            .map((elem) => 
              ({
                pathname: elem.pathname,
                url: elem.url
              })
            )?? [],
          reFiles: resData.files.filter(value => value["role"] == 'ADMIN')
            .map((elem) => 
              ({
                pathname: elem.pathname,
                url: elem.url
              })
            )?? [],
          status: resData.document.status
      }
    }
  }
  } catch (error) {
    console.log(error)  
  }
  return {
        data: {
          userName: null,
          date: "",
          topic: "",
          name: "",
          description: "",
          urFiles: [],
          reFiles: [],
          status: "QUEUE"
        }
      } 
}

export default async function Page({params, searchParams}) {

  const session = await getServerSession(authOptions)
  const {edit, docid} = await searchParams
  if (!session)
    redirect("/")
  else if (session.user.role == "admin" && edit == "false")
    redirect("/")
  const {data} = await getData({edit, docid})
  return (
      <SubmitForm session={session} edit={edit} theData={{
          date: data.date,
          topic: data.topic,
          name: data.name,
          description: data.description,
          userName: data.userName
        }}
        urfiles={data.urFiles} refiles={data.reFiles} status={data.status}
        docid={docid}/>
          )

};
