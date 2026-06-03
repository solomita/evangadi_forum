# AI-Powered Evangadi Forum

An AI-enhanced community forum project built with a React frontend, an Express backend, and a MySQL database. The project is designed to support user authentication, community questions and answers, semantic search, and document-based AI assistance using Retrieval-Augmented Generation (RAG).

## Project Overview

This repository is organized as a full-stack application with:

- `frontend`: a Vite + React client for the user interface
- `backend`: an Express API connected to MySQL
- `tasks`: project task breakdown and milestone documentation

The current codebase already includes the authentication foundation, protected frontend routing, backend health checks, database schema design, and environment configuration for AI-powered features. The overall project scope also covers question posting, answer workflows, semantic search, and RAG document processing.

## Core Goals

- Provide a modern discussion platform for community-driven Q&A
- Support secure registration and login with JWT authentication
- Enable AI-assisted forum experiences such as semantic search and answer support
- Allow users to upload PDF documents and query them through RAG workflows
- Create a clear full-stack team collaboration structure for milestone-based development

## Feature Scope

### Current Foundation

- User registration and login API structure
- React authentication context and protected routes
- Frontend landing page, auth page, dashboard shell, sidebar, and layout components
- MySQL schema for users, questions, answers, and RAG documents
- Environment configuration for Gemini embeddings and text generation

### Planned / Project Milestones

- Ask a question and manage personal questions
- View question details and submit answers
- AI draft coach for improving question quality
- AI answer-fit evaluation for drafted answers
- Semantic question search and similar-question recommendations
- PDF upload, document preview, document search, and grounded RAG responses

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Framer Motion
- Vitest
- ESLint

### Backend

- Node.js
- Express
- MySQL2
- JWT
- bcryptjs
- express-validator
- Multer
- pdf-parse
- Google Gemini API

## Project Structure

```text
ai-powered-forum-project/
|-- backend/
|   |-- db/
|   |   |-- config.js
|   |   `-- schema.sql
|   |-- src/
|   |   |-- api/
|   |   |-- middleware/
|   |   `-- utils/
|   |-- .env.example
|   |-- index.js
|   `-- package.json
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- pages/
|   |   `-- services/
|   |-- .env.example
|   `-- package.json
|-- tasks/
`-- README.md
```

## Environment Variables

### Backend

Create `backend/.env` using `backend/.env.example`.

```env
PORT=3777
DB_USER=your_database_user
DB_PASS=your_database_password
DB_HOST=127.0.0.1
DB_NAME=your_database_name
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
GEMINI_TEXT_MODEL=gemini-2.5-flash-lite
RECOMMEND_THRESHOLD=0.75
RECOMMEND_K=5
RAG_UPLOAD_DIR=uploads/rag
RAG_MAX_UPLOAD_MB=5
RAG_CHUNK_CHARS=900
RAG_CHUNK_OVERLAP=120
RAG_MAX_CHUNKS_PER_DOC=1000
RAG_MAX_PDFS_PER_USER=20
RAG_MIN_TEXT_CHARS=50
RAG_SEARCH_THRESHOLD=0.45
RAG_SEARCH_K=10
```

### Frontend

Create `frontend/.env` using `frontend/.env.example`.

```env
VITE_API_BASE_URL=http://localhost:3777
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MySQL server
- Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/desta-getaw/ai-powered-forum-project.git
cd ai-powered-forum-project
```

### 2. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Configure the Database

- Create a MySQL database
- Update `backend/.env` with your database credentials
- Run the schema from `backend/db/schema.sql`

Example:

```bash
mysql -u your_database_user -p your_database_name < backend/db/schema.sql
```

## Run the Project

Open two terminals.

### Start the Backend

```bash
cd backend
npm run dev
```

The API runs on `http://localhost:3777`.

### Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend runs on the Vite local development server shown in your terminal.

## Available Scripts

### Backend

- `npm run dev`: starts the backend with nodemon
- `npm start`: starts the backend with Node.js
- `npm test`: runs backend tests

### Frontend

- `npm run dev`: starts the Vite development server
- `npm run build`: builds the production app
- `npm run lint`: runs ESLint
- `npm run preview`: previews the production build
- `npm test`: runs frontend tests once
- `npm run test:watch`: runs frontend tests in watch mode
- `npm run test:ui`: opens the Vitest UI

## API and App Notes

- Backend health check: `GET /health`
- Base API prefix: `/api`
- Current backend router wiring includes authentication routes
- Database schema already supports questions, answers, question vectors, documents, and document chunk vectors

## Team Members

| No. | Name              | Email                     | Role         |
| --- | ----------------- | ------------------------- | ------------ |
| 1   | Anteneh Alemayehu | antenehmekuriaw@gmail.com | Team Lead    |
| 2   | Destaw Getaw      | destage.29@gmail.com      | Team Lead    |
| 3   | Sofanit Dejene    | sofanitdejene@gmail.com   | Collaborator |
| 4   | Melese Shukuro    | Meleseshukuro@gmail.com   | Collaborator |
| 5   | Haymanot Birara   | haymibirara7@gmail.com    | Collaborator |
| 6   | Waganesh Wogaye   | waganeshadmase@gmail.com  | Collaborator |
| 7   | Abayneh Mekonnen  | abayneh1999@gmail.com     | Collaborator |
| 8   | Gedamu Mersha     | gedamumersha27@gmail.com  | Collaborator |
| 9   | Fiteh Tesfaye     | fitehtesfaye@gmail.com    | Collaborator |
| 10  | Kena Tolcha       | kenatolcha445@gmail.com   | Collaborator |
| 11  | Solome Zewdu      | solomezewdu125@gmail.com  | Collaborator |
| 12  | Amanawit Geremew  | Amanawit.22@gmail.com     | Collaborator |
| 13  | Mesud Ali         | mesud3818@gmail.com       | Collaborator |

## Future Improvements

- Complete the remaining question, answer, and RAG feature flows in the live app
- Add screenshots or demo GIFs for key pages
- Add deployment instructions for frontend and backend hosting
- Expand automated backend and frontend test coverage

## License

This project is currently for educational and collaborative development purposes.
