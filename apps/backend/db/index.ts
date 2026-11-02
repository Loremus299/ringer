import { drizzle } from "drizzle-orm/node-postgres";
import env from "../src/env";

const db = drizzle(env.database)
export default db
