import React, { useState, useEffect } from "react";
import BackIcon from "./BackIcon";

const ApiTestPage = ({ onBack }) => {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const NETLIFY_API_URL =
    "https://68a8ac6bfb2db8116738900f--movieland-react-ap.netlify.app/api";
  const OMDB_DIRECT_URL = "http://www.omdbapi.com";
  const OMDB_API_KEY = "33ac2980";

  const runTests = async () => {
    setTesting(true);
    const results = {};

    // Test 1: Netlify Functions Health Check
    try {
      console.log("Testing Netlify health endpoint...");
      const response = await fetch(`${NETLIFY_API_URL}/health`);
      if (response.ok) {
        const data = await response.json();
        results.netlifyHealth = {
          status: "success",
          data,
          message: "Netlify Functions are working!",
        };
      } else {
        results.netlifyHealth = {
          status: "error",
          error: `HTTP ${response.status}`,
          message: "Netlify Functions not responding",
        };
      }
    } catch (error) {
      results.netlifyHealth = {
        status: "error",
        error: error.message,
        message: "Netlify Functions unreachable",
      };
    }

    // Test 2: Netlify Functions Movie Search
    try {
      console.log("Testing Netlify movie search...");
      const response = await fetch(
        `${NETLIFY_API_URL}/movies/search?title=batman&page=1`
      );
      if (response.ok) {
        const data = await response.json();
        results.netlifyMovies = {
          status: "success",
          data,
          message: `Found ${data.totalResults || 0} movies`,
        };
      } else {
        results.netlifyMovies = {
          status: "error",
          error: `HTTP ${response.status}`,
          message: "Netlify movie search failed",
        };
      }
    } catch (error) {
      results.netlifyMovies = {
        status: "error",
        error: error.message,
        message: "Netlify movie search unreachable",
      };
    }

    // Test 3: Direct OMDB API
    try {
      console.log("Testing direct OMDB API...");
      const response = await fetch(
        `${OMDB_DIRECT_URL}?apikey=${OMDB_API_KEY}&s=batman&page=1`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.Response === "True") {
          results.omdbDirect = {
            status: "success",
            data,
            message: `Direct OMDB API working - ${data.totalResults} results`,
          };
        } else {
          results.omdbDirect = {
            status: "error",
            error: data.Error,
            message: "OMDB API returned error",
          };
        }
      } else {
        results.omdbDirect = {
          status: "error",
          error: `HTTP ${response.status}`,
          message: "OMDB API not responding",
        };
      }
    } catch (error) {
      results.omdbDirect = {
        status: "error",
        error: error.message,
        message: "OMDB API unreachable",
      };
    }

    setTestResults(results);
    setTesting(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "⏳";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "#28a745";
      case "error":
        return "#dc3545";
      default:
        return "#ffc107";
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <BackIcon onClick={onBack} label="Back to App" className="primary" />
      </div>

      <h1>API Connectivity Test</h1>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={runTests}
          disabled={testing}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: testing ? "not-allowed" : "pointer",
          }}
        >
          {testing ? "Testing..." : "Run Tests Again"}
        </button>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {/* Netlify Health Test */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor:
              testResults.netlifyHealth?.status === "success"
                ? "#f8f9fa"
                : "#fff",
          }}
        >
          <h3>
            {getStatusIcon(testResults.netlifyHealth?.status)}
            Netlify Functions Health Check
          </h3>
          <p
            style={{ color: getStatusColor(testResults.netlifyHealth?.status) }}
          >
            {testResults.netlifyHealth?.message || "Testing..."}
          </p>
          {testResults.netlifyHealth?.error && (
            <p style={{ color: "#dc3545", fontSize: "14px" }}>
              Error: {testResults.netlifyHealth.error}
            </p>
          )}
          <p style={{ fontSize: "12px", color: "#666" }}>
            URL: {NETLIFY_API_URL}/health
          </p>
        </div>

        {/* Netlify Movies Test */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor:
              testResults.netlifyMovies?.status === "success"
                ? "#f8f9fa"
                : "#fff",
          }}
        >
          <h3>
            {getStatusIcon(testResults.netlifyMovies?.status)}
            Netlify Functions Movie Search
          </h3>
          <p
            style={{ color: getStatusColor(testResults.netlifyMovies?.status) }}
          >
            {testResults.netlifyMovies?.message || "Testing..."}
          </p>
          {testResults.netlifyMovies?.error && (
            <p style={{ color: "#dc3545", fontSize: "14px" }}>
              Error: {testResults.netlifyMovies.error}
            </p>
          )}
          <p style={{ fontSize: "12px", color: "#666" }}>
            URL: {NETLIFY_API_URL}/movies/search?title=batman&page=1
          </p>
        </div>

        {/* Direct OMDB Test */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            backgroundColor:
              testResults.omdbDirect?.status === "success" ? "#f8f9fa" : "#fff",
          }}
        >
          <h3>
            {getStatusIcon(testResults.omdbDirect?.status)}
            Direct OMDB API
          </h3>
          <p style={{ color: getStatusColor(testResults.omdbDirect?.status) }}>
            {testResults.omdbDirect?.message || "Testing..."}
          </p>
          {testResults.omdbDirect?.error && (
            <p style={{ color: "#dc3545", fontSize: "14px" }}>
              Error: {testResults.omdbDirect.error}
            </p>
          )}
          <p style={{ fontSize: "12px", color: "#666" }}>
            URL: {OMDB_DIRECT_URL}?apikey={OMDB_API_KEY}&s=batman&page=1
          </p>
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "16px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h3>Troubleshooting Tips:</h3>
        <ul>
          <li>
            <strong>If Netlify Functions fail:</strong> Your functions might not
            be deployed yet. Push your code to trigger a deployment.
          </li>
          <li>
            <strong>If Direct OMDB works:</strong> The app will automatically
            fallback to direct API calls.
          </li>
          <li>
            <strong>If all tests fail:</strong> Check your internet connection
            and firewall settings.
          </li>
          <li>
            <strong>Mixed Content errors:</strong> Try accessing the site via
            HTTPS or allow mixed content in your browser.
          </li>
        </ul>
      </div>

      {testResults.netlifyHealth && (
        <div style={{ marginTop: "20px" }}>
          <h3>Raw Test Results:</h3>
          <pre
            style={{
              backgroundColor: "#f8f9fa",
              padding: "16px",
              borderRadius: "8px",
              overflow: "auto",
              fontSize: "12px",
            }}
          >
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTestPage;
