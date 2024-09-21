# Progress-Tool: ReactJS, Express, and MariaDB Application

## Overview
This project is a widget for an online course, designed to provide both student and admin panels. Students can use an interactive checklist to track their progress through course modules, while admins can manage and monitor student progress through a dashboard.

## Key Features
- **Student Panel**: 
  - Students can interact with a checklist to track module completion.
  - A progress bar dynamically updates based on the student's progress.
- **Admin Panel**:
  - Admins can add, remove, and edit checklists.
  - Admins can track the progress of students in real time.

## Tech Stack
- **Frontend**: ReactJS
- **Backend**: Express (Node.js)
- **Database**: MariaDB

## Setup Instructions

1. **Clone the repository**:
```bash 
  git clone https://github.com/Chevuu/Progress-Tool.git
  cd ./progress-tool
```

2. **Install dependencies**:
```bash
  npm install
```

3. **Build the React app**:
```bash
  npm run build
```

4. **Start the server** (ensure that the MariaDB database is running):
```bash
node server/server.js
```

5. **Access the app**:
   Open your browser and use the test URLs below to access the admin dashboard or the student checklist.

## Test URLs

### Admin Dashboard for Course: CSE1000
- [Admin Dashboard](http://localhost:3001/admin/get-all/CSE1000)

### Checklist for Course: CSE1000, Run: 2024B, Checklist ID: ID_2024B_1
- [Student Checklist](http://localhost:3001/CSE1000/2024B/ID_2024B_1)

## Folder Structure
- `./`: Contains the React frontend.
- `server/`: Contains the Express backend and server configuration.
- `server/server.js`: The entry point for the backend server.
- `server/config/db.js`: Contains database script and configuration for MariaDB.

## Scripts

### `npm run build`
Builds the React app for production, placing the output in the `build/` directory.

### `node server/server.js`
Runs the Express server and serves the React frontend after the `npm run build` command has been executed. The server will be accessible via [http://localhost:3001](http://localhost:3001).

## Purpose
This app is designed to enhance the learning experience in online courses. The student panel provides an easy-to-use interactive checklist for tracking course progress. Admins benefit from a comprehensive dashboard where they can manage checklists, view student progress, and perform administrative actions.