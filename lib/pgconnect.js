import pg from 'pg';

const { Pool, Client } = pg;

let config = {}

if (process.env.ENVIRONMENT === "DEVELOPMENT")
  config = {
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DATABASE,
    // ssl: true
  }
else if (process.env.ENVIRONMENT === "PRODUCTION")
  config = {
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  }

const Clientpg = new Client(config)

if (!Clientpg)
  console.err("Error: On pg connection")

export default async function poolQuery(text, params, callback=null){
  let thePool = {}
  try {
    thePool = new Pool(config)
    const res = await thePool.query(text, params, callback)
    thePool.end()
    return res
  } catch (error) {
    console.log(error)
    thePool.end()
    return null
  }
}

export async function poolTransction(text, params, callback=null){
  let theClient = {}
  try {
    const thePool = new Pool(config)
    theClient = await thePool.connect()
    await theClient.query("BEGIN")
    const res = await theClient.query(text, params, callback)
    await theClient.query("ROLLBACK")
    theClient.release()
    return res
  } catch (error) {
    theClient.release()
    return null
  }
}
