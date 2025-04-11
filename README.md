# LS1 Warehouse Packing Project Overview

## Project Goal
We're creating a visualization tool to help warehouse workers optimize how they pack items, transforming what is currently an experience-based process into one guided by optimization algorithms.

## Project Scope
- The project addresses the gap between AI optimization solutions and practical implementation
- We'll be developing a web application to guide workers in following AI-recommended packing arrangements

## Team Structure
- **Supervisor:** Lia Song
- **Team Members:**
  - Feinan Guo
  - Jiahui Huang
  - Ruxin Ma
  - Shiyu Zhao 
  - Xuran Chen 
  - Jiabao Ye (External)

## Technology Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | Language: TypeScript<br>Fraemwork: React<br>CSS: Tailwind CSS<br>Build Tool: Vite|
| **Backend** | Language: Python<br>Fraemwork: Flask<br>API: RESTful API |
| **Database** | MySQL |
| **Visualization** | Blender |
| **Deployment** | Deploy: Netlify<br>CI/CD: GitHub Actions |
| **Version Control** | Git with GitHub |
| **Testing** | Frontend: React Testing Library <br>Backend: Pytest|



## Project Timeline

- Sprint 1 (Week2-4): Requirements Gathering & Project Plan
- Sprint 2 (Week5-6): Technical Design
- Sprint 3 (Week7-8): Development
- Sprint 4 (Week9-10): Development
- Sprint 5 (Week11-12): Testing & Refinement
- Sprint 6 (Week13-14): Final Launch


## Dev Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Frontend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/your-org/LS1.git
   cd LS1
   git checkout main
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173



## Development Workflow

### Branch Structure
- **main**: Web application production code
- **docs**: All project documentation (project docs, meetings and timesheets)
- **feature/[feature-name]**: Individual feature development
- **bugfix/[bug-name]**: Bug fixes
- **release/[version]**: Release preparation

### Pull Request Process
1. Create a feature/bugfix branch from main
2. Implement your changes with appropriate tests
3. Submit a PR to the develop main branch
4. Request review from at least one team member
5. Merge after approval and passing CI checks


## Commmunication Plan

### Meeting Schedule
- Client Meetings: Every two weeks, on Friday 16:15-17:00 (Sprint review & Next Sprint planning) 
- Team Meetings: Every week, on Friday 17:00-18:00 (Additional meetings as needed) 

### Communication Channels
- Project management: GitHub-Kanban
- Code repository: GitHub
- Client meetings: Microsoft Teams
- Team communication: Teams & WeChat
