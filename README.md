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
├── assets/                 # Static assets
│   ├── images/             # All image files
│   │   ├── icons/          # UI icons
│   │   ├── logos/          # Brand logos
│   │   └── illustrations/  # Larger illustrations
│   └── fonts/              # Custom font files
├── components/             # Reusable UI components
│   ├── common/             # Generic UI components
│   ├── layout/             # Layout components
│   └── features/           # Feature-specific components
│       ├── manager/        # Components for manager interface
│       └── worker/         # Components for worker interface
├── pages/                  # Page components
│   ├── auth/               # Authentication pages
│   ├── manager/            # Manager dashboard pages
│   └── worker/             # Worker dashboard pages
├── routes/                 # Routing configuration
├── services/               # API services and data fetching
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── App.tsx                 # Main App component
├── main.tsx                # Application entry point
└── index.css               # Global styles
```

## Related Documentation

- [React Documentation](https://react.dev/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)