"use client";

import { useState, createContext } from "react";

export const SearchPageContext = createContext()

export default function SearchPageProvider({children})
{
  const [pageSearch, setPageSearch] = useState(0)

  const updatePage = (page) => {
    setPageSearch(page)
  }

  return (
    <SearchPageContext.Provider value={{pageSearch, updatePageSearch}}>
      {children}
    </SearchPageContext.Provider>
  )
}