
## 1. Purpose of This Document

This guide is written for *new developers* joining the LS1 project. It explains how to correctly run and deploy the LS1 web application (frontend + backend) using Docker.

It is structured in the order you would actually perform tasks:

1. Understand why we use Docker and how the project is structured
2. Install necessary tools and check versions
3. Deploy the full system in one step using Docker
4. Debug issues if anything fails

By the end of this guide, you should be able to:

* Understand the role of Docker in this project
* Set up your environment from scratch
* Run the system in both development and production modes

This guide is written for *new developers* joining the LS1 project. It explains how to correctly run and deploy the LS1 web application (frontend + backend) using Docker.

Not only will it show you *what commands to run*, but also *why each step is necessary* and *where to run it*.

By the end of this guide, you should be able to:

* Understand the role of Docker in this project
* Set up your environment from scratch
* Run the system in both development and production modes

## 2. Required Tools

To deploy and run the LS1 project, you need to prepare your local machine by installing the following tools:

* **Docker Desktop** (version 20.10 or later)
  Download: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

* **Docker Compose** (version 2.0 or later)
  Included with Docker Desktop

* **Node.js** (version 16 or later, required only for frontend development)
  Download: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

* **Python** (version 3.8 or later, required only for backend development)
  Download: [https://www.python.org/downloads/](https://www.python.org/downloads/) 3.8+             | [https://www.python.org/downloads/](https://www.python.org/downloads/) |

### Step-by-step Setup

1. **Install Docker Desktop**

   * Download and install Docker Desktop from the link above.
   * After installation, launch Docker Desktop and ensure it is running.

2. **Check Docker version**

   * Open your terminal (Mac: Spotlight → Terminal / Windows: Start → Command Prompt or Terminal) and run:

```bash
docker --version
docker compose version
```

* If version is below the required, update Docker from the official site.

3. **Install Node.js** (for development use only)

   * Download and install from the link.
   * After install, run:

```bash
node -v
```

4. **Install Python 3.8+** (for development use only)

   * Visit the Python website and download the latest version.
   * Verify installation:

```bash
python --version
```

After the above steps, your local system is ready to start running the LS1 project.

Open your terminal and run:

```bash
docker --version
docker compose version
node -v
python --version
```

If any tool is missing, install it from the links above.

## 3. Why We Use Docker

Docker allows us to:

* Create a *consistent environment* across all developer machines
* Avoid conflicts from differing setups
* Bundle and deploy the project the same way everywhere

Without Docker, everyone would need to manually install Node.js, Python packages, and configure environments.

With Docker, everything is defined in a container and isolated.

## 4. Project Architecture Overview

The LS1 application has two main components:

* *Frontend*

  * React + Vite + Tailwind
  * Located in `docker/` (main file in `src/`)
  * Uses `vite.config.ts` and `.env`
  * Served by Nginx in production

* *Backend*

  * Flask + SQLAlchemy
  * Located in `docker/backend/app/`
  * Subfolders: `auth/`, `core/`, `db/`
  * Entrypoint: `main.py` or `wsgi.py`

These are connected using:

* `Dockerfile` (frontend)
* `backend.Dockerfile`
* `docker-compose.yml`

## 5. File Structure Summary

```bash
├── backend/            # Flask backend
│   ├── app/            # Main backend code (auth/, core/, db/)
│   ├── wsgi.py         # WSGI entrypoint
│   └── requirements.txt
├── src/                # React frontend source code
│   ├── components/     # UI components
│   ├── pages/          # Page-level components
│   ├── services/       # API calls and logic
│   ├── routes/         # Route definitions
│   ├── hooks/          # Custom React hooks
│   ├── types/          # TypeScript type declarations
│   └── main.tsx        # Entry point for React app
├── index.html          # HTML template used by Vite
├── vite.config.ts      # Vite config file
├── backend.Dockerfile  # Dockerfile for backend
├── Dockerfile          # Dockerfile for frontend
├── docker-compose.yml  # Compose config for full stack
```

## 6. Development Mode (Local Debugging)

Use this for hot-reload development when working on frontend or backend code separately.

### Start Frontend

Open terminal and run the following commands **one by one**:

```bash
cd frontend
npm install
npm run dev
```

This starts the frontend Vite dev server at:
[http://localhost:5173](http://localhost:5173)

### Start Backend

Open another terminal tab and run the following commands **one by one**:

```bash
cd backend
pip install -r requirements.txt
python app/main.py
```

Or you can run it with Flask CLI:

```bash
export FLASK_APP=app/main.py
flask run
```

This starts the backend API server at:
[http://localhost:8000/api](http://localhost:8000/api)

## 7. Production Deployment (Using Docker)

Use this for stable deployment.

### Run Both Services

In project root directory, run:

```bash
docker compose up --build -d
```

* `--build` ensures updates are applied
* `-d` keeps it running in the background

### Access URLs

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend: [http://localhost:8000/api](http://localhost:8000/api)

### Stop Containers

```bash
docker compose down
```

## 8. Environment Variables

### Frontend `.env`

Located in `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

Used in `services/` files and `vite.config.ts`

### Backend `.env` (optional)

Located in `backend/`:

```env
DATABASE_URL=sqlite:///app.db
SECRET_KEY=your-secret
```

Changes require:

```bash
docker compose up --build
```

## 9. Useful Docker Commands

| Command                     | Description                |
| --------------------------- | -------------------------- |
| `docker compose up --build` | Build and start everything |
| `docker compose down`       | Stop and clean up          |
| `docker ps`                 | List containers            |
| `docker logs <name>`        | Check logs                 |
| `docker exec -it <name> sh` | Enter container shell      |

Run all commands from project root.

## 10. Troubleshooting

This section breaks down common problems into separate numbered items. Follow the instructions to diagnose and fix each issue.

### 10.1 Frontend does not load

* **Symptom:** Page does not open at `http://localhost:5173`
* **Check:** Run `docker ps` in terminal. Is the frontend container running?
* **Cause:** The frontend container may have failed to start.
* **Fix:** Try restarting everything with:

```bash
docker compose down
docker compose up --build -d
```

---

### 10.2 Backend API returns 404

* **Symptom:** Calling `http://localhost:8000/api/...` returns 404
* **Check:** Confirm backend is up and the route starts with `/api`
* **Cause:** Backend is not running or the URL path is incorrect
* **Fix:** Run backend manually or with Docker. Verify you’re using the correct API prefix.

---

### 10.3 Changes in `.env` not applied

* **Symptom:** Frontend or backend ignores your `.env` updates
* **Cause:** Docker caches old config
* **Fix:** Rebuild with:

```bash
docker compose up --build -d
```

---

### 10.4 Containers crash immediately

* **Symptom:** `docker ps` shows container exited
* **Check:** View logs:

```bash
docker logs <container_name>
```

* **Cause:** Runtime error or dependency issue
* **Fix:** Fix the code error based on logs and rebuild

---

### 10.5 Frontend can't talk to backend

* **Symptom:** Console error or fetch fails
* **Check:** Open browser dev tools → Console
* **Cause:** Wrong `VITE_API_URL` or CORS error
* **Fix:** Edit `frontend/.env` and make sure it says:

```env
VITE_API_URL=http://localhost:8000/api
```

Then rebuild Docker.

---

### 10.6 Database not updating

* **Symptom:** Changes aren’t saved, data looks stale
* **Cause:** Backend isn’t writing to DB or using old DB file
* **Fix:** Manually delete `app.db` from `backend/` and restart everything:

1. Stop containers:

```bash
docker compose down
```

2. Delete the database:

```bash
rm backend/app.db
```

3. Rebuild and restart:

```bash
docker compose up --build -d
```

## 11. Git Branches

This section shows commonly used Git branches in our development workflow.

* `feature/*` — Temporary feature development branches
* `dev-frontend` — Main development branch for frontend
* `dev-backend` — Main development branch for backend
* `docker` — Deployment and Dockerfile-related updates
* `frontend_worker` — Special UI branch for worker-facing features

Only deploy from merged branches like `dev-*`. Do not deploy from `feature/*` directly.

---

Last updated: May 2025
Maintained by: LS1 Team



