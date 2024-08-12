"use client"

import parse from "html-react-parser"
import SearchComponent from "./SearchForm"
import { useContext } from "react"
import { TableContext, TABLE_ACTION } from "@/providers/table/page"
import { useRouter } from "next/navigation"
import { Select,   
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue, } from "./ui/select"

export default function TableComponents({
  filter, sort, page, search
})
{
  // Context provider
  const {tableState, tableDispatch} = useContext(TableContext)
  const router = useRouter()

  const sortSymbols = ["", "&#9660;", "&#9650;"]

  return (
    <div className="text-center z-0">
      <div className="mt-4">
        <SearchComponent search={search}/>
      </div>
        <div className="flex flex-row justify-center py-4">
          <Select defaultValue={parseInt(filter)} value={parseInt(filter)} onValueChange={((value) => 
            {
              tableDispatch({type: TABLE_ACTION.filter, playload: value})
              router.replace(`/?filter=\
${value}&date=${tableState.sort.date}&topic=${-1}&name=${-1}\
&status=${-1}&search=${tableState.search}&page=${tableState.page}`)
            })
            }>
            <SelectTrigger className="w-[200px] text-xl">
              <SelectValue placeholder={["All", "Queue", "Inprocess", "Complete"][filter]} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={0}>All</SelectItem>
                <SelectItem value={1}>Queue</SelectItem>
                <SelectItem value={2}>Inprocess</SelectItem>
                <SelectItem value={3}>Complete</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
      </div>
      <ul className="font-bold text-xl max-sm:text-sm text-center ">
        <li className="inline-flex py-2">
          <div>
            <button onClick={(e) => {
              router.replace(`/?filter=\
${tableState.filter}&date=${(tableState.sort.date + 1)%2}&topic=${-1}&name=${-1}\
&status=${-1}&search=${tableState.search}&page=${tableState.page}`)
              tableDispatch({type:TABLE_ACTION.page, playload: 0})
              tableDispatch({type:TABLE_ACTION.sort, playload: {date: (tableState.sort.date + 1)%2}})
            }}
             className="w-28 inline-block max-sm:w-16 text-center" value={0}>Date{parse(sortSymbols[parseInt(sort.date) + 1])}</button>
          </div>
        </li>
        <li className="inline-flex py-2">
          <div>
            <button onClick={(e) => {
              router.replace(`/?filter=\
${tableState.filter}&date=${-1}&topic=${(tableState.sort.topic + 1)%2}&name=${-1}\
&status=${-1}&search=${tableState.search}&page=${tableState.page}`)
              tableDispatch({type:TABLE_ACTION.page, playload: 0})
              tableDispatch({type:TABLE_ACTION.sort, playload: {topic: (tableState.sort.topic + 1)%2}})
            }}
             className="w-28 inline-block max-sm:w-16" value={1}>Topic{parse(sortSymbols[parseInt(sort.topic) + 1])}</button>
          </div>
        </li>
        <li className="inline-flex py-2">
          <div>
            <button onClick={(e) => {
              router.replace(`/?filter=\
${tableState.filter}&date=${-1}&topic=${-1}&name=${(tableState.sort.name + 1)%2}\
&status=${-1}&search=${tableState.search}&page=${tableState.page}`)
              tableDispatch({type:TABLE_ACTION.page, playload: 0})
              tableDispatch({type:TABLE_ACTION.sort, playload: {name: (tableState.sort.name + 1)%2}})
            }}
             className="w-28 inline-block max-sm:w-16" value={2}>Name{parse(sortSymbols[parseInt(sort.name) + 1])}</button>
          </div>
        </li>
        <li className="inline-flex py-2">
          <div>
            <button onClick={(e) => {
              router.replace(`/?filter=\
${tableState.filter}&date=${-1}&topic=${-1}&name=${-1}\
&status=${(tableState.sort.status + 1)%2}&search=${tableState.search}&page=${tableState.page}`)
              tableDispatch({type:TABLE_ACTION.page, playload: 0})
              tableDispatch({type:TABLE_ACTION.sort, playload: {status: (tableState.sort.status + 1)%2}})
            }}
             className="w-28 inline-block max-sm:w-16" value={3}>Status{parse(sortSymbols[parseInt(sort.status) + 1])}</button>
          </div>
        </li>
      </ul>
    </div>
    )
}