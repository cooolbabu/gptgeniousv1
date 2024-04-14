import pg from "pg";

const { Pool } = pg;
export const supabaseClientPool = createSupabaseClient();

/**
 *
 * @returns {Pool}
 */
export function createSupabaseClient() {
  try {
    // console.log("createSupabaseClient: env details", process.env.DB_USER, process.env.DB_HOST, process.env.DB_NAME);
    if (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_PASSWORD) {
      throw new Error("Environment variables not set");
    }
    if (!globalThis.supabaseClientPool) {
      globalThis.supabaseClientPool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: 5432, // Default port for PostgreSQL
        max: 20, // Set the maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Idle clients will be closed after 30 seconds
        connectionTimeoutMillis: 5000, // Connection timeout after 5 seconds
      });
    }
  } catch (error) {
    console.log(error);
    return { error: "createSupabaseClient()::Connection refused" };
  }
  return globalThis.supabaseClientPool;
}

/**
 * Queries data from Supabase.
 * @param {string} queryStr - The SQL query string.
 * @param {string} [format="sqlRows"] - The format of the returned data. Possible values are "sqlRows" and "json".
 * @returns {Promise<Array<Object>>|Promise<string>|Promise<{error: string}>} - The queried data in the specified format, or an error object if something went wrong.
 */
export async function QueryDataFromSupabase(queryStr, format = "sqlRows") {
  try {
    //await new Promise((resolve) => setTimeout(resolve, 3000)); // Add a 3-second delay
    // console.log("QueryDataFromSupabase: queryStr", queryStr);
    // console.log("QueryDataFromSupabase: format", format);

    const client = createSupabaseClient();

    if (!queryStr) {
      return null;
    }
    // console.log("QueryDataFromSupabase: client", client);
    // console.log("QueryDataFromSupabase: queryStr", queryStr);

    const sqlResult = await client.query(queryStr);
    // console.log(
    //   "QueryDataFromSupabase: sqlResult rowCount ",
    //   sqlResult.rowCount,
    //   sqlResult.rowCount === 0,
    //   sqlResult.rows.length
    // );
    // console.log("QueryDataFromSupabase: sqlResult.rows ", sqlResult.rows);
    const jsonObject = JSON.stringify(sqlResult.rows);
    // console.log("QueryDataFromSupabase: jsonObject", jsonObject);

    if (format === "sqlRows") {
      if (sqlResult.rowCount === 0) {
        return null;
      } else return sqlResult.rows;
    } else if (format === "json") {
      return jsonObject;
    }
  } catch (error) {
    console.log(error);
    return { error: "QueryDataFromSupabase()::Something went wrong" };
  }
}

export async function InsertRowSupabase(queryStr, values) {
  try {
    const client = createSupabaseClient();
    console.log("InsertRowSupabase: client", queryStr, values);
    const sqlResult = await client.query(queryStr, values);
    console.log("InsertRowSupabase: sqlResult ", sqlResult);
    return sqlResult;
  } catch (error) {
    console.log(error);
    return { error: "InsertRowSupabase()::Something went wrong" };
  }
}

export async function UpdateRowSupabase(queryStr, values) {
  try {
    const client = createSupabaseClient();
    console.log("UpdateRowSupabase: client", queryStr, values);
    const sqlResult = await client.query(queryStr, values);
    console.log("UpdateRowSupabase: sqlResult ", sqlResult);
    return sqlResult;
  } catch (error) {
    console.log(error);
    return { error: "UpdateRowSupabase()::Something went wrong" };
  }
}
