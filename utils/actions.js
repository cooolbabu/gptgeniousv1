"use server";
import OpenAI from "openai";

import { QueryDataFromSupabase, InsertRowSupabase, UpdateRowSupabase } from "./db.js";
import { revalidatePath } from "next/cache";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use Chat history
//
export const generateChatResponse = async (chatMessages) => {
  // console.log("[actions.js] Chatmessages: ", chatMessages);

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: "you are a helpful assistant" }, ...chatMessages],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });

    // console.log(response.choices[0].message);
    // console.log("Returning from generateChatResponse");
    return { message: response.choices[0].message, tokens: response.usage.total_tokens };
  } catch (error) {
    return null;
  }
};

/**
 * Generates a one-day tour response based on the provided city and country.
 * If the city and country exist, it creates a list of things families can do in the city and country,
 * and returns a one-day tour in JSON format.
 * If the city cannot be found, or it doesn't exist, or its population is less than 1,
 * or it is not located in the provided country, it returns { "tour": null }.
 *
 * @param {Object} options - The options for generating the tour response.
 * @param {string} options.city - The city for which the tour response is generated.
 * @param {string} options.country - The country in which the city is located.
 * @returns {Object | null} The generated one-day tour response in JSON format { tour: tourData.tour, tokens: response.usage.total_tokens },
 * or { "tour": null } if the city cannot be found or doesn't meet the criteria.
 */
export const generateTourResponse = async ({ city, country }) => {
  const query = `Find a exact ${city} in this exact ${country}.
If ${city} and ${country} exist, create a list of things families can do in this ${city},${country}. 
Once you have a list, create a one-day tour. Response should be  in the following JSON format: 
{
  "tour": {
    "city": "${city}",
    "country": "${country}",
    "title": "title of the tour",
    "description": "short description of the city and tour",
    "stops": ["short paragraph on the stop 1 ", "short paragraph on the stop 2","short paragraph on the stop 3"]
  }
}
"stops" property should include only three stops.
If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, or it is not located in the following ${country},   return { "tour": null }, with no additional characters.`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "you are a tour guide" },
        { role: "user", content: query },
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 500,
    });
    // potentially returns a text with error message
    const tourData = JSON.parse(response.choices[0].message.content);

    if (!tourData.tour) {
      return null;
    }
    // console.log("[actions.js] generateTourResponse: ", response);
    return { tour: tourData.tour, tokens: response.usage.total_tokens };
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Retrieves an existing tour from the database based on the provided city and country.
 * @param {Object} options - The options for retrieving the tour.
 * @param {string} options.city - The city of the tour.
 * @param {string} options.country - The country of the tour.
 * @returns {Promise<Object|null>} - A promise that resolves to the retrieved tour object, or null if no tour is found.
 */
export const getExistingTour = async ({ city, country }) => {
  // Acquire a client from the pool

  // console.log("[actions.js] getExistingTour: ", city, country);

  const sqlResult = await QueryDataFromSupabase(
    `SELECT * FROM gpt_genius_tours WHERE city='${city}' AND country='${country}'`
  );

  // SQL query result is an array of objects. Return the first object in the array. city and country are unique.
  if (sqlResult) {
    // console.log("[actions.js] getTourById: ", sqlResult[0]);
    return sqlResult[0];
  } else {
    return null;
  }
};

export const getTourById = async (tourId) => {
  // console.log("[actions.js] getTourById: ", tourId);
  const sqlResult = await QueryDataFromSupabase(`SELECT * FROM gpt_genius_tours WHERE id='${tourId}'`);

  // SQL query result is an array of objects. Return the first object in the array. city and country are unique.
  if (sqlResult) {
    // console.log("[actions.js] getTourById: ", sqlResult[0]);
    return sqlResult[0];
  } else {
    return null;
  }
};

/**
 * Retrieves all tours from the database searches on city or country.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of tour objects.
 */
export const getAllTours = async (searchValue) => {
  const sqlResult = await QueryDataFromSupabase(
    `SELECT * FROM gpt_genius_tours WHERE city ILIKE '%${searchValue}%' OR country ILIKE '%${searchValue}%'`
  );
  return sqlResult;
};

