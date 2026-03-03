🚀 CollabSpace – Real-Time Task Collaboration Platform

CollabSpace is a real-time team collaboration platform built using the MERN stack with PostgreSQL and modern UI tools.
It allows teams to create boards, manage tasks, assign responsibilities, and collaborate in real-time.

📌 Tech Stack
🖥️ Frontend

⚛️ React JS

🎨 Tailwind CSS

🧩 shadcn/ui

🔗 Axios

🧠 Context API

🎣 React Hooks

⚙️ Backend

🟢 Node.js

🚏 Express.js

🔌 Socket.io (Real-time updates)

🔐 JWT Authentication (Access Token + Refresh Token)

🍪 Secure Cookies

🌐 CORS Configuration

🗄️ Database

🐘 PostgreSQL

☁️ Neon (Cloud PostgreSQL)

🔷 Prisma ORM

✨ Features
🔐 Authentication System

Proper JWT-based Authentication

Access Token & Refresh Token system

Secure HTTP-only cookies

Token refresh flow implemented

CORS properly configured

Only logged-in users can access dashboard & boards

👥 Team Collaboration

Currently supports 2 team members

After login, users can:

View other users

Collaborate in shared boards

📋 Board Management

Create Board

Each board contains:

Multiple Lists

Multiple Tasks

Leader can:

Assign tasks to team members

Finalize tasks

Team Member can:

Move only their assigned tasks

Cannot modify others' tasks

⚡ Real-Time Updates

Using Socket.io, the following updates happen instantly:

Task assignment

Task movement between lists

Task finalization

Board changes reflected to all users in real-time

No page refresh required 🔥

📊 Dashboard

Each user gets:

Personal dashboard

Boards overview

Task visibility

Real-time updates

👑 Role-Based Access
🧑‍💼 Leader

Create Board

Assign Tasks

Move Tasks

Finalize Tasks (Task marked as completed)

Control workflow

👤 Team Member

View Board

Move only assigned tasks

Cannot modify other members’ tasks

🏗️ Project Structure
CollabSpace/
│
├── client/        # React Frontend
│   ├── components
│   ├── context
│   ├── hooks
│   └── pages
│
├── server/        # Node + Express Backend
│   ├── controllers
│   ├── routes
│   ├── middleware
│   ├── prisma
│   └── socket
│
└── README.md
🔄 Real-Time Workflow

User logs in

Leader creates a board

Leader creates lists inside board

Leader assigns tasks to team member

Member moves task to progress list

Leader finalizes task

Task moves to finalized/completed list

All of this happens in real-time using Socket.io.

🛡️ Security Implementation

JWT Authentication

Access & Refresh token strategy

HTTP-only cookies

CORS properly configured

Role-based access control

Protected routes (Frontend + Backend)

Prisma validation

🚀 Future Improvements (Level Up Plan)

✅ Task Delete Feature

✅ Board Delete Feature

🔄 Increase Team Members (Dynamic team size)

📩 Notifications System

📅 Due Dates

📊 Analytics Dashboard

📎 File Attachments

🏷️ Task Labels & Priority

📨 Email Invitations

🌍 Deployment (Full Production Ready)

🧠 Learning Highlights

This project demonstrates:

Advanced Authentication Flow

Token Refresh Mechanism

Real-Time Communication

Role-Based Authorization

PostgreSQL with Prisma ORM

Clean State Management using Context API

Modern UI with Tailwind + shadcn

🖼️ Screens Overview

Login Page

Dashboard

Board Page

Task Lists

Real-Time Updates

⚙️ Installation Guide
1️⃣ Clone the Repository
git clone https://github.com/yourusername/collabspace.git
cd collabspace
2️⃣ Setup Backend
cd server
npm install

Create .env file:

DATABASE_URL=
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

Run:

npx prisma migrate dev
npm run dev
3️⃣ Setup Frontend
cd client
npm install
npm run dev
🌟 Why This Project is Powerful

Real-time collaboration like Trello

Secure authentication like modern SaaS apps

Production-level backend structure

Scalable architecture

Clean UI/UX

Modern full-stack development practices

🤝 Contribution

Currently in development phase.
More advanced features coming soon.

👨‍💻 Developer

Built with dedication using MERN + PostgreSQL + Socket.io.