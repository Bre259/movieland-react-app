#!/usr/bin/env node

// Simple API test script
const BASE_URL =
  "https://68a8ac6bfb2db8116738900f--movieland-react-ap.netlify.app/api";

async function testEndpoint(endpoint, description) {
  try {
    console.log(`\n🧪 Testing: ${description}`);
    console.log(`📍 URL: ${BASE_URL}${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Success:`, JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log(`❌ Error:`, errorText);
    }
  } catch (error) {
    console.log(`💥 Network Error:`, error.message);
  }
}

async function runTests() {
  console.log("🚀 Starting API Tests...\n");

  // Test basic connectivity
  await testEndpoint("/ping", "Basic Connectivity (Ping)");

  // Test health check
  await testEndpoint("/health", "Health Check");

  // Test movie search
  await testEndpoint(
    "/movies/search?title=batman&page=1",
    "Movie Search (Batman)"
  );

  // Test direct OMDB API
  console.log("\n🧪 Testing: Direct OMDB API (HTTPS)");
  try {
    const response = await fetch(
      "https://www.omdbapi.com/?apikey=33ac2980&s=batman&page=1"
    );
    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ OMDB Direct Success:`, {
        Response: data.Response,
        totalResults: data.totalResults,
        resultsCount: data.Search?.length || 0,
      });
    } else {
      console.log(`❌ OMDB Direct Error:`, await response.text());
    }
  } catch (error) {
    console.log(`💥 OMDB Direct Network Error:`, error.message);
  }

  console.log("\n🏁 API Tests Completed!");
}

runTests();
