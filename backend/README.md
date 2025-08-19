# MovieLand Backend API

Backend server for the MovieLand React application using Express.js and OMDB API.

## Features

- 🎬 Movie search functionality
- 📽️ Movie details by ID
- 🔍 Default movie recommendations
- 🌐 CORS enabled for frontend integration
- ⚡ Fast and responsive API

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

3. **Server will run on:** `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Search Movies
- **GET** `/api/movies/search?title={movie_title}`
- Search for movies by title
- Example: `/api/movies/search?title=Batman`

### Get Movie Details
- **GET** `/api/movies/{imdb_id}`
- Get detailed information about a specific movie
- Example: `/api/movies/tt0372784`

### Get Default Movies
- **GET** `/api/movies`
- Returns default movie recommendations (Batman movies)

## Environment Variables

Create a `.env` file in the backend directory:
```
PORT=5000
OMDB_API_KEY=your_omdb_api_key
NODE_ENV=development
```

## Technologies Used

- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for API calls
- **Dotenv** - Environment variable management
- **OMDB API** - Movie database

## Frontend Integration

The backend is configured to work with the React frontend running on `http://localhost:3000`.


