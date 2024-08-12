"use client";

import { useContext} from "react";
import { TableContext, TABLE_ACTION } from "@/providers/table/page";
import { useRouter } from "next/navigation";

export default function NavagatorPage({numdoc, page})
{
  const router = useRouter()
  const {tableState, tableDispatch} = useContext(TableContext)
  const numClasses = "border-2 border-gray-500 pt-1 text-center w-12 h-10 rounded-xl m-1 hover:cursor-pointer\
   hover:shadow-sm hover:shadow-gray-600 max-sm:h-8 max-sm:w-8 max-sm:text-sm"

  
  const calUI = () => {
    const numPage = Math.ceil(numdoc/20)
    let pageArr;
    let pageSkip = [-1, -1]

    if (numPage < 11)
    {
      pageArr = Array.from({length: numPage}).map((elem, index) => index)
    }
    else
    {
      if (page < 4)
      {
        pageArr = [0, 1, 2, 3, 4, 5, numPage - 2, numPage -1]
        pageSkip = [5, -1]
      }
      else if (page > numPage - 5)
      {
        pageArr = [0, 1, numPage - 6, numPage - 5, numPage - 4, numPage - 3, numPage - 2, numPage - 1]
        pageSkip = [-1, numPage - 6]
      }
      else
      {
        pageArr = [0]
        pageArr.push(...Array.from({length: 7}).map((_, index) => (page + (index - 3))))
        pageArr.push(numPage - 1)
        pageSkip = [page - 3, page + 3]
      }
    }

    return (<ul className="flex flex-row justify-center">
      {
        pageArr.map((elem, index) => 
        {
          if (elem == page)
          {
            return (
              <li className={`bg-gray-800 text-white ${numClasses}`} key={`page-${elem}`} value={elem} onClick={handleSelectNum}>
                {elem + 1}
              </li>
              )
          }
          else if (pageSkip.includes(elem))
          {
            return (
              <li className={`${numClasses}`} key={`page-${elem}`} value={elem} onClick={handleSelectNum}>
                ...
              </li>
              )
          }
          else
          {
            return (
              <li className={`${numClasses}`} key={`page-${elem}`} value={elem} onClick={handleSelectNum}>
                {elem + 1}
              </li>
              )
          }
        })}
    </ul>)
  }

  const handleSelectNum = (e) => {
    e.preventDefault()
    router.replace(`/?filter=\
${tableState.filter}&date=${tableState.sort.date}&topic=${tableState.sort.topic}&name=${tableState.sort.name}\
&status=${tableState.sort.status}&search=${tableState.search}&page=${e.target.value}`)
    tableDispatch({type: TABLE_ACTION.page, playload: e.target.value})
  }
  return (
    calUI()
  )
}