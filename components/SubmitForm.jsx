"use client";

import {  useRouter } from "next/navigation"
import { useState, useRef } from "react";
import moment from "moment-timezone";
import UploadButtons from "./UploadButtons";
import { ErrAlert, CompAlert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, BookmarkX, CheckCircle} from "lucide-react"
import { Select,  
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue, } from "./ui/select";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function SubmitForm({
  session, edit, theData, urfiles, refiles, status, docid
})
{
  const router = useRouter()
  const refName = useRef()
  const refTopic = useRef()
  const refDesc = useRef()

  const [resText, setResText] = useState("")
  const [data, setData] = useState(theData)
  const [selectedData, setSelectedData] = useState(status)
  const [urFiles, setUrFiles] = useState(urfiles)
  const [reFiles, setReFiles] = useState(refiles)
  const [alertData, setAlertData] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState(
      session?.user?.role == "ADMIN"?
      Array.from({length: refiles?.length}):
      Array.from({length: urfiles?.length})
    )
  const [delFiles, setDelFiles] = useState([])
  const [disSubmit, setDisSubmit] = useState(0)

  const colorSelected = {"QUEUE": "bg-red-300", "INPROCESS":"bg-yellow-300", "COMPLETE":"bg-green-300"}
  const inputClassnames = "px-2 ml-10 w-[740px] max-lg:w-[500px] max-md:w-[320px] max-sm:ml-14 max-sm:w-4/6"
  const textAreaClassnames = "px-2 ml-2 w-[740px] max-lg:w-[500px] max-md:w-[320px] max-md:ml-2 max-sm:ml-6 max-sm:w-4/6"
  const handleFileUpload = ({file}) => {
    setAlertData(0)
    setResText("")
    if (!file)
    {
      setResText("Fail to read file!!!")
    }
    else if (file.size/10**6 > 1)
    {
      setResText("File is larger than 1 MB!!!")
      setAlertData(-1)
    }
    else
    {
      if (session.user.role == "ADMIN")
        setReFiles([...reFiles, {date: new Date(), pathname: file.name, url: ""}])
      else
        setUrFiles([...urFiles, {date: new Date(), pathname: file.name, url: ""}])
      setSelectedFiles([...selectedFiles, {date: new Date(), pathname: file.name, url: "", file: file}])
    }
  }

  const handleRemvFile = (remvIndex) => {
    setAlertData(0)
    setResText("")
    let newSelectedFiles = []
    let newUrFiles = []
    let newReFiels = []

    if (!(selectedFiles[remvIndex]))
    {
      if (session.user.role == "ADMIN")
        setDelFiles([...delFiles, reFiles[remvIndex]])
      else
        setDelFiles([...delFiles, urFiles[remvIndex]])
    }
    selectedFiles.forEach((elem, index) => {
        if (index != remvIndex)
          newSelectedFiles.push(elem)
        })

    setSelectedFiles(newSelectedFiles)

    if (session.user.role == "ADMIN")
    {
      reFiles.forEach((elem, index) => {
        if (index != remvIndex)
          newReFiels.push(elem)
        })
      setReFiles(newReFiels)
    }
    else
    {
      urFiles.forEach((elem, index) => {
        if (index != remvIndex)
          newUrFiles.push(elem)
        })
      setUrFiles(newUrFiles)
    }
  }

  const handleSetAlertData = (value) => {
    setAlertData(value)
  }

  const handleSetAlertText = (value) => {
    setResText(value)
  }

  return (
    <div className="relative w-full h-full pt-10">
      <div className="text-left w-full h-full relative">
        <div className="w-full max-sm:text-center">
          {edit == "true" && session && session.user.role == "ADMIN" &&
            <div className={`mt-10 ml-60 w-40 text-2xl text-center border border-gray-600 rounded-md 
              max-sm:ml-[30%] ${colorSelected[selectedData]} max-sm:w-30 max-sm:text-xl`}>
              <Select defaultValue={selectedData}
                  onValueChange={(value) => 
                  {
                    setSelectedData(value)
                    }}
                    >
                <SelectTrigger className={`${colorSelected[selectedData]}`}>
                <SelectValue placeholder={selectedData} />
                </SelectTrigger>
                <SelectContent className="border-2 border-black">
                  <SelectGroup>
                    <SelectItem value={"QUEUE"}>QUEUE</SelectItem>
                    <SelectItem value={"INPROCESS"}>INPROCESS</SelectItem>
                    <SelectItem value={"COMPLETE"}>COMPLETE</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          }
          {edit == "true" && session && session.user.role != "ADMIN" &&
            <div className={`mt-10 ml-60 w-40 text-2xl text-center border border-gray-600 rounded-md 
              max-sm:ml-[30%] ${colorSelected[selectedData]} max-sm:w-30 max-sm:text-xl`}>
              <Select>
                <SelectTrigger className={`${colorSelected[selectedData]}`} disabled>
                <SelectValue placeholder={status} />
                </SelectTrigger>
                <SelectContent>
                </SelectContent>
              </Select>
            </div>
        }
        </div>
        <br></br>
        <br></br>
       <div>
          <form className="text-left h-full w-full z-10 pl-20 max-sm:pl-1 overflow-hidden " 
          onSubmit={async (e) => 
            {
              setDisSubmit(-1)
              e.preventDefault()
              
              try {
                router.prefetch('/')
                const blobs = []
                try {
                  await Promise.all(selectedFiles.filter((e) => e).map(async (element) => {
                    const response = await fetch(
                      `/api/upload?filename=${element.pathname}`,
                      {
                        method: 'POST',
                        body: element.file,
                      }
                    )
                    const newBlob = await response.json()
                    blobs.push(newBlob)
                  }))
                } catch (error) {
                  setAlertData(-1)  
                  setResText("Fail to upload files.")
                  throw new Error("Fail to upload files.")
                }

                const res = await fetch("api/submission", {
                  method: "POST",
                  headers: {"Content-Type": "application/json"},
                  body: JSON.stringify({
                    admin: session.user.role == "ADMIN",
                    adminName: session.user.role == "ADMIN"? session.user.name: null,
                    docid: docid,
                    content: {
                      userName: data?.userName ?? session.user.name,
                      date: new Date(data.date),
                      topic: refTopic?.current?.value?? data.topic,
                      name: refName?.current?.value?? data.name,
                      description: refDesc?.current?.value?? data.description,
                      status: (session.user.role == "ADMIN")? selectedData: status,
                      lastUpdate: session.user.role == "ADMIN" || edit == "false"? new Date(Date.now()):
                        new Date(data.date)
                    },
                    file: {
                      del: delFiles,
                      blobs
                    }
                  })
                })

                if (res.ok){
                  setAlertData(1)
                  setResText("Your work was successfully submited.")
                  setDisSubmit(1)
                }
                else{
                  const resJson = await res.json()
                  setAlertData(-1)
                  setResText(resJson.error)
                  setDisSubmit(0)
                }
              } catch (error) {
                console.error(error) 
                console.log(error)
                setDisSubmit(0)
              }
            } 
                }>
               <label className=" font-bold text-xl">
                Date:
              </label>
              {edit == "true" && session && 
                <label className="ml-12 text-xl max-sm:ml-6">{moment.tz(data?.date, 'Asia/Bangkok').format('LLLL')}</label>
              }
              {!(edit == "true") && session &&
                <label className="ml-12 max-sm:ml-6">{moment.tz(new Date(), 'Asia/Bangkok').format('LLLL')}</label>
              }
              <br></br>
              <br></br>
              <label className="font-bold text-xl inline-block w-16">
                Topic: 
              </label>
              {edit == "true" && session &&
                <label className="ml-10 font-bold text-2xl max-sm:ml-4
                w-[740px] max-lg:w-[500px] max-md:w-[320px] max-sm:w-4/6">{data?.topic}</label>
              }
              {!(edit == "true") && session &&
                <input type="text" name="topic" id="topic" className={`text-2xl border border-gray-500 rounded-md 
                 ${inputClassnames}`}
                defaultValue={data?.topic?? ""} ref={refTopic}
                onChange={(e) => 
                  {
                    setAlertData(0)
                  }}
                  />
              }
              <br></br>  
              <br></br>
              <label className="font-bold text-xl inline-block w-16">
                Name: 
              </label>
              {edit == "true" && session &&
                <label className="ml-10 text-2xl max-sm:ml-4 
                w-[740px] max-lg:w-[500px] max-md:w-[320px] max-sm:w-4/6">{data?.name}</label>
              }
              {!(edit == "true") && session &&
                <input defaultValue={data?.name} ref={refName} type="text" id="name" name="name" className={`text-2xl border border-gray-500 rounded-md 
                ${inputClassnames} }`} 
                onChange={(e) => 
                  {
                    setAlertData(0)
                  }}
                />
              }
              <br></br>
              <br></br>
              <label className="font-bold text-center ">
                Description: 
              </label>
              <textarea name="desc" className= {`h-72 border border-gray-500 rounded-md  
              ${textAreaClassnames}`} defaultValue={data?.description} ref={refDesc}
                onChange={(e) => 
                  {
                    setAlertData(0)
                  }}
              ></textarea>
              <br></br>
              <br></br>
               <label className="font-bold inline-block w-[90px] align-top">
                Your link:
              </label>
              {
                (edit == "true") && session && session.user.role == "ADMIN" &&
                
                  <UploadButtons onFileUpload={handleFileUpload} onRemvFile={handleRemvFile}
                    files={urFiles} edit={false} upload={false}/>
              }
              {
                (edit == "true") && session && session.user.role != "ADMIN" &&
                  <UploadButtons onFileUpload={handleFileUpload} onRemvFile={handleRemvFile}
                    files={urFiles} edit={true} upload={true}/>
                
              }
              {
                !(edit == "true") && session &&
                  <UploadButtons onFileUpload={handleFileUpload} onRemvFile={handleRemvFile}
                    files={urFiles} edit={true} upload={true}/>
              }
              <br></br>
              <br></br>
             {
                (edit == "true") && session &&
                <label className="font-bold align-top">
                  Replied link: 
                </label>
              }
             {
                edit == "true" && session && session.user.role == "ADMIN" &&
                  <UploadButtons onFileUpload={handleFileUpload} onRemvFile={handleRemvFile}
                    files={reFiles} edit={true} upload={true}/>
              }
              {
                edit == "true" && session && session.user.role != "ADMIN" &&
                  <UploadButtons onFileUpload={handleFileUpload} onRemvFile={handleRemvFile}
                    files={reFiles} edit={false} upload={false}/>
              }
              <br></br>
              <br></br>
                {
                disSubmit == 0 &&
                <div className="w-full max-sm:text-center">
                  <input type="submit" value={`Send`} className="bg-green-400 ml-32 w-64 rounded-lg border 
                  border-gray-400 leading-10 hover:cursor-pointer hover:shadow-sm hover:shadow-black max-sm:w-28 max-sm:m-auto"/>
                </div>
                }
                {
                disSubmit == -1 &&
                <div className="w-full max-sm:text-center">
                      <div className="ml-96 w-64 max-lg:ml-52 text-2xl text-green-700
                   leading-10 cursor-default hover:shadow-sm  max-sm:w-28 max-sm:m-auto">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin inline-block" />
                      <span>Please wait</span>
                    </div>
                </div>
                }
              <br></br>
              <br></br>
              {
                alertData == -1 &&
                <div className={`absolute left-0 top-0 h-full w-full text-center`} >
                  <div className={`sticky pl-4 max-sm:px-2 top-[calc(35dvh)]`} onClick={() => setAlertData(0)}>
                  <ErrAlert variant="destructive">
                    <div className="flex-1 text-left ml-16 max-sm:ml-4 max-sm:text-center">
                      <div className="inline-block max-sm:flex justify-center">
                        <AlertCircle className="h-16 w-16 text-center 
                        " />
                      </div>
                      <div className="inline-block text-left max-sm:text-center">
                        <AlertTitle className="text-4xl">Error</AlertTitle>
                        <AlertDescription className="text-xl">
                          {resText}
                        </AlertDescription>
                      </div>
                      </div>
                      <div className="flex-4 h-[100%]">
                        <BookmarkX variant="destructive" className="h-10 w-10 max-sm:h-6 max-sm:w-6"></BookmarkX>
                      </div>
                  </ErrAlert>
                  </div>
                </div>
              }
              <br></br>
              <br></br>
          </form>
      </div>
      {
        alertData == 1 &&
          <div className={`absolute left-0 top-0 h-full w-full text-center z-50`} >
            <div className={`sticky pl-4 max-sm:px-2 top-[calc(35dvh)]`} onClick={() => 
              {
                router.replace("/")
                router.refresh()
                setAlertData(0)
              }
              }>
                  <CompAlert variant="destructive">
                    <div className="flex-1 text-left ml-16 max-sm:ml-4 max-sm:text-center">
                      <div className="inline-block max-sm:flex justify-center">
                        <CheckCircle className="h-16 w-16 text-center 
                        " />
                      </div>
                      <div className="inline-block text-left max-sm:text-center">
                        <AlertTitle className="text-4xl">Complete</AlertTitle>
                        <AlertDescription className="text-xl">
                          {resText}
                        </AlertDescription>
                      </div>
                      </div>
                      <div className="flex-4 h-[100%]">
                        <BookmarkX variant="destructive" className="h-10 w-10 max-sm:h-6 max-sm:w-6"></BookmarkX>
                      </div>
                  </CompAlert>
            </div>
          </div>
      } 
    </div>
        {disSubmit == -1? <div className="block absolute top-0 left-0 h-full w-full z-20"></div>: null}
    </div>
  )
}