# Frontend Development Setup and Guidelines

This document provides comprehensive setup instructions and development guidelines for the frontend of the LS1 Warehouse Packing project.

## Tech Stack

- **Language**: TypeScript
- **Framework**: React
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## Development Setup

### Initial Setup

1. Clone the repository
   ```bash
   git clone https://github.cs.adelaide.edu.au/MCI-Project-2025/LS1.git
   cd LS1
   ```

2. Switch to the frontend branch
   ```bash
   git checkout dev-frontend
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Start the development server
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173


## Project Structure

```
src/
├── assets/                  # Static assets (images, icons)
├── components/              # Reusable UI components
│   ├── common/              # Shared components
│   │   ├── Button.tsx                    
│   │   ├── Modal.tsx                   
│   ├── auth/                # Authentication components
│   │   ├── LoginForm.tsx        
│   │   └── RegisterForm.tsx      
│   ├── manager/             # Manager-specific components
│   │   ├── AddItem.tsx      
│   │   ├── EditItem.tsx       
│   │   ├── ItemList.tsx         
│   │   ├── AssignTask.tsx    
│   │   └── TaskHistory.tsx    
│   └── worker/              # Worker-specific components
│       ├── ItemDescription.tsx   
│       └── ProgressBar.tsx  
├── pages/                   # Page components
│   ├── auth/
│   │   ├── LoginPage.tsx    
│   │   └── RegisterPage.tsx 
│   ├── manager/
│   │   └── DashboardPage.tsx 
│   ├── worker/
│   │   └── DashboardPage.tsx 
│   ├── common/
│   │   └── NotFoundPage.tsx  
├── contexts/                # React Context providers
│   ├── AuthContext.tsx      
│   ├── ItemContext.tsx      
│   └── TaskContext.tsx      
├── services/                # API integration
│   ├── api.ts               
│   ├── authService.ts       
│   ├── managerService.ts   
│   └── workerService.ts     
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts           
│   ├── useItems.ts          
│   ├── useTasks.ts          
├── types/                   # TypeScript definitions      
├── routes/                  # Routing configuration
├── styles/                  
├── utils/                   
├── App.tsx                  # Root component
└── index.tsx                # Application entry point
```

## Development Workflow

- 1. Environment Setup & Foundation ✅
- 2. Static Components (UI-Only Phase)
- 3. Routing & Navigation
- 4. State Management & API Integration
- 5. User Experience Enhancements
- 6. Testing & Refinement


## Related Documentation

- [React Documentation](https://react.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)