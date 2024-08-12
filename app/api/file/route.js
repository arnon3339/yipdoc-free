import { NextResponse } from "next/server";
import poolQuery from "@/lib/pgconnect";

export async function POST(req) {
  try {
    const { files } = await req.json();
    const outputURLs = []
    const textQuery = `
    INSERT INTO files (pathname, contenttype, contentdisposition,
      url, document_id, user_id)
    SELECT $1, $2, $3, $4, $5, users.id
    FROM users
    WHERE users.name = $6
    RETURNING url
    ;
    `
    await Promise.all(files.map(async (element) => {
      const result = await poolQuery(textQuery, Object.keys(element).map(k => element[k]))
      const url = result.rows[0].url
      outputURLs.push(url)
    }))
    return NextResponse.json({ message: "Files are successfully created.", urls: outputURLs},
    { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while creating files." },
      { status: 500 }
      );
    }
}

export async function PUT(req) {
  try {
    await connectMongoDB();
    const { url } = await req.json();
    await Files.updateMany({url}, {$set: {active: false}})
    return NextResponse.json({ message: "Files are removed"},
     { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while removing files." },
      { status: 500 }
    );
  }
}