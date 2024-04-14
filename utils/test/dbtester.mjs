import dotenv from "dotenv";
// import { retrieveDataFromSupabase } from "../../utils/db_supbaseServices";
//import supabaseClientPool from "../lib/db.js";
// import { createSupabaseClient } from "../db.js";
import pkg from "../db.js";
const { createSupabaseClient } = pkg;

dotenv.config();

function printEnv() {
  console.log(process.env.DB_USER);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_NAME);
}

printEnv();

const pool = createSupabaseClient();
