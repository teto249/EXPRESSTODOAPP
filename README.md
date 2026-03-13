# PERN Todo App

A full-stack Todo application built with **PostgreSQL**, **Express**, **React**, and **Node.js**.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite 5, Tailwind CSS 4, Axios |
| Backend  | Node.js, Express 5                  |
| Database | PostgreSQL (via `pg`)               |

---

## Project Structure

```
EXPRESSTODOAPP/
├── backend/          # Express REST API (port 8080)
│   ├── app.js
│   ├── db.js
│   ├── routes/
│   │   └── todos.js
│   └── queries.js/
│       └── queries.js
└── frontend/
    └── todoAppNode/  # React + Vite app (port 5173)
        └── src/
            └── App.jsx
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20.19+ **or** v22.12+ (for Vite 5, v20.18 also works)
- [PostgreSQL](https://www.postgresql.org/) running locally
- npm

---

## Database Setup

1. Open **psql** or **pgAdmin** and create the database:

```sql
CREATE DATABASE tododb;
```

2. Connect to the database and create the table:

```sql
\c tododb

CREATE TABLE todo (
  todo_id   SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  completed   BOOLEAN NOT NULL DEFAULT false
);
```

---

## Environment Variables

The backend reads database credentials from a `.env` file.

1. Copy the example file:

```bash
cp backend/.env.example backend/.env
```

2. Fill in your values in `backend/.env`:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=tododb
DB_PASSWORD=your_password
DB_PORT=5432
```

---

## Installation & Running

### Backend

```bash
cd backend
npm install
npm run dev
```

Server starts at **http://localhost:8080**

### Frontend

```bash
cd frontend/todoAppNode
npm install
npm run dev
```

App opens at **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint      | Description        |
|--------|---------------|--------------------|
| GET    | /todos        | Get all todos      |
| POST   | /todos        | Create a todo      |
| PUT    | /todos/:id    | Update a todo      |
| DELETE | /todos/:id    | Delete a todo      |

### POST / PUT body shape

```json
{
  "description": "My task",
  "completed": false
}
```
