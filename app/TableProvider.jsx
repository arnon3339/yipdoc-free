"use client";

import TableProvider from "@/providers/table/page";

export default function WrapTableProvider({ children }){
  return <TableProvider>{children}</TableProvider>;
};
