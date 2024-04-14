"use server";
import OpenAI from "openai";
import { QueryDataFromSupabase, InsertRowSupabase, UpdateRowSupabase } from "./db";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use Chat history
//
export const generateChatResponse = async (chatMessages) => {
  console.log("[actions.js] Chatmessages: ", chatMessages);

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: "you are a helpful assistant" }, ...chatMessages],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });

    console.log(response.choices[0].message);
    console.log("Returning from generateChatResponse");
    return response.choices[0].message;
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
 * @returns {Object | null} The generated one-day tour response in JSON format,
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

    return tourData.tour;
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

  console.log("[actions.js] getExistingTour: ", city, country);

  const sqlResult = await QueryDataFromSupabase(
    `SELECT * FROM gpt_genius_tours WHERE city='${city}' AND country='${country}'`
  );

  // SQL query result is an array of objects. Return the first object in the array. city and country are unique.
  if (sqlResult) {
    console.log("[actions.js] getTourById: ", sqlResult[0]);
    return sqlResult[0];
  } else {
    return null;
  }
};

export const getTourById = async (tourId) => {
  console.log("[actions.js] getTourById: ", tourId);
  const sqlResult = await QueryDataFromSupabase(`SELECT * FROM gpt_genius_tours WHERE id='${tourId}'`);

  // SQL query result is an array of objects. Return the first object in the array. city and country are unique.
  if (sqlResult) {
    console.log("[actions.js] getTourById: ", sqlResult[0]);
    return sqlResult[0];
  } else {
    return null;
  }
};

/**
 * Retrieves all tours from the database.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of tour objects.
 */
export const getAllTours = async () => {
  const sqlResult = await QueryDataFromSupabase(`SELECT * FROM gpt_genius_tours`);
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
 * @returns {Promise<number|null>} - A promise that resolves to the number of tokens for the user, or null if the user is not found.
 */
export const getTokensByUserId = async (userId) => {
  const sqlResult = await QueryDataFromSupabase(`SELECT tokens FROM gpt_genius_token WHERE id='${userId}'`);
  if (sqlResult.length > 0) {
    return sqlResult[0].tokens;
  } else {
    return null;
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
  const { user_id, first_name, last_name, email_address } = tokenData;
  const queryStr = `
    INSERT INTO gpt_genius_tokens (user_id, first_name, last_name, email_address)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const sqlResult = await InsertRowSupabase(queryStr, [user_id, first_name, last_name, email_address]);
  return null;
};

/**
 * Retrieves the tokens for a given user ID. If the user ID does not exist, inserts a new record into the gpt_genius_tokens table.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<number|null>} - A promise that resolves to the number of tokens for the user, or null if the user is not found.
 */
export const getTokensOrInsertNew = async (userData) => {
  const { userId, firstName, lastName, emailAddress } = userData;
  const existingTokens = await getTokensByUserId(userId);
  if (existingTokens !== null) {
    return existingTokens;
  } else {
    const tokenData = {
      user_id: userId,
      first_name: firstName, // Replace with actual first name
      last_name: lastName, // Replace with actual last name
      email_address: emailAddress, // Replace with actual email address
    };
    await insertTokenRow(tokenData);
    return null;
  }
};

// // This does not save Chat History
// //
// export const generateChatResponse = async (chatMessage) => {
//   console.log("[actions.js] Chatmessage: ", chatMessage);

//   const response = await openai.chat.completions.create({
//     messages: [
//       { role: "system", content: "you are a helpful assistant" },
//       { role: "user", content: chatMessage },
//     ],
//     model: "gpt-3.5-turbo",
//     temperature: 0,
//   });

//   console.log(response.choices[0].message);
//   console.log("Returning from generateChatResponse");
//   return "awesome";
// };

export async function getExistingTour({ city, country }) {
  console.log("getExistingTour invoked");
  return prisma.tour.findUnique({
    where: {
      city_country: {
        city,
        country,
      },
    },
  });
}

export async function createNewTour(tour) {
  console.log("createNewTour invoked");
  return prisma.tour.create({ data: tour });
}

export async function getAllTours(searchTerm) {
  console.log("getAllTours invoked");

  try {
    let whereCondition = {};
    if (searchTerm && searchTerm.trim() !== "") {
      whereCondition = {
        city: {
          contains: searchTerm,
        },
        country: {
          contains: searchTerm,
        },
      };
    }

    const tours = await prisma.tour.findMany({
      where: whereCondition,
      orderBy: {
        city: "asc",
      },
    });

    return tours;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getSingleTour(id) {
  console.log("getSingleTour invoked");

  try {
    const tour = await prisma.tour.findUnique({
      where: {
        id,
      },
    });

    return tour;
  } catch (error) {
    console.log(error);
    return null;
  }
}
