// this is where we set up drizzle ORM
import{neon,neonConfig} from '@neondatabase/serverless'
import{drizzle} from 'drizzle-orm/neon-http'


neonConfig.fetchConnectionCache = true       // so that catches the connection thats being set

if(!process.env.DATABASE_URL){
    throw new Error('database url not found')
}

const sql = neon(process.env.DATABASE_URL)

export const db = drizzle(sql)  // this variable db is going to be used to interact with our database through interacting with drizzle

// now we need our schema file --it defines shape of our database
