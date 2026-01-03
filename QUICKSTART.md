# SikshaBuddy Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm run install-all
```

### Step 2: Set Up Database

1. **Create PostgreSQL Database:**
   ```sql
   CREATE DATABASE siksha_buddy;
   ```

2. **Run Schema:**
   ```bash
   npm run setup-db
   ```
   
   Or manually:
   ```bash
   psql -U postgres -d siksha_buddy -f database/schema.sql
   ```

### Step 3: Configure Environment

Create `.env` file in root:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/siksha_buddy
# No API keys needed! Local agents work without keys.
# Optional: Configure Ollama for better AI
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
JWT_SECRET=your-secret-key-here
PORT=5000
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000/api
```

**Install Ollama (Optional):** https://ollama.ai/download
Then: `ollama pull llama2`

### Step 4: Start Application
```bash
npm run dev
```

### Step 5: Access Application
Open browser: **http://localhost:3000**

---

## 📝 First Steps After Setup

1. **Register Account**
   - Click "Register here" on login page
   - Fill in your details (name, email, exam type, exam date)
   - Choose preferred language (English/Hindi/Hinglish)

2. **Upload Study Material**
   - Go to "Study Material" page
   - Upload a PDF, DOCX, or Image file
   - Wait for processing (text extraction)

3. **Generate Content**
   - Select your uploaded material
   - Click "Notes" to generate study notes
   - Click "Flashcards" for memory cards
   - Click "Quiz" to generate practice questions

4. **Take a Test**
   - Go to "Tests & Quiz" page
   - Select material and generate quiz/test
   - Answer questions and submit
   - View your accuracy

5. **Track Progress**
   - Check "Progress" page for analytics
   - View accuracy trends and study time
   - Identify weak and strong topics

6. **Plan Your Study**
   - Go to "Planner" page
   - Generate personalized study plan
   - View today's schedule

---

## 🎯 Key Features to Try

### 📚 Content Generation
- **Notes**: Concise, exam-focused notes from your material
- **Flashcards**: Memory-based learning cards
- **Quiz**: MCQ and assertion-reason questions
- **Tests**: Subjective tests (2/4/5/8/10 marks)

### 📊 Progress Tracking
- Study time tracking
- Accuracy monitoring
- Weak topic identification
- Progress charts and analytics

### 🗓️ Study Planning
- Automated daily study plans
- Revision scheduling
- Exam countdown
- Personalized recommendations

---

## ⚠️ Troubleshooting

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in `.env`
- Ensure database exists: `psql -l | grep siksha_buddy`

### Local Agent Issues
- **Ollama not running**: Install from https://ollama.ai and run `ollama serve`
- **Model not found**: Run `ollama pull llama2`
- **Fallback agent**: Works automatically if Ollama is unavailable

### Port Already in Use
- Change PORT in `.env` (e.g., 5001)
- Kill process: `lsof -ti:5000 | xargs kill` (Mac/Linux)
- Or use Task Manager (Windows)

### File Upload Fails
- Check file size < 50MB
- Verify file type is supported (PDF, DOCX, Images, TXT)
- Ensure uploads directory exists (auto-created)

---

## 📖 Next Steps

- Read `SETUP.md` for detailed setup
- Check `PROJECT_SUMMARY.md` for feature overview
- Review `README.md` for project documentation

---

## 💡 Tips

1. **Start Small**: Upload one chapter at a time
2. **Use Clear Materials**: Better quality PDFs = better results
3. **Review Generated Content**: AI is helpful but always verify
4. **Track Progress**: Regular quizzes help identify weak areas
5. **Use Planner**: Let AI create your study schedule

---

**Happy Studying! 🎓**

