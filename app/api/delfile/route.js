import { NextResponse } from "next/server";
import poolQuery from "@/lib/pgconnect";

export async function PUT(req){
  try {
    const {files} = await req.json()
    const urls = files.map(e => e.url)

    const textQuery = `
      UPDATE files SET active = $1 WHERE url = $2;
    `

    await Promise.all(urls.map(async (e) => await poolQuery(textQuery, [false, e])))

    return NextResponse.json({message: "Successfully deactivating files."}, {status: 201})
  } catch (error) {
    return NextResponse.json({message: "An error occured while deactivating files."}, {status: 500})
  }
}