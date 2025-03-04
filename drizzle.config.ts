// this file holds drizzle configurations on how we want to tell our drizzle where our schema lives
import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

export default {
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts", 
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;

// npx drizzle-kit push:pg

// langchain helps us in splitting and segmenting of the pdf