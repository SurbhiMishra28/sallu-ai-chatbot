# AI Chatbot (MERN + AI) - Minimal Project

This is a minimal skeleton project for an **AI Chatbot** built with MERN stack and a placeholder AI integration.
It's intended for interview/demo purposes — shows folder structure, basic API route, and a simple React frontend.

## Contents
- `backend/` - Express server with a `/api/chat` endpoint (placeholder AI logic).
- `frontend/` - React app that sends messages to backend and displays responses.

## How to run (locally)
1. **Backend**
   - `cd backend`
   - `npm install`
   - Create `.env` from `.env.example` and fill values if using a real AI provider.
   - `node server.js` (or `npx nodemon server.js` if you have nodemon)
   - Server runs on port 5000 by default.

2. **Frontend**
   - `cd frontend`
   - `npm install`
   - `npm start`
   - React dev runs on port 3000 and proxies API requests to backend.

## Notes
- The backend contains a placeholder `generateAIResponse` function. Replace its contents with real AI calls (OpenAI, HuggingFace, etc.) when integrating.
- This repo is trimmed for quick demo; adapt and expand for production use.
