const axios = require("axios");

// OMDB API configuration
const OMDB_API_KEY = process.env.OMDB_API_KEY || "33ac2980";
const OMDB_BASE_URL = "https://www.omdbapi.com";

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    const { path, queryStringParameters, httpMethod } = event;

    // Health check endpoint
    if (path === "/.netlify/functions/api/health" || path === "/health") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "OK",
          message: "MovieLand Backend is running!",
          timestamp: new Date().toISOString(),
          environment: {
            hasOMDBKey: !!OMDB_API_KEY,
            nodeVersion: process.version,
          },
        }),
      };
    }

    // Simple ping endpoint for testing
    if (path === "/.netlify/functions/api/ping" || path === "/ping") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: "pong",
          timestamp: new Date().toISOString(),
        }),
      };
    }

    // Movie search endpoint
    if (
      path === "/.netlify/functions/api/movies/search" ||
      path.includes("/movies/search")
    ) {
      const { title, page = 1, type } = queryStringParameters || {};

      if (!title) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Movie title is required" }),
        };
      }

      let searchUrl = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(
        title
      )}&page=${page}`;
      if (type) {
        searchUrl += `&type=${type}`;
      }

      console.log("Making request to OMDB API:", searchUrl);
      const response = await axios.get(searchUrl);
      console.log("OMDB API response status:", response.status);
      console.log("OMDB API response data:", response.data);

      if (response.data.Response === "False") {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            error: response.data.Error || "No movies found",
          }),
        };
      }

      // Add pagination info to response
      const totalResults = parseInt(response.data.totalResults) || 0;
      const resultsPerPage = 10; // OMDB API returns 10 results per page
      const totalPages = Math.ceil(totalResults / resultsPerPage);
      const currentPage = parseInt(page);

      const responseData = {
        ...response.data,
        pagination: {
          currentPage,
          totalPages,
          totalResults,
          resultsPerPage,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(responseData),
      };
    }

    // Get movie details by ID
    if (path.includes("/movies/") && !path.includes("/search")) {
      const pathParts = path.split("/");
      const movieId = pathParts[pathParts.length - 1];

      const response = await axios.get(
        `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${movieId}`
      );

      if (response.data.Response === "False") {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            error: response.data.Error || "Movie not found",
          }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response.data),
      };
    }

    // Get popular movies (default search) with pagination
    if (path === "/.netlify/functions/api/movies" || path === "/movies") {
      const { page = 1 } = queryStringParameters || {};
      const response = await axios.get(
        `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=Batman&page=${page}`
      );

      if (response.data.Response === "False") {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            error: response.data.Error || "No movies found",
          }),
        };
      }

      // Add pagination info to response
      const totalResults = parseInt(response.data.totalResults) || 0;
      const resultsPerPage = 10;
      const totalPages = Math.ceil(totalResults / resultsPerPage);
      const currentPage = parseInt(page);

      const responseData = {
        ...response.data,
        pagination: {
          currentPage,
          totalPages,
          totalResults,
          resultsPerPage,
          hasNextPage: currentPage < totalPages,
          hasPrevPage: currentPage > 1,
        },
      };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(responseData),
      };
    }

    // Default response for unmatched routes
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Endpoint not found" }),
    };
  } catch (error) {
    console.error("Function error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      config: error.config,
      response: error.response?.data,
    });
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        details: error.message,
        timestamp: new Date().toISOString(),
      }),
    };
  }
};
