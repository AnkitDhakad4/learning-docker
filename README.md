# DevNotes — MERN Notes & Code Snippet Manager

A full-stack **MERN (MongoDB, Express, React, Node.js)** application for creating, editing, pinning, archiving, and tag-filtering developer notes and code snippets.

---

## Project Structure

```text
mern-notes-snippets/
├── backend/
│   ├── config/
│   │   └── db.js                 # Strict MongoDB connection via MONGO_URI in .env
│   ├── controllers/
│   │   └── noteController.js     # Route controller handlers
│   ├── middleware/
│   │   └── errorMiddleware.js    # Centralized 404 & Mongoose error handling
│   ├── models/
│   │   └── Note.js               # Mongoose schema & indexes
│   ├── routes/
│   │   └── noteRoutes.js         # REST API endpoint definitions
│   ├── .env                      # Environment variables (PORT, MONGO_URI)
│   ├── seed.js                   # Sample database seeder
│   └── server.js                 # Express server entrypoint
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── noteApi.js        # Fetch client for all REST endpoints
    │   ├── components/
    │   │   ├── FilterBar.jsx     # View tabs & tag filter chips
    │   │   ├── Header.jsx        # Search bar, workspace stats, "+ New Entry"
    │   │   ├── NoteCard.jsx      # Note / code snippet card with copy & quick actions
    │   │   └── NoteDialog.jsx    # Native <dialog closedby="any"> modal form
    │   ├── App.jsx               # Main application state & API integration
    │   ├── index.css             # Developer dark theme styles
    │   └── main.jsx              # React DOM root
    └── vite.config.js            # Vite config with /api proxy to localhost:5000
```

---

## REST API Endpoints (`/api/notes`)

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | `GET` | `/api/notes` | List notes & snippets with query filters (`?tag=`, `?type=note\|snippet`, `?archived=true\|false`, `?pinned=true`, `?search=`) plus distinct tags and workspace stats |
| 2 | `GET` | `/api/notes/:id` | Fetch a single note or snippet by its MongoDB `_id` |
| 3 | `POST` | `/api/notes` | Create a new note or code snippet (`title`, `content`, `type`, `language`, `tags`, `isPinned`) |
| 4 | `PUT` | `/api/notes/:id` | Edit/update an existing note or snippet |
| 5 | `PATCH` | `/api/notes/:id/status` | Quick-toggle `isPinned` or `isArchived` status |
| 6 | `DELETE` | `/api/notes/:id` | Permanently delete a note or snippet |

---

## Getting Started

### 1. Configure MongoDB (`backend/.env`)
Update `backend/.env` with your MongoDB connection string:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mern_notes_snippets
NODE_ENV=development
```

### 2. Install Dependencies
```bash
npm run install-all
```

### 3. (Optional) Seed Sample Data
```bash
npm run seed
```

### 4. Start Backend & Frontend
In two terminals from `mern-notes-snippets/`:
```bash
# Terminal 1: Start Express API on http://localhost:5000
npm run server

# Terminal 2: Start React Vite dev server on http://localhost:5173
npm run client
```

