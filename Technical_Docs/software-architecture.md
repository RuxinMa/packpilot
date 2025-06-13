# System Overview
LS1 is a full-stack web application built with a microservices-oriented architecture featuring a React-based frontend and a Flask-based backend API, designed for inventory and task management with AI optimization capabilities.

# Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                React Frontend                           │    │
│  │  • TypeScript + React 19                                │    │
│  │  • Vite Build Tool                                      │    │
│  │  • TailwindCSS + Three.js                               │    │
│  │  • Context API (Auth, Item, Task)                       │    │
│  │  • React Router DOM                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                               │
                        HTTP/REST API
                               │
┌─────────────────────────────────────────────────────────────────┐
│                    REVERSE PROXY LAYER                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     Nginx                               │    │
│  │  • Static File Serving                                  │    │
│  │  • SPA Routing Support                                  │    │
│  │  • Gzip Compression                                     │    │
│  │  • Security Headers                                     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                               │
                        API Gateway
                               │
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                Flask Backend API                        │    │
│  │  ┌─────────────┬─────────────┬─────────────┬─────────┐  │    │
│  │  │    Auth     │    Item     │    Task     │   AI    │  │    │
│  │  │   Module    │   Module    │   Module    │ Module  │  │    │
│  │  │             │             │             │         │  │    │
│  │  │ • JWT Auth  │ • CRUD Ops  │ • CRUD Ops  │ • Optim │  │    │
│  │  │ • Role Mgmt │ • Inventory │ • Workflow  │ • Layout│  │    │
│  │  │ • Security  │ • Tracking  │ • Status    │ • AI    │  │    │
│  │  └─────────────┴─────────────┴─────────────┴─────────┘  │    │
│  │                                                         │    │
│  │  ┌─────────────┬─────────────────────────────────────┐  │    │
│  │  │ Container   │           Core Services             │  │    │
│  │  │   Module    │                                     │  │    │
│  │  │             │ • Configuration Management          │  │    │
│  │  │ • Storage   │ • Database Connection Pool          │  │    │
│  │  │ • Capacity  │ • CORS & Security                   │  │    │
│  │  │ • Location  │ • Error Handling                    │  │    │
│  │  └─────────────┴─────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                               │
                        ORM (SQLAlchemy)
                               │
┌─────────────────────────────────────────────────────────────────┐
│                     DATA LAYER                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    SQLite Database                      │    │
│  │                                                         │    │
│  │  ┌──────────┬─────────┬─────────┬──────────┬──────────┐ │    │
│  │  │  Users   │  Items  │  Tasks  │Container │TaskItems │ │    │
│  │  │          │         │         │          │          │ │    │
│  │  │• ID      │• ID     │• ID     │• ID      │• TaskID  │ │    │
│  │  │• Username│• Name   │• Name   │• Name    │• ItemID  │ │    │
│  │  │• Password│• Type   │• Status │• Type    │• Quantity│ │    │
│  │  │• Role    │• Weight │• Worker │• Size    │• Status  │ │    │
│  │  │          │• Size   │• Created│• Capacity│          │ │    │
│  │  └──────────┴─────────┴─────────┴──────────┴──────────┘ │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

# Technology Stack
## Frontend (React SPA)
- **Framework**: React 19 with TypeScript  
- **Build Tool**: Vite 6.2.0  
- **Styling**: TailwindCSS with custom components  
- **3D Graphics**: Three.js for visualization  
- **Routing**: React Router DOM 7.5.0  
- **State Management**: React Context API  
- **Icons**: Lucide React + React Icons  
- **HTTP Client**: Fetch API  

## Backend (Flask API)
- **Framework**: Flask 2.3.3  
- **WSGI Server**: Gunicorn 21.2.0  
- **Database ORM**: SQLAlchemy 2.0.23  
- **Authentication**: JWT with python-jose + passlib  
- **Validation**: Pydantic 2.5.2  
- **CORS**: Flask-CORS 4.0.0  
- **AI/ML**: NumPy for optimization algorithms  

## Database
- **Primary DB**: SQLite (app.db)  
- **ORM**: SQLAlchemy with declarative models  
- **Migration**: Auto-creation via SQLAlchemy  

## Deployment & Infrastructure
- **Web Server**: Nginx (reverse proxy)  
- **Process Manager**: Gunicorn WSGI server  
- **Static Assets**: Nginx static file serving  
- **Security**: CORS, XSS protection, frame options  

# Core Modules & Responsibilities

## Backend Modules

### Auth Module (`/auth/`)
- JWT token-based authentication  
- Role-based access control (Manager/Worker)  
- Password hashing with bcrypt  

### Item Module (`/Item/`)
- Inventory item management  
- CRUD operations for items  
- Item categorization and tracking  

### Task Module (`/Task/`)
- Task assignment and workflow  
- Status tracking and updates  
- Task-item relationships  

### Container Module (`/Container/`)
- Storage container management  
- Capacity and location tracking  
- Container optimization  

### AI Module (`/AI/`)
- Task optimization algorithms  
- Layout optimization  
- AI-powered recommendations   

# Security Architecture
- **Authentication**: JWT-based with role separation  
- **CORS**: Configured for specific origins  
- **Password Security**: bcrypt hashing  
- **Input Validation**: Pydantic models  
- **HTTP Security**: Nginx security headers  
- **API Protection**: Role-based access control  

# Deployment Architecture
- **Frontend Container**
    - Base Image: Nginx Alpine
    - Content: React production build + Nginx configuration
    - Port: 5173 (HTTP)
    - Purpose: Serves static assets and handles SPA routing
- **Backend Container**
    - Base Image: Python Alpine
    - Runtime: Gunicorn WSGI server
    - Port: 8000 (internal)
    - Dependencies: Flask + SQLAlchemy + JWT libraries
- **Data Persistence**
    - Volume Mount: Database file persistence
    - SQLite: Containerized database with host volume binding
    - Backup: Volume-based data backup strategy