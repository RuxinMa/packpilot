# PackPilot 📦

An AI-powered warehouse management platform - `PackPilot`, featuring dual-user interfaces for managers and workers with real-time synchronization and 3D/2D packing visualization.

## 🌐 Live Demo

**Frontend (Vercel):** [https://packpilot-frontend.vercel.app](https://packpilot-frontend.vercel.app)  
**Backend API (Railway):** [https://packpilot-production.up.railway.app](https://packpilot-production.up.railway.app)

### Test Accounts
- **Manager:** username: `manager`, password: `password123`
- **Worker:** username: `worker1`/`worker2`/`worker3`, password: `password123`

## 👥 Team Members

| Name | Role | GitHub |
|------|------|--------|
| Ruxin Ma| Team Lead, Frontend Developer | [@RuxinMa] |
| Feinan Guo | Backend Developer | [@Richkwokkk] |
| Jiahui Huang | 3D Visualization Engineer | [@Itsgreyya] |
| Jiabao Ye | Algorithm Engineer | [@Jer233] |
| Xuran Chen | Backend Developer | [@calvinjshaw] |
| Shiyu Zhao | Frontend Developer | [@mangosherry] |

## 🚀 Project Overview

PackPilot is a comprehensive warehouse management solution that streamlines inventory operations through:

- **Dual User Interfaces**: Separate dashboards for managers and workers
- **Real-time Synchronization**: Live updates across all user sessions
- **AI-Powered Optimization**: Intelligent AI-powered packing algorithms integration
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
   cd packpilot/
   ```

2. **Start the application**
   ```bash
   docker compose up --build -d
   ```

3. **Access the application**
   - **Frontend:** [http://localhost:5173](http://localhost:5173)
   - **Backend API:** [http://localhost:5000](http://localhost:5000)

4. **Stop the application**
   ```bash
   docker compose down
   ```

## 🌟 Key Features

### For Managers
- **Login**: Secure authentication with role-based access
- **Inventory Management**: Add, edit, and delete items with detailed specifications
- **Task Assignment**: Create and assign tasks to workers
- **Task Monitoring**: Track task history and completion status

### For Workers
- **Login**: Quick and secure worker authentication
- **Task Reception**: Streamlined task selection and acceptance
- **Task Operation**: Next/previous navigation buttons with real-time progress tracking
- **Visualisation and Guidance**: Intuitive 3D/2D packing guidance powered by AI optimization algorithms 

### Technical Features
- **Real-time Sync**: Live updates and synchronization across all connected clients
- **3D Visualization**: Interactive container packing views with dual 2D/3D perspectives
- **RESTful API**: Clean, well-documented API endpoints for seamless integration
- **Authentication**: Secure JWT-based authentication system with role management

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