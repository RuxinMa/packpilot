# LS1 Project - Quick Start Guide

## Prerequisites

### Install Docker Desktop

Make sure you have **Docker Desktop** installed on your system:
- Download from: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- Docker Compose is included with Docker Desktop

### Verify Installation

After installation, verify that Docker is working properly:

```bash
docker --version
docker compose version
```

You should see output similar to:
```
Docker version 24.0.x, build xxxxx
Docker Compose version v2.x.x
```

**If commands are not found:** Make sure Docker Desktop is installed and running, then restart your terminal.

## How to Run the Project

### 1. Start the Application

In the project root directory, run:

```bash
docker compose up --build -d
```

This command will:
- Build and start both frontend (React + Vite) and backend (Flask) services
- Run containers in the background

### 2. Access the Application

Open your browser and go to:
- **[http://localhost:5173](http://localhost:5173)**

### 3. Stop the Application

To stop all services:

```bash
docker compose down
```

## Troubleshooting

### Database Issues

If you notice data is not saving or appears outdated:

1. Stop the application:
   ```bash
   docker compose down
   ```

2. Remove the database file:
   ```bash
   rm backend/app/db/app.dbs
   ```

3. Restart the application:
   ```bash
   docker compose up --build -d
   ```

---

That's it!
