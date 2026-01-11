# Deployment Guide

This guide covers deploying the Weather Dashboard application with:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

## Prerequisites

- GitHub account with the repository pushed
- MongoDB Atlas account
- Render account
- Vercel account
- OpenWeatherMap API key

---

## 1. MongoDB Atlas Setup

### Create a Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new project or use existing one
3. Click **Build a Database** → Select **Free Tier (M0)**
4. Choose a cloud provider and region
5. Click **Create Cluster**

### Configure Database Access

1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Create a username and strong password
4. Set privileges to **Read and write to any database**
5. Click **Add User**

### Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (adds `0.0.0.0/0`)
   - Required for Render free tier (dynamic IPs)
4. Click **Confirm**

### Get Connection String

1. Go to **Database** → Click **Connect** on your cluster
2. Select **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with `weather-dashboard`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/weather-dashboard?retryWrites=true&w=majority
```

---

## 2. Backend Deployment (Render)

### Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `weather-dashboard-api` |
| **Region** | Oregon (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | *(leave empty)* |
| **Runtime** | Node |
| **Build Command** | `cd packages/backend && npm install --include=dev && npm run build` |
| **Start Command** | `cd packages/backend && npm start` |
| **Plan** | Free |

### Environment Variables

Add these environment variables in Render dashboard:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Generate a secure random string (32+ chars) |
| `JWT_REFRESH_SECRET` | Generate another secure random string |
| `OPENWEATHERMAP_API_KEY` | Your OpenWeatherMap API key |
| `FRONTEND_URL` | Your Vercel frontend URL (e.g., `https://your-app.vercel.app`) |
| `CORS_ORIGIN` | Same as FRONTEND_URL |

### Deploy

1. Click **Create Web Service**
2. Wait for the build to complete
3. Note your backend URL (e.g., `https://weather-backend-xxxx.onrender.com`)

---

## 3. Frontend Deployment (Vercel)

### Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure the project:

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `packages/frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### Environment Variables

Add this environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-render-backend.onrender.com/api` |

> ⚠️ **Important**: The URL must end with `/api`

### Deploy

1. Click **Deploy**
2. Wait for the build to complete
3. Note your frontend URL

### Update Backend CORS

After getting your Vercel URL, go back to Render and update:
- `FRONTEND_URL` = Your Vercel URL
- `CORS_ORIGIN` = Your Vercel URL

---

## 4. Verify Deployment

### Health Check

Visit your backend health endpoint:
```
https://your-render-backend.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Weather Dashboard API is running",
  "timestamp": "2026-01-12T..."
}
```

### Test Frontend

1. Visit your Vercel URL
2. Try searching for a city
3. Register a new account
4. Login and add favorites

---

## Troubleshooting

### CORS Errors

- Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
- No trailing slash (use `https://app.vercel.app` not `https://app.vercel.app/`)
- Redeploy backend after changing environment variables

### MongoDB Connection Failed

- Check IP whitelist in MongoDB Atlas (should include `0.0.0.0/0`)
- Verify `MONGODB_URI` is correct with proper password
- Ensure password doesn't contain special characters that need URL encoding

### 401 Unauthorized on Favorites

- Cookies require `sameSite: 'none'` for cross-origin (already configured)
- Ensure both frontend and backend are on HTTPS
- Try logging out and logging in again

### Build Failures

- Ensure build command includes `--include=dev` for dev dependencies
- Check that all TypeScript types are installed

### Rate Limit Errors

- `trust proxy` must be enabled for Render (already configured)
- Check Render logs for specific error messages

---

## Environment Variables Reference

### Backend (Render)

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
OPENWEATHERMAP_API_KEY=your-openweathermap-api-key
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Useful Links

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [OpenWeatherMap API](https://openweathermap.org/api)
