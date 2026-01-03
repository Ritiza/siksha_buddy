# SikshaBuddy Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE siksha_buddy;
```

2. Run the schema:
```bash
psql -U postgres -d siksha_buddy -f database/schema.sql
```

Or using psql:
```bash
psql -U your_username -d siksha_buddy < database/schema.sql
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/siksha_buddy

# Local AI Agents (Optional - Ollama configuration)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Server
PORT=5000
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

**Important:** 
- **No API keys needed!** SikshaBuddy uses local agents
- Install Ollama (optional) for full AI: https://ollama.ai
- Or use the built-in fallback agent (works immediately)
- Replace `your_jwt_secret_here` with a secure random string
- Update database credentials as needed

### 4. Run the Application

#### Development Mode (Both server and client)

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

#### Or run separately:

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
Siksha_buddy/
├── server/              # Backend API
│   ├── config/          # Database configuration
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic (LLM service)
│   ├── prompts/         # LLM prompt templates
│   ├── utils/          # Utility functions
│   └── uploads/        # Uploaded files (auto-created)
├── client/              # React frontend
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API service functions
│   │   └── utils/      # Frontend utilities
├── database/           # Database schema
└── package.json        # Root package.json
```

## Features

✅ User Authentication (Register/Login)
✅ File Upload (PDF, DOCX, Images, TXT)
✅ AI-Generated Notes
✅ AI-Generated Flashcards
✅ Quiz Generation (MCQ)
✅ Subjective Test Generation
✅ Progress Tracking
✅ Study Planner
✅ Analytics Dashboard

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database credentials

### Gemini API Errors
- Verify GEMINI_API_KEY is set correctly
- Check API key is valid (get from https://makersuite.google.com/app/apikey)
- Ensure API key has access to Gemini models

### File Upload Issues
- Check uploads directory exists (auto-created)
- Verify file size is under 50MB
- Ensure file types are supported (PDF, DOCX, Images, TXT)

### Port Already in Use
- Change PORT in .env file
- Kill process using the port: `lsof -ti:5000 | xargs kill`

## Next Steps

1. Register a new account
2. Upload study materials
3. Generate notes, flashcards, or quizzes
4. Track your progress
5. Use the study planner

## Support

For issues or questions, check the README.md file or create an issue in the repository.

