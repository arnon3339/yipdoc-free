"use client";

import { createContext, useReducer } from "react";

export const TableContext = createContext()

export const TABLE_ACTION = {
  search: 0,
  page: 1,
  sort: 2,
  filter: 3,
}

export default function TableProvider({children}) {
  const reducer = (state, action) => {
    switch (action.type) {
      case TABLE_ACTION.search:
        return  {...state, search: action.playload}
      case TABLE_ACTION.page:
        return {...state, page: action.playload}
      case TABLE_ACTION.sort:
        return {...state, sort: {...{
          date: -1, topic: -1, name: -1, status: -1,
        }, ...action.playload}}
      case TABLE_ACTION.filter:
        return {...state, filter: action.playload}
      default:
        console.error("Error on TABLE ACTION");
    }
  }

  const [tableState, tableDispatch] = useReducer(reducer, {
    sort: {date: 1, topic: -1, name: -1, status: -1}, search: "", page: 0, filter: 0 
  })


  return (
    <TableContext.Provider value={{tableState, tableDispatch}}>
      {children}
    </TableContext.Provider>
  )
};
