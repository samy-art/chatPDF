import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);

(async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Connection successful:', result);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
})();

// This file is just to check the connection to the database----which came---connection is successful!
