# Backend Integration Guide

This document explains how the frontend has been integrated with the new backend API.

## Overview

The frontend has been updated to use a custom backend API instead of Supabase. The backend is located in the `talent-forge-ai-66-backend` folder.

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend folder:
```bash
cd talent-forge-ai-66-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - Your PostgreSQL connection string
- `JWT_SECRET` - A secure random string for JWT tokens
- `FRONTEND_URL` - Frontend URL (default: http://localhost:5173)
- `PORT` - Backend port (default: 5000)

4. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

1. Navigate to the frontend folder:
```bash
cd talent-forge-ai-66
```

2. Create `.env` file (if it doesn't exist):
```bash
VITE_API_URL=http://localhost:5000/api
```

3. Install dependencies (if not already done):
```bash
npm install
```

4. Start the frontend:
```bash
npm run dev
```

## API Integration

### Authentication

The frontend now uses JWT tokens stored in `localStorage` instead of Supabase sessions.

- **Login**: `POST /api/auth/login`
- **Register**: `POST /api/auth/register`
- **Get Current User**: `GET /api/auth/me`
- **Logout**: `POST /api/auth/logout`

### Projects

- **Get Projects**: `GET /api/projects` (with optional filters)
- **Get Project**: `GET /api/projects/:id`
- **Create Project**: `POST /api/projects` (auth required)
- **Update Project**: `PUT /api/projects/:id` (auth required, owner only)
- **Delete Project**: `DELETE /api/projects/:id` (auth required, owner only)
- **Apply to Project**: `POST /api/projects/:id/apply` (auth required)

### Profiles

- **Get Profile**: `GET /api/profiles/:userId`
- **Get My Profile**: `GET /api/profiles/me/profile` (auth required)
- **Update Profile**: `PUT /api/profiles/:userId` (auth required, own profile only)

### Chat

- **Get Channels**: `GET /api/chat/channels` (auth required)
- **Get Messages**: `GET /api/chat/channels/:channelId/messages` (auth required)
- **Send Message**: `POST /api/chat/channels/:channelId/messages` (auth required)

### Roadmap

- **Generate Roadmap**: `POST /api/roadmap/generate` (auth required)
- **Get Roadmaps**: `GET /api/roadmap` (auth required)
- **Update Roadmap**: `PATCH /api/roadmap/:roadmapId` (auth required)

## Changes Made

### Frontend Changes

1. **Created API Service** (`src/services/api.ts`):
   - Centralized API client with JWT token management
   - All API calls go through this service

2. **Updated AuthContext** (`src/contexts/AuthContext.tsx`):
   - Removed Supabase dependency
   - Uses JWT tokens from localStorage
   - Fetches user data from backend API

3. **Updated Pages**:
   - **Login.tsx**: Uses `api.login()` instead of Supabase
   - **Register.tsx**: Uses `api.register()` instead of Supabase
   - **Profile.tsx**: Uses `api.getProfile()` instead of Supabase
   - **EditProfile.tsx**: Uses `api.updateProfile()` instead of Supabase
   - **Home.tsx**: Uses `api.getProjects()` and `api.applyToProject()`
   - **Chat.tsx**: Uses `api.getChannels()` and `api.sendMessage()`
   - **AIRoadmap.tsx**: Uses `api.generateRoadmap()`

4. **Updated Components**:
   - **ProjectPostForm.tsx**: Uses `api.createProject()` to post projects

## Database Schema

The backend uses PostgreSQL with Prisma ORM. Key models:

- **User**: Authentication and basic user info
- **Profile**: Extended user profile information
- **Project**: Project listings with tech stack
- **Application**: Applications to projects
- **Channel**: Chat channels
- **Message**: Chat messages
- **Review**: User reviews and ratings
- **UserSkill**: User skills and proficiency
- **Roadmap**: AI-generated learning roadmaps

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/talent_forge_ai
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Testing

1. Start the backend server
2. Start the frontend dev server
3. Register a new user
4. Login with the credentials
5. Test features:
   - Browse projects
   - Post a project
   - Apply to projects
   - Update profile
   - Send chat messages
   - Generate AI roadmap

## Troubleshooting

### CORS Issues
Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL.

### Authentication Issues
- Check that JWT_SECRET is set in backend `.env`
- Verify token is being stored in localStorage
- Check browser console for API errors

### Database Issues
- Ensure PostgreSQL is running
- Verify DATABASE_URL is correct
- Run migrations: `npm run prisma:migrate`

### API Connection Issues
- Verify backend is running on correct port
- Check `VITE_API_URL` in frontend `.env`
- Check browser network tab for failed requests

## Next Steps

- Add real-time features (WebSockets for chat)
- Integrate OpenAI for AI roadmap generation
- Add file upload for avatars
- Implement payment processing
- Add email notifications
- Add search and filtering improvements

