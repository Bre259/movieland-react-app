const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// OMDB API configuration
const OMDB_API_KEY = process.env.OMDB_API_KEY || '33ac2980';
const OMDB_BASE_URL = 'http://www.omdbapi.com';

// Routes

// Search movies with pagination
app.get('/api/movies/search', async (req, res) => {
  try {
    const { title, page = 1 } = req.query;
    
    if (!title) {
      return res.status(400).json({ error: 'Movie title is required' });
    }

    const response = await axios.get(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(title)}&page=${page}`);
    
    if (response.data.Response === 'False') {
      return res.status(404).json({ error: response.data.Error || 'No movies found' });
    }

    // Add pagination info to response
    const totalResults = parseInt(response.data.totalResults) || 0;
    const resultsPerPage = 10; // OMDB API returns 10 results per page
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const currentPage = parseInt(page);

    res.json({
      ...response.data,
      pagination: {
        currentPage,
        totalPages,
        totalResults,
        resultsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      }
    });
  } catch (error) {
    console.error('Error searching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get movie details by ID
app.get('/api/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&i=${id}`);
    
    if (response.data.Response === 'False') {
      return res.status(404).json({ error: response.data.Error || 'Movie not found' });
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get popular movies (default search) with pagination
app.get('/api/movies', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const response = await axios.get(`${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&s=Batman&page=${page}`);
    
    if (response.data.Response === 'False') {
      return res.status(404).json({ error: response.data.Error || 'No movies found' });
    }

    // Add pagination info to response
    const totalResults = parseInt(response.data.totalResults) || 0;
    const resultsPerPage = 10;
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const currentPage = parseInt(page);

    res.json({
      ...response.data,
      pagination: {
        currentPage,
        totalPages,
        totalResults,
        resultsPerPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1
      }
    });
  } catch (error) {
    console.error('Error fetching default movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'MovieLand Backend is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});
