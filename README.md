# PackPilot 📦

An AI-powered warehouse management platform featuring dual-user interfaces for managers and workers with real-time synchronization and 3D/2D packing visualization.

## 🌐 Live Demo

**Frontend (Vercel):** [https://packpilot-frontend.vercel.app](https://packpilot-frontend.vercel.app)  
**Backend API (Railway):** [https://packpilot-production.up.railway.app](https://packpilot-production.up.railway.app)

### Test Accounts
- **Manager:** username: `manager1`, password: `password123`
- **Worker:** username: `worker1`, password: `password123`

## 👥 Team Members

| Name | Role | GitHub |
|------|------|--------|
| Ruxin Ma| Team Lead, Frontend Developer | [@RuxinMa] |
| Feinan Guo | Backend Developer | [@username2] |
| Jiahui Huang | 3D Visualization Engineer | [@username3] |
| Jiabao Ye | Algorithm Engineer | [@username4] |
| Xuran Chen | Backend Developer | [@username4] |
| Shiyu Zhao | Frontend Developer | [@username4] |

## 🚀 Project Overview

PackPilot is a comprehensive warehouse management solution that streamlines inventory operations through:

- **Dual User Interfaces**: Separate dashboards for managers and workers
- **Real-time Synchronization**: Live updates across all user sessions
- **AI-Powered Optimization**: Intelligent packing algorithms
- **3D/2D Visualization**: Interactive container and item visualization
- **Task Management**: Assign, track, and complete warehouse tasks
- **Inventory Control**: Add, update, and manage items and containers

## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | TypeScript, React, Tailwind CSS, Three.js |
| **Backend** | Python, Flask, SQLAlchemy, RESTful API |
| **Database** | SQLite (Development), PostgreSQL (Production) |
| **Authentication** | JWT, bcrypt |
| **Deployment** | Vercel (Frontend), Railway (Backend), Docker |
| **Version Control** | Git, GitHub |
| **Testing** | React Testing Library, Pytest |


## 🐳 Development Setup (Docker)

### Prerequisites

1. **Docker Desktop** installed and running
   - Download: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
   - Verify installation:
     ```bash
     docker --version
     docker compose version
     ```

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PackPilot
   ```

2. **Start the application**
   ```bash
   cd integration/
   docker compose up --build -d
   ```

3. **Access the application**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)

4. **Stop the application**
   ```bash
   docker compose down
   ```

### Development Workflow

- **Live Reload**: Both frontend and backend support hot reloading
- **Database Persistence**: Data persists between container restarts
- **Logs**: View logs with `docker compose logs -f`
- **Reset Database**: 
  ```bash
  docker compose down
  rm backend/app/db/app.db
  docker compose up --build -d
  ```

## 🌟 Key Features

### For Managers
- **Dashboard Overview**: Real-time statistics and insights
- **Inventory Management**: Add, edit, and delete items and containers
- **Task Assignment**: Create and assign tasks to workers
- **AI Optimization**: Optimize packing strategies
- **Analytics**: Track performance metrics

### For Workers
- **Task Queue**: View assigned tasks
- **Item Scanning**: Quick item lookup and updates
- **Task Completion**: Mark tasks as completed
- **Real-time Updates**: See live inventory changes

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Sync**: WebSocket-like behavior for live updates
- **3D Visualization**: Interactive container packing views
- **RESTful API**: Clean, documented API endpoints
- **Authentication**: Secure JWT-based auth system

## 🚀 Deployment

### Production URLs
- **Frontend**: Deployed on Vercel with automatic CI/CD from GitHub
- **Backend**: Deployed on Railway with PostgreSQL database
- **Domain**: Custom domains configured for both services

### Environment Variables
```bash
# Backend (Railway)
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=your-secret-key

# Frontend (Vercel)
VITE_API_BASE_URL=https://packpilot-production.up.railway.app
```

## 🆘 Support

For questions or issues:
- Create an issue on GitHub
- Contact the development team
- Check the documentation in `/packpilot_docs/`

---

**Built with ❤️ by the PackPilot Team**