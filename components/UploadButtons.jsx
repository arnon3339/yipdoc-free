"use client";

import Link from "next/link";

export default function UploadButtons(props)
{

  const removeFileList = (e) => {
    e.preventDefault()
    props.onRemvFile(e.target.value)
  }

  const handleFileSelect = (e) => {
    e.preventDefault()
    const selectedFile = e.target.files[0] 
    props.onFileUpload({date: new Date(), file: selectedFile})
    e.target.value = ""
}
  return (
    <div className="ml-2 w-[500px] inline-block truncate -mt-2 max-sm:w-60">
      {
        props?.files?.length > 0 &&
        props?.files?.map((elem, index) =>{
          if (elem.url != "")
            return (
          <div className="flex flex-row justify-start text-blue-800 align-middle
           " key={`wrapfilebtn-${index}`}>
            <Link key={`refile-${index}`} className="italic text-decoration-line: underline
             py-2 max-w-[400px] hover:cursor-pointer truncate hover:text-blue-800 max-sm:truncate max-sm:w-56" href={elem.url} >
              {`${index + 1}. ${elem.pathname}`}&nbsp; 
            </Link>
            { props?.edit &&
            <button className="block ml-4 mt-1 border-2 border-gray-800 hover:font-bold hover:text-xl
            text-sm w-8 h-8 rounded-full max-sm:min-w-[32px] hover:text-red-800" value={index} key={`refilebtn-${index}`} 
            type="button" onClick={removeFileList}>X</button>
          }
          </div>
          )
          else
            return (
          <div className="flex flex-row justify-start align-middle
           " key={`wrapfilebtn-${index}`}>
            <div key={`refile-${index}`} className="block italic
             py-2 max-w-[400px] truncate max-sm:w-56 max-sm:truncate">
              {`${index + 1}. ${elem.pathname}`}&nbsp; 
            </div>
            { props?.edit &&
            <button className="block ml-4 mt-1 border-2 border-gray-800 hover:font-bold hover:text-xl
            text-sm w-8 h-8 rounded-full max-sm:min-w-[32px] hover:text-red-800" value={index} key={`refilebtn-${index}`} 
            type="button" onClick={removeFileList}>X</button>
            }
          </div>
          )

        })
      }
      {
        !(props.files?.length > 4) && props.upload &&
         <label className={`inline-block mt-4 p-2 cursor-pointer bg-gray-400
           border border-gray-800 rounded-md text-black }`}>
         <span> + Choose File </span>
          <input type="file" id="fileInput0" key="input-0" name="input-0" className="hidden" onChange={handleFileSelect}/>
         </label>
      }
    </div>
    )
  
}