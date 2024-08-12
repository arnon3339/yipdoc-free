// import { connectMongoDB } from "@/lib/mongodb";
import poolQuery, {poolTransction} from "@/lib/pgconnect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { throws } from "assert";

export async function POST(req) {
  const { name, role, password} = await req.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const queryText = `
    INSERT INTO users(
      name,
      role,
      password
      ) VALUES(
        $1, $2, $3
        )
      RETURNING name, role;
        `
    const result = await poolQuery(queryText, [name, role, hashedPassword])
    // const result = await poolTransction(queryText, [name, role, hashedPassword])
    if (!result.rows[0])
        throw new Error("Registeration fail.")
    return NextResponse.json({ message: "Account registered.", user: result.rows[0]}, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}

export async function GET(req){
  const name = req.url.split('?')[1].split('=')[1]
  const params = [name]
  try {
    const queryText = `
      SELECT  lower(name)::text
      FROM  users
      WHERE name = $1
      LIMIT 1;
        `
    const result = await poolQuery(queryText, params)

    if (!result.rows.length)
      return NextResponse.json({message: `User name: ${name} doesn't exist.`, user: null},
        {status: 201})
    throw {
      result: result
    }
  } catch (error) {
    const result = error.result
      return NextResponse.json({message: `User name: ${result.rows[0].name} does exist.`, user: result.rows[0]},
        {status: 201})
  }
}
