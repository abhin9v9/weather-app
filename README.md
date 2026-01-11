# 🌤️ Weather Dashboard Application

A production-ready full-stack weather dashboard built with React, TypeScript, Node.js, Express, and MongoDB.

## ✨ Features

- 🔍 **City Search**: Search for any city worldwide and view current weather
- 🌡️ **Real-time Weather Data**: Temperature, humidity, wind speed, and conditions
- ⭐ **Favorite Cities**: Save and manage your favorite locations
- 🔐 **User Authentication**: Secure JWT-based authentication system
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🌙 **User Preferences**: Customize temperature units (Celsius/Fahrenheit)
- 🔒 **Secure API**: Backend proxy protects API keys from exposure

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  React Frontend │────▶│  Express Backend │────▶│  MongoDB Atlas  │
│  (Vercel)       │     │  (Render)        │     │                 │
│                 │     │                  │     └─────────────────┘
└─────────────────┘     │                  │
                        │                  │     ┌─────────────────┐
                        │                  │────▶│  OpenWeatherMap │
                        │                  │     │  API            │
                        └──────────────────┘     └─────────────────┘
```

### Data Flow

1. **User Request**: User searches for a city or interacts with the UI
2. **Frontend**: React app sends request to Express backend
3. **Backend**: Express validates request, checks auth, and proxies to OpenWeatherMap
4. **External API**: OpenWeatherMap returns weather data
5. **Response**: Backend transforms and returns data to frontend
6. **Display**: React renders weather information

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI library |
| TypeScript | Type safety |
| Vite | Build tool |
| Redux Toolkit | State management |
| RTK Query | API caching |
| Tailwind CSS | Styling |
| React Router | Navigation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 20+ | Runtime |
| Express | Web framework |
| TypeScript | Type safety |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |

## 📦 Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0 or **yarn** >= 1.22.0
- **MongoDB** (local or Atlas)
- **Docker** (optional, for local MongoDB)
- **OpenWeatherMap API Key** (free tier available)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/weather-dashboard.git
cd weather-dashboard
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm install
```

### 3. Set Up MongoDB

**Option A: Using Docker (Recommended for development)**
```bash
docker-compose up -d mongodb
```

**Option B: Using MongoDB Atlas**
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Add it to your environment variables

### 4. Get OpenWeatherMap API Key

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Generate an API key (free tier: 60 calls/minute)
3. Add it to your environment variables

## ⚙️ Environment Variables

### Backend (`packages/backend/.env`)

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/weather-dashboard

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-token-secret-also-32-chars-min
JWT_REFRESH_EXPIRES_IN=7d

# OpenWeatherMap API
OPENWEATHER_API_KEY=your-openweathermap-api-key

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend (`packages/frontend/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Weather Dashboard
```

## 🏃 Running the Application

### Development Mode

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
npm run dev:backend  # Starts backend on http://localhost:5000
npm run dev:frontend # Starts frontend on http://localhost:5173
```

### Production Build

```bash
# Build both packages
npm run build

# Start production server
npm start
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| POST | `/api/auth/refresh` | Refresh access token | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Weather Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/weather?city={name}` | Get weather by city name | No |
| GET | `/api/weather?lat={lat}&lon={lon}` | Get weather by coordinates | No |
| GET | `/api/weather/forecast?city={name}` | Get 5-day forecast | No |

### Favorites Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/favorites` | Get user's favorites | Yes |
| POST | `/api/favorites` | Add favorite city | Yes |
| DELETE | `/api/favorites/:id` | Remove favorite | Yes |

### Request/Response Examples

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

#### Get Weather
```bash
GET /api/weather?city=London
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "data": {
    "city": "London",
    "country": "GB",
    "temperature": 15,
    "feelsLike": 13,
    "humidity": 72,
    "windSpeed": 5.2,
    "description": "scattered clouds",
    "icon": "03d",
    "coordinates": {
      "lat": 51.5074,
      "lon": -0.1278
    }
  }
}
```

## 🚢 Deployment

### Backend Deployment (Render)

1. **Create Render Account**: Sign up at [render.com](https://render.com)

2. **Create New Web Service**:
   - Connect your GitHub repository
   - Select the `packages/backend` directory
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

3. **Configure Environment Variables** in Render dashboard

4. **Deploy**: Render will auto-deploy on push to main branch

### Frontend Deployment (Vercel)

1. **Create Vercel Account**: Sign up at [vercel.com](https://vercel.com)

2. **Import Project**:
   - Connect GitHub repository
   - Set root directory: `packages/frontend`
   - Framework preset: Vite

3. **Configure Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

4. **Deploy**: Vercel will auto-deploy on push

### MongoDB Atlas Setup

1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user with read/write access
3. Whitelist IP addresses (or allow all: `0.0.0.0/0`)
4. Get connection string and add to backend environment

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests only
npm run test --workspace=backend

# Run frontend tests only
npm run test --workspace=frontend

# Run tests with coverage
npm run test:coverage
```

## 📁 Project Structure

```
weather-dashboard/
├── packages/
│   ├── frontend/              # React + Vite + TypeScript
│   │   ├── src/
│   │   │   ├── api/           # RTK Query API definitions
│   │   │   ├── components/    # React components
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── pages/         # Page components
│   │   │   ├── store/         # Redux store
│   │   │   ├── types/         # TypeScript types
│   │   │   └── utils/         # Utility functions
│   │   ├── public/            # Static assets
│   │   └── ...config files
│   │
│   └── backend/               # Express + TypeScript
│       ├── src/
│       │   ├── config/        # Configuration
│       │   ├── controllers/   # Route handlers
│       │   ├── middlewares/   # Express middlewares
│       │   ├── models/        # Mongoose models
│       │   ├── routes/        # API routes
│       │   ├── services/      # Business logic
│       │   ├── types/         # TypeScript types
│       │   └── utils/         # Utility functions
│       └── ...config files
│
├── docker-compose.yml         # Local development services
├── package.json               # Root package.json
└── README.md                  # This file
```

## 🔮 Future Improvements

- [ ] Weather alerts and notifications
- [ ] Hourly forecast display
- [ ] Weather maps integration
- [ ] PWA support for offline access
- [ ] Dark/Light theme toggle
- [ ] Multiple language support (i18n)
- [ ] Social login (Google, GitHub)
- [ ] Weather history and trends
- [ ] Unit tests with >80% coverage
- [ ] E2E tests with Playwright

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React, Express, TypeScript, and MongoDB**
