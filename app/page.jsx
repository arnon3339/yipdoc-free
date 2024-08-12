import Loading from "@/components/Loading";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import moment from "moment-timezone";
import Link from "next/link";
import NavagatorPage from "@/components/Navigator";
import { Suspense } from "react";
import TableComponents from "@/components/TableComponents";
import ToTopButton from "@/components/ToTopButton";

export const metadata = {
  title: "Home - Document table",
};

async function getData({selected, sortdata, searchData, page}){
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/database/?filter=\
${selected}&date=${sortdata[0]}&topic=${sortdata[1]}&name=${sortdata[2]}&status=${sortdata[3]}&search=${searchData}&page=${page}`, 
    {
      method: 'GET',
      next: {
        revalidate: 0,
        cache: "no-store" | "force-chache", 
      }
    })
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const result = await response.json()
    return {data: result.contents.documents, count: result.contents.count}
  } catch (error) {
    console.error('Error fetching data:', error)
  } 
  return {data: null, count: 0}
}

export default async function Page({params, searchParams}) {
  const yourClassname = "border-gray-800 shadow-md shadow-gray-400 cursor-pointer hover:shadow-md"
  const otherClassname = "border-gray-400"
  const statusProps = {
    "QUEUE": {
      hover: "hover:shadow-red-400",
      color: "text-red-800"
    }, 
    "INPROCESS":{
      hover: "hover:shadow-red-400",
      color: "text-yellow-800"
    }, 
    "COMPLETE":{
      hover: "hover:shadow-red-400",
      color: "text-green-800"
    }, 
  }

  const {
    filter,
    date,
    topic,
    name,
    status,
    search,
    page
  } = await searchParams

  const {data, count} = await getData({selected: filter?? 0, sortdata: [date?? 1, topic?? -1, name?? -1, status?? -1], 
    searchData: search?? "", page: page?? 0})

  const session = await getServerSession(authOptions)
  return (
      <div className="w-full h-full pt-10">
        <ToTopButton>
      <TableComponents filter={filter?? 0} search={search?? ""}
        sort={{date: date?? 1, topic: topic?? -1, name: name?? -1, status: status?? -1}}/>
      <div className="flex justify-center mt-5 w-full">
        <ul className="text-center w-3/4">
            {data?.map((element, index) => {
              const theChildren = 
                      <div key={`wrap-${index}`} className={`flex flex-col justify-center border-2 text-left 
                        w-full px-4 rounded-md h-[120px]  max-sm:h-[200px] ${((session && element.user_name == session.user.name) || 
                  (session && session.user.role) == "ADMIN")? `${yourClassname} ${statusProps[element.status].hover}`: otherClassname}`}>
                        <div className="flex flex-row justify-start items-center  text-left max-sm:flex-col 
                          max-sm:justify-center max-sm:items-center  max-sm:py-4 max-sm:text-center max-sm:h-full" key={`wrap2-${index}`}>
                          <div className="flex-[1] " key={`date-${index}`}>
                          {moment.tz(element.date, 'Asia/Bangkok').format('L')}
                          </div>
                          <div className="font-bold w-full flex-[3] line-clamp-2 pl-2 max-sm:pl-0 max-sm:max-h-[50px]" key={`topic-${index}`}>
                            {element.topic}
                          </div>
                          <div className="flex-[2] pl-2 w-full line-clamp-2 max-sm:pl-0 max-sm:max-h-[50px]" key={`name-${index}`}>
                          {element.name}
                          </div>
                          <div className={`flex-[1] text-right max-sm:text-center ${statusProps[element.status].color}`} key={`decs-${index}`}>
                            {element.status}
                      </div>
                    </div>
                    </div>
              return ((session && element.user_name == session.user.name) || 
                  (session && session.user.role) == "ADMIN")?(

                <li className="mt-2 " key={`il-${index}`} >
                  <Link key={`Link-${index}`} href={`${process.env.NEXTAUTH_URL}/submit?edit=true&docid=${element._id}`}
                      >
                    {theChildren}
                  </Link>
                </li>): 
                (<li className="mt-2 " key={`il-${index}`} >
                  <div key={`nonLink-${index}`}>
                    {theChildren}
                  </div>
                  </li>
                  )
            })
          } 
        </ul>
      </div>
      </ToTopButton>
      <NavagatorPage numdoc={count} page={page?? 0}/>
    </div>
  )
};
