CollabSpace 

CollabSpace is a real-time collaborative platform designed for seamless interaction between multiple users in shared spaces. It supports live communication, room-based collaboration, and scalable backend architecture.

This project was built to explore real-world system design patterns, WebSockets, authentication flows, and production-style folder structuring in a full-stack application.

 Tech Stack
Frontend
React.js
Context API (state management)
Custom Hooks
React Router (Protected Routes)
Axios (API communication)
Tailwind CSS
ShadCN UI
Cookies (session handling)
Backend
Node.js
Express.js
Socket.io
Prisma ORM
Database
PostgreSQL
✨ Core Features
 Real-time collaboration using Socket.io
 Room-based system for isolated workspaces
 Authentication with cookie-based session handling
 Protected routes on frontend
 REST APIs for structured backend communication
 Centralized state management using Context API
 Reusable custom hooks for cleaner logic
 Modern UI using Tailwind CSS + ShadCN components
 Prisma ORM for type-safe database operations
 Scalable and modular project structure
 Project Architecture

The project follows a modular and scalable folder structure:

Separation of routes, controllers, services, and middlewares
Clean frontend structure with components, hooks, pages, and context
Reusable logic extracted into custom hooks
API layer abstraction using Axios instance
Socket logic separated from core business logic

This structure was designed with maintainability and scalability in mind.

   Authentication Flow
User authentication handled via backend sessions
Cookies used for secure session storage
Protected routes implemented on frontend
Middleware-based route guarding on backend

  Key Learnings
Building real-time applications using Socket.io
Designing REST APIs with proper structure
Working with Prisma ORM and PostgreSQL
Managing global state using Context API
Implementing protected routes and authentication flow
Structuring a full-stack project like an industry-grade application
Handling frontend-backend communication in scalable way

 Purpose of Project

This is a learning-focused project aimed at understanding how real-world collaborative systems are built. The focus was on:

System design fundamentals
Real-time architecture
Scalable folder structure
Clean separation of concerns
Production-ready development patterns

 Getting Started
Backend
cd backend
npm install
npx prisma generate
npm run dev

Frontend
cd frontend
npm install
npm run dev

Environment Variables
Create .env files in both frontend and backend:

Backend
DATABASE_URL=
JWT_SECRET=
CLIENT_URL=


Frontend
VITE_API_URL=
CLIENT_URL=
Frontend
VITE_API_URL=
