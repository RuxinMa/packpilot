# LS1 Warehouse Packing Project Overview

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
| **Frontend** | Language: TypeScript<br>Framework: React<br>CSS: Tailwind CSS<br>Build Tool: Vite|
| **Backend** | Language: Python<br>Framework: Flask<br>API: RESTful API |
| **Database** | MySQL |
| **Visualization** | Blender |
| **Deployment** | Deploy: Netlify<br>CI/CD: GitHub Actions |
| **Version Control** | Git with GitHub |
| **Testing** | Frontend: React Testing Library <br>Backend: Pytest|


## Development Workflow

### Branch Structure
- **main**: Production branch containing stable releases, project overview, and official documentation (project docs, meeting minutes, and timesheets)
- **dev-frontend**: Main development branch for all frontend components and UI features
- **dev-backend**: Main development branch for all backend services and API endpoints
- **feature/[feature-name]**: Short-lived branches for developing specific features
- **bugfix/[bug-name]**: Short-lived branches for addressing specific issues
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