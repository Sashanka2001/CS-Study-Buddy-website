# CS Study Buddy Website

## Overview

**CS Study Buddy** is a lightweight full-stack study assistant. It tracks todos, personal notes, and schedule items through a Node.js + MySQL API and a React single-page app. The latest refresh introduces a dedicated home page with quick actions, a sidebar-driven layout, and enhanced schedule items with event dates.

## Key Features

- **Interactive Home** – greeting banner, friendly copy, and shortcuts to todos and schedule.
- **Todo List** – organise tasks into custom lists, mark items complete, and revisit them in a dedicated completed section.
- **Notes** – capture study notes with inline edit support.
- **Schedule** – track events with title, time, and date fields.
- **Persistent API** – Express + Sequelize backed by MySQL to store data.

## Technology Stack

- **Frontend:** React 19, React Router 6, Axios, custom CSS.
- **Backend:** Node.js, Express, Sequelize.
- **Database:** MySQL (see `cs-study-buddy-backend/config/db.config.js`).

## Quick Start

### Prerequisites

- Node.js 18 or later
- npm (bundled with Node.js)
- MySQL server with a database named `study_buddy_db`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sashanka2001/CS-Study-Buddy-website.git
   cd CS-Study-Buddy-website
   ```

2. **Install frontend dependencies**
   ```bash
   cd study-buddy-frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../cs-study-buddy-backend
   npm install
   ```

4. **Configure database credentials**

   Update `cs-study-buddy-backend/config/db.config.js` with your MySQL host, user, password, and database name. The repository ships with sensible defaults for a local setup.

5. **Run the applications**
   ```bash
   # Terminal 1 – backend API
   cd cs-study-buddy-backend
   npm start

   # Terminal 2 – frontend dev server
   cd study-buddy-frontend
   npm start
   ```

6. **Browse the app**

   Visit http://localhost:3000 to land on the new home page. Use the sidebar to switch between Home, Todo List, Notes, and Schedule. The backend listens on http://localhost:5000.

## Project Structure

```
CS-Study-Buddy-website/
├── cs-study-buddy-backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
└── study-buddy-frontend/
    ├── public/
    └── src/
        ├── components/
        ├── App.css
        └── App.js
```

## Recent Updates

- Added a polished home page with greeting, date display, and quick action buttons.
- Introduced a sidebar navigation with a home link and route-driven pages for todos, notes, and schedule.
- Extended schedule events to include an event date persisted through the API.

 

 
