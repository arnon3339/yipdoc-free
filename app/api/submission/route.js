import { NextResponse } from "next/server";
import poolQuery from "@/lib/pgconnect";

export async function POST(req){
  const {
  docid,
  adminName,
  admin,
  content,
  file} = await req.json()

  const urls = file.blobs.map(e => e.url)

  try {

    // Upload postgresql
    try {
      const upfilesTextQuery = `
      INSERT INTO files (pathname, contenttype, contentdisposition,
        url, document_id, user_id)
      SELECT $1, $2, $3, $4, $5, users.id
      FROM users
      WHERE users.name = $6
      RETURNING url
      ;
      `
      if (file.blobs.length){
          const userName = admin? adminName: content.userName
          await Promise.all(file.blobs.map(async(e) => {
            try {
              await poolQuery(upfilesTextQuery, 
                [
                  e.pathname, e.contentType?? null, e.contentDisposition?? null,
                  e.url, null, userName
                ])
            } catch (error) {
              throw new Error("Fail to upload files.")  
            }
          }))
      }
      
    } catch (error) {
      throw new Error("Fail to upload files.")
    }

    // Upload a document
    let resDocID = ""
    try {
      if (docid){
        const docTextQuery = `
          UPDATE documents SET 
            user_name = $1, date = $2, topic = $3, name = $4, 
            description = $5, status = $6, lastupdate = $7
            WHERE _id = $8
            RETURNING id
            ;
        `
        const contentParams = Object.keys(content).map((k) => {
          if (k === "date" && admin)
            return new Date(Date.now())
          return content[k]
        })
        const docResult = await poolQuery(docTextQuery, [...contentParams, docid])
        resDocID = docResult.rows[0].id
      } 
      else{
        const docTextQuery = `
          INSERT INTO documents (
            user_name, date, topic, name, description, status, lastupdate
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7
          )
          RETURNING id
        ;
        `
        const docResult = await poolQuery(docTextQuery, Object.keys(content).map(k => {
          if (k === "date")
            return new Date(Date.now())
          return content[k]
        }))
        resDocID = docResult.rows[0].id
      }

      if (urls?.length){
        const filesTextQuery = `
        UPDATE files SET document_id = $1 WHERE url = $2;
        `
        await Promise.all(urls.map(async (element) => {
          await poolQuery(filesTextQuery, [resDocID, element])
        }))
      }
    } catch (error) {
        throw new Error("Fail to upload a document.")     
      }

    // Deactive files
    if (file.del.length){
      try {
        const textQuery = `
          UPDATE files SET active = $1 WHERE url = $2;
        `
        await Promise.all(file.del.map(async (e) => await poolQuery(textQuery, [false, e.url])))
      } catch (error) {
        console.log("Error: ", error)  
      }
    }
    return NextResponse.json({ message: "The content is successfully updated."},
     { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while updating a content.", error},
      { status: 500 }
    )
  }
}