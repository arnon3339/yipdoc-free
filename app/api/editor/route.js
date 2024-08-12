import { NextResponse } from "next/server";
import { URLSearchParams } from "url";
import poolQuery from "@/lib/pgconnect";

export async function GET(req) {
  try {
    const url = req.url
    const urlParams = new URLSearchParams(url.toString().split('?')[1])
    const docTextQuery = `
    SELECT documents.id, date::timestamptz, topic::text, documents.name::text, 
      description::text, status, user_name::text
    FROM documents
    INNER JOIN users
      ON users.name = user_name
    WHERE _id = $1
    ;
    `
    const docResult = await poolQuery(docTextQuery, [urlParams.get('docid')])
    const doc = docResult.rows[0]

    const filesTextQuery = `
      SELECT pathname::text, url::text, users.role
      FROM files
      INNER JOIN users
        ON users.id = user_id
      WHERE (document_id = $1) AND (active = TRUE)
      ORDER BY files.id
      ;
    `
    const filesResult = await poolQuery(filesTextQuery, [doc.id])
    const files = filesResult.rows

    return NextResponse.json({ message: "Found a document.", document: doc, 
    files: files},
     { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while getting a document." },
      { status: 500 }
    );
  }
}