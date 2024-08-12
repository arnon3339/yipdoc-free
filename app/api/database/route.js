import poolQuery from "@/lib/pgconnect"
import { NextResponse } from "next/server";
import { URLSearchParams } from "url";

export async function GET(req) {
  try {
    const url = req.url
    const urlParams = new URLSearchParams(url.toString().split('?')[1])
    let paramsCount = 0
    const filter = 
      [[], ['QUEUE'], ['INPROCESS'], ['COMPLETE']][parseInt(urlParams.get('filter'))]
    let sort = "date DESC"
    urlParams.forEach((value, name) => {
      if (value != "-1" && ["date", "topic", "name", "status"].includes(name))
      sort = `${name} ${parseInt(value)? "DESC": "ASC"}`
    })
    if (filter.length){
      paramsCount += 1
    }
    
    const search = urlParams.get('search')
    let searchRegex = ".*"
    let fullRegex = ".*"
    if (search.replace(/[\t\s]+/g, '') != ''){
      searchRegex = search.replace(/[\t\s]+/g, ' ').split(' ').map(e => `(?=.*${e}.*)`).join('')
      fullRegex = `.*${search}.*|${searchRegex}`
    }

    const textQueryFull = `
    SELECT * 
    FROM documents
    WHERE 
    (${urlParams.get('filter') != '0'? ` status = $1`: " TRUE"}) AND
      ((name ~* $${paramsCount + 1}) OR (topic ~* $${paramsCount + 1}) OR (description ~* $${paramsCount + 1}))
    ;
    `
    
    const textQuery = `
    SELECT * 
    FROM documents
    WHERE 
    (${urlParams.get('filter') != '0'? ` status = $1`: " TRUE"}) AND
      ((name ~* $${paramsCount + 1}) OR (topic ~* $${paramsCount + 1}) OR (description ~* $${paramsCount + 1}))
    ORDER BY ${sort}
    OFFSET $${paramsCount + 2}
    LIMIT 20
    ;
    `

    const result = await poolQuery(textQuery, [...filter, fullRegex, 20*parseInt(urlParams.get('page'))])
    const resultFull = await poolQuery(textQueryFull, [...filter, fullRegex])


    const contents = result.rows
    const contentCount = resultFull.rows.length

    return NextResponse.json({ message: "Contents are successfully obtained.", 
    contents: {documents: contents, count: contentCount}},
     { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while getting contents." },
      { status: 500 }
    );
  }
}