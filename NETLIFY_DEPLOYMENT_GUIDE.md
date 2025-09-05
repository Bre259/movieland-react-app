# Netlify Deployment Guide for MovieLand API

## 🚀 Overview

This guide will help you deploy your MovieLand React app with Netlify Functions to handle movie API requests instead of relying on a separate backend server.

## 📁 What's Changed

### Files Updated:

1. **`src/App.js`** - Updated API_URL to use Netlify Functions
2. **`src/netlify/functions/api.js`** - Complete movie API implementation
3. **`src/netlify/functions/package.json`** - Dependencies for Netlify Functions
4. **`netlify.toml`** - Build and redirect configuration

### New API Endpoints:

- **Health Check:** `/api/health`
- **Movie Search:** `/api/movies/search?title=batman&page=1`
- **Movie Details:** `/api/movies/{imdbID}`
- **Popular Movies:** `/api/movies?page=1`
- **TV Series Search:** `/api/movies/search?title=batman&type=series`

## 🔧 Deployment Steps

### Step 1: Update Your Netlify Site

1. **Commit and push your changes to your repository:**

   ```bash
   git add .
   git commit -m "Add Netlify Functions API and update BackIcon component"
   git push origin main
   ```

2. **Netlify will automatically redeploy** your site when you push changes.

### Step 2: Verify Environment Variables

1. **Go to your Netlify dashboard:** https://app.netlify.com/
2. **Navigate to:** Site settings → Environment variables
3. **Add this variable if not present:**
   - **Key:** `OMDB_API_KEY`
   - **Value:** `33ac2980` (or your own OMDB API key)

### Step 3: Test the API Endpoints

After deployment, test these URLs in your browser:

1. **Health Check:**

   ```
   https://68a8ac6bfb2db8116738900f--movieland-react-ap.netlify.app/api/health
   ```

2. **Movie Search:**

   ```
   https://68a8ac6bfb2db8116738900f--movieland-react-ap.netlify.app/api/movies/search?title=batman
   ```

3. **Popular Movies:**
   ```
   https://68a8ac6bfb2db8116738900f--movieland-react-ap.netlify.app/api/movies
   ```

## 🔍 API Response Format

### Movie Search Response:

```json
{
  "Search": [
    {
      "Title": "Batman Begins",
      "Year": "2005",
      "imdbID": "tt0372784",
      "Type": "movie",
      "Poster": "https://..."
    }
  ],
  "totalResults": "567",
  "Response": "True",
  "pagination": {
    "currentPage": 1,
    "totalPages": 57,
    "totalResults": 567,
    "resultsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Health Check Response:

```json
{
  "status": "OK",
  "message": "MovieLand Backend is running!"
}
```

## 📋 Configuration Details

### netlify.toml Configuration:

```toml
[build]
  publish = "build"
  command = "npm run build"
  functions = "src/netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

### Function Structure:

- **Location:** `src/netlify/functions/api.js`
- **Runtime:** Node.js
- **Dependencies:** axios (for HTTP requests)
- **Environment:** OMDB_API_KEY

## 🐛 Troubleshooting

### Common Issues:

1. **Function not found (404):**

   - Check that `netlify.toml` is in the root directory
   - Verify the functions directory path in `netlify.toml`
   - Ensure the function file is named correctly

2. **CORS errors:**

   - The function includes proper CORS headers
   - No additional configuration needed

3. **Environment variables not working:**

   - Redeploy the site after adding environment variables
   - Check variable names are exact matches

4. **API requests failing:**
   - Test the function endpoints directly first
   - Check browser network tab for error details
   - Verify OMDB API key is valid

### Function Logs:

- View function logs in Netlify dashboard under Functions tab
- Logs show detailed error information for debugging

## ✅ Benefits of This Setup

1. **No separate backend server needed**
2. **Automatic scaling with Netlify**
3. **Built-in CORS handling**
4. **Environment variable support**
5. **Free tier available**
6. **Integrated with your frontend deployment**

## 🔄 Development vs Production

### Development (Local):

- Use `netlify dev` to test functions locally
- Functions run at `http://localhost:8888/.netlify/functions/api`

### Production (Deployed):

- Functions automatically deployed with your site
- Available at your site URL + `/.netlify/functions/api`
- Redirected to `/api/*` for cleaner URLs

## 📝 Next Steps

1. **Deploy the changes** by pushing to your repository
2. **Test all endpoints** using the URLs above
3. **Verify your React app** is working with the new API
4. **Monitor function usage** in Netlify dashboard
5. **Consider upgrading OMDB API key** for higher limits if needed

Your MovieLand app will now run entirely on Netlify with no external dependencies!
