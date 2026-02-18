# Health Insurance Web Application

A full-stack health insurance platform with AI-powered premium prediction, built with React, Node.js, FastAPI, and MySQL.

![Architecture](https://img.shields.io/badge/Architecture-Microservices-blue)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933)
![ML](https://img.shields.io/badge/ML-FastAPI%20%2B%20scikit--learn-009688)
![Database](https://img.shields.io/badge/Database-MySQL-4479A1)

---

## 🏗 Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   React App  │────→│  Node.js API │────→│  FastAPI ML  │
│  (Port 3000) │     │  (Port 5000) │     │  (Port 8000) │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │
                     ┌──────▼───────┐
                     │    MySQL     │
                     │  (Port 3306) │
                     └──────────────┘
```

## 🚀 Features

- **Public Website**: Home, About, Plans, FAQ, Contact pages
- **User Authentication**: JWT-based signup/login with bcrypt password hashing
- **AI Premium Prediction**: ML-powered health insurance premium estimation
- **Prediction History**: Interactive Chart.js visualizations
- **Admin Panel**: User management, plan CRUD, analytics dashboard
- **Role-Based Access**: User and admin protected routes
- **Responsive Design**: Modern dark theme with glassmorphism and animations
- **Microservices Architecture**: Separate frontend, backend, and ML services

## 📦 Tech Stack

| Layer      | Technology                                  |
| ---------- | ------------------------------------------- |
| Frontend   | React (Vite), Tailwind CSS, Chart.js, Axios |
| Backend    | Node.js, Express, MySQL2, JWT, bcrypt       |
| ML Service | Python FastAPI, scikit-learn, joblib        |
| Database   | MySQL 8.0                                   |
| DevOps     | Docker, Docker Compose                      |

## 🛠 Setup Instructions

### Prerequisites

- **Node.js 18+** — https://nodejs.org
- **Python 3.9+** — https://python.org
- **Docker Desktop** — https://docker.com (for MySQL)

### ⚡ Quick Start (One Command)

Clone the repo and run the all-in-one setup script:

```powershell
git clone <repo-url>
cd health-insurance-app
powershell -ExecutionPolicy Bypass -File .\setup-and-run.ps1
```

This single script will:

1. ✅ Check that Node.js, Python, and Docker are installed
2. ✅ Create & start a MySQL container with the database schema
3. ✅ Create the server `.env` configuration file
4. ✅ Install all Python dependencies (ML service)
5. ✅ Install all Node.js dependencies (server + client)
6. ✅ Launch all 3 services in separate terminal windows

### Manual Setup (Step by Step)

#### 1. Database Setup

```bash
mysql -u root -p < database/schema.sql
```

#### 2. Backend Server

```bash
cd server
cp .env.example .env    # Edit with your DB credentials
npm install
npm run dev             # Starts on port 5001
```

#### 3. ML Microservice

```bash
cd ml-service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### 4. Frontend

```bash
cd client
npm install
npm run dev             # Starts on port 3000
```

### Docker Compose (Alternative)

```bash
docker-compose up --build
```

## 🔐 Default Admin Account

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | admin@healthinsure.com |
| Password | admin123               |

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |

### User (Protected)

| Method | Endpoint                | Description            |
| ------ | ----------------------- | ---------------------- |
| GET    | `/api/user/profile`     | Get user profile       |
| POST   | `/api/user/predict`     | Submit prediction      |
| GET    | `/api/user/predictions` | Get prediction history |

### Admin (Admin Only)

| Method | Endpoint               | Description        |
| ------ | ---------------------- | ------------------ |
| GET    | `/api/admin/users`     | List all users     |
| GET    | `/api/admin/plans`     | List all plans     |
| POST   | `/api/admin/plans`     | Create plan        |
| PUT    | `/api/admin/plans/:id` | Update plan        |
| DELETE | `/api/admin/plans/:id` | Delete plan        |
| GET    | `/api/admin/analytics` | Platform analytics |

### ML Service

| Method | Endpoint   | Description      |
| ------ | ---------- | ---------------- |
| POST   | `/predict` | Predict premium  |
| GET    | `/health`  | Health check     |
| GET    | `/docs`    | Swagger API docs |

## 🧠 ML Model Logic

- **Age < 25**: Uses `model_young` + `scaler_young`
- **Age ≥ 25**: Uses `model_rest` + `scaler_rest`

### Risk Categories

| Premium Range    | Category    |
| ---------------- | ----------- |
| < $5,000         | Low Risk    |
| $5,000 – $10,000 | Medium Risk |
| > $10,000        | High Risk   |

## 📁 Project Structure

```
health-insurance-app/
├── client/                    # React + Vite
│   ├── src/
│   │   ├── api/               # Axios config
│   │   ├── components/        # Navbar, Footer, ProtectedRoute
│   │   ├── context/           # Auth context
│   │   └── pages/
│   │       ├── public/        # Home, About, Plans, FAQ, Contact
│   │       ├── auth/          # Login, Signup
│   │       ├── user/          # Dashboard, Prediction, History, Profile
│   │       └── admin/         # Admin Dashboard, Users, Plans, Analytics
│   └── Dockerfile
├── server/                    # Node.js + Express
│   ├── config/                # DB connection
│   ├── middleware/             # JWT auth
│   ├── routes/                # Auth, User, Admin
│   └── Dockerfile
├── ml-service/                # Python FastAPI
│   ├── main.py
│   ├── models/                # joblib model files
│   └── Dockerfile
├── database/
│   └── schema.sql
├── docker-compose.yml
└── README.md
```

## 📄 License

MIT License
