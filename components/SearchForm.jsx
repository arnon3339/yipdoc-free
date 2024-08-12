"use client";

import {  useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import { TableContext, TABLE_ACTION } from "@/providers/table/page";

export default function SearchComponent(search){
  const ref = useRef()
  const router = useRouter()
  const {tableState, tableDispatch} = useContext(TableContext)
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    tableDispatch({type:TABLE_ACTION.search, playload: ref.current.value})
    router.replace(`/?filter=\
${tableState.filter}&date=${tableState.sort.date}&topic=${tableState.sort.topic}&name=${tableState.sort.name}\
&status=${tableState.sort.status}&search=${ref.current.value}&page=${tableState.page}`)

  }

  return (
    <div>
      <form onSubmit={handleOnSubmit}>
        <input ref={ref}
        className="border border-gray-300 rounded-md w-60 leading-8 p-1"
          type="text"
          placeholder="Enter a search query"
          defaultValue=""
          id="searchInput"
        />
        <button className="border border-green-400 p-2 rounded-md text-green-200 ml-2 bg-gray-800
         hover:bg-gray-400 hover:text-green-800 max-sm:mt-2 max-sm:ml-0" type="submit">Search</button>
      </form>
    </div>
  );
};
