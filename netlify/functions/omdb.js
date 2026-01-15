const OMDB_BASE = "https://www.omdbapi.com/";

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Missing OMDB_API_KEY" }),
    };
  }

  const params = new URLSearchParams(event.queryStringParameters || {});
  if (!params.has("apikey")) {
    params.set("apikey", apiKey);
  }

  const url = `${OMDB_BASE}?${params.toString()}`;

  try {
    const response = await fetch(url);
    const body = await response.text();

    return {
      statusCode: response.status,
      headers: { "Content-Type": "application/json" },
      body,
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "OMDb request failed" }),
    };
  }
}
