 # CS Study Buddy Website 🧑🏻‍💻

## 🎯 Overview

**CS Study Buddy** is a comprehensive full-stack web application designed to help computer science students streamline their academic workflow. This intelligent platform serves as your personal study companion, providing centralized management for tasks, notes, schedules, and productivity tracking.

Transform your study habits, boost productivity, and stay organized throughout your CS academic journey.

## ✨ Key Features

### 📋 Task Management
- Create, edit, and organize study tasks with priority levels
- Track completion status and deadlines
- Visual progress indicators

### 📝 Smart Notes System
- Organize class notes by subjects and topics
- Rich text formatting support
- Quick search and categorization

### 🗓️ Study Scheduler
- Interactive calendar view for study sessions
- Time blocking for focused learning
- Automatic schedule optimization

### 🔔 Smart Reminders
- Timely notifications for upcoming deadlines
- Customizable alert preferences
- Never miss important due dates

### 🔐 Secure Authentication
- Personalized user accounts
- Secure login with JWT tokens
- Individualized dashboard experience

### 📱 Responsive Design
- Seamless experience across all devices
- Mobile-first approach
- Optimized for desktop, tablet, and mobile

## 🖼️ Application Preview

### Dashboard Overview
![Dashboard Preview](#)

### Task Management Interface
![Tasks Preview](#)

### Notes Organization
![Notes Preview](#)

## 🛠️ Technology Stack

### Frontend
- **React.js** - Modern UI framework
- **HTML5** - Semantic markup
- **CSS3** - Advanced styling and animations
- **JavaScript (ES6+)** - Client-side logic

### Backend
- **Node.js** - Server runtime environment
- **Express.js** - Web application framework

### Database
- **MySQL** / **SQLite** / **MongoDB** - Data persistence

### Additional Libraries & Tools
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **JWT** - Secure authentication
- **Git & GitHub** - Version control

## ⚡ Quick Start

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn package manager
- Database system - SQLite

### Installation Guide

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Sashanka2001/CS-Study-Buddy-website.git
   cd CS-Study-Buddy-website
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   ```

3. **Backend Setup**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Configuration**
   Create `.env` file in backend directory:
   ```env
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   JWT_SECRET=your_secure_secret_key
   PORT=5000
   ```

5. **Launch Application**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start

   # Terminal 2 - Frontend  
   cd frontend && npm start
   ```

6. **Access Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Architecture

```
CS-Study-Buddy-website/
├── frontend/                 # React Application
│   ├── public/              # Static assets
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Application screens
│       ├── hooks/           # Custom React hooks
│       ├── utils/           # Helper functions
│       ├── styles/          # CSS modules
│       └── App.js           # Main application component
│
├── backend/                 # Node.js Server
│   ├── controllers/         # Business logic
│   ├── models/              # Database models
│   ├── routes/              # API endpoints
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   └── server.js            # Server entry point
│
├── docs/                    # Documentation
├── tests/                   # Test suites
└── package.json             # Project dependencies
```

 