/**
 * Creates a new tour in the database.
 * @param {Object} tourData - The data for the new tour.
 * @param {string} tourData.city - The city of the tour.
 * @param {string} tourData.country - The country of the tour.
 * @param {string} tourData.description - The description of the tour.
 * @returns {Promise<Object>} - A promise that resolves to the created tour object.
 */
export const createNewTour = async (tourData) => {
  const { city, country, title, description, stops } = tourData;
  const queryStr = `
    INSERT INTO gpt_genius_tours (city, country, title, description, stops)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const sqlResult = await InsertRowSupabase(queryStr, [city, country, title, description, stops]);
  return sqlResult[0];
};

/**
 * Retrieves the tokens for a given user ID.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<number|null>} - A promise that resolves to the number of tokens for the user, or null if the user is not found. {tokens: tokenValue}
 */
export const getTokensByUserId = async (userId) => {
  const sqlResult = await QueryDataFromSupabase(`SELECT tokens FROM gpt_genius_token WHERE user_id='${userId}'`);

  // SQL query result is an array of objects. Return the first object in the array. city and country are unique.
  if (sqlResult) {
    // console.log("[actions.js] getTokensByUserId: ", sqlResult);
    return sqlResult[0];
  } else {
    return null; // User not found
  }
};

/**
 * Inserts a new row into the gpt_genius_tokens table.
 * @param {Object} tokenData - The data for the new token row.
 * @param {string} tokenData.user_id - The user ID.
 * @param {string} tokenData.first_name - The first name.
 * @param {string} tokenData.last_name - The last name.
 * @param {string} tokenData.email_address - The email address.
 * @returns {Promise<null>} - A promise that resolves to null.
 */
export const insertTokenRow = async (tokenData) => {
  const { user_id, first_name, last_name, email_address, tokens } = tokenData;
  const queryStr = `
    INSERT INTO gpt_genius_token (user_id, first_name, last_name, email_address, tokens)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const sqlResult = await InsertRowSupabase(queryStr, [user_id, first_name, last_name, email_address, tokens]);
  return null;
};

/**
 * Retrieves existing tokens for a user or inserts new tokens if none exist.
 *
 * @param {Object} userData - The user data object.
 * @param {string} userData.userId - The user ID.
 * @param {string} userData.firstName - The user's first name.
 * @param {string} userData.lastName - The user's last name.
 * @param {string} userData.emailAddress - The user's email address.
 * @returns {Array|null} - The existing tokens or null if new tokens were inserted.
 */
export const getTokensOrInsertNewuser = async (userData) => {
  const { userId, firstName, lastName, emailAddress } = userData;
  let existingTokens = await getTokensByUserId(userId);

  // console.log("[actions.js] getTokensOrInsertNewuser: ", existingTokens, userId, firstName, lastName, emailAddress);
  if (existingTokens !== null) {
    return existingTokens;
  } else {
    !existingTokens ? 0 : existingTokens;
    const tokenData = {
      user_id: userId,
      first_name: firstName, // Replace with actual first name
      last_name: lastName, // Replace with actual last name
      email_address: emailAddress, // Replace with actual email address
      tokens: 1000, // Initial token amount
    };
    await insertTokenRow(tokenData);
    return null;
  }
};

/**
 * Reduces the number of tokens for a given user ID.
 * @param {string} userId - The ID of the user.
 * @param {number} amount - The amount of tokens to reduce.
 * @returns {Promise<void>} - A promise that resolves when the tokens are successfully reduced.
 */
export const reduceTokensByUserId = async (userId, amount) => {
  const queryStr = `
    UPDATE gpt_genius_token
    SET tokens = tokens - $1
    WHERE user_id = $2
    RETURNING tokens;
  `;
  const result = await UpdateRowSupabase(queryStr, [amount, userId]);
  // console.log("[actions.js] reduceTokensByUserId: ", result);
  revalidatePath("/profile");
};
