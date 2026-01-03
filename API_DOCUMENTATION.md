# SikshaBuddy API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## Authentication Endpoints

### Register
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "preferred_language": "English",
  "exam_type": "JEE",
  "exam_date": "2024-12-15",
  "daily_study_time_minutes": 120
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "token": "jwt_token_here",
  "student": {
    "student_id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "preferred_language": "English",
    "exam_type": "JEE"
  }
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "student": { ... }
}
```

---

## Student Endpoints

### Get Profile
```http
GET /api/students/profile
```
**Headers:** `Authorization: Bearer <token>`

### Update Profile
```http
PUT /api/students/profile
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Doe",
  "preferred_language": "Hindi",
  "exam_type": "NEET",
  "exam_date": "2024-12-15",
  "daily_study_time_minutes": 180
}
```

---

## Materials Endpoints

### Upload Material
```http
POST /api/materials/upload
```
**Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

**Form Data:**
- `file`: File (PDF, DOCX, Image, TXT)
- `subject_id`: UUID (optional)
- `chapter_id`: UUID (optional)

**Response:**
```json
{
  "message": "File uploaded successfully",
  "material": {
    "material_id": "uuid",
    "file_name": "chapter1.pdf",
    "subject_name": "Physics",
    "chapter_name": "Mechanics",
    "key_topics": ["force", "motion", "energy"],
    "estimated_study_time": 120
  }
}
```

### Get All Materials
```http
GET /api/materials
```
**Headers:** `Authorization: Bearer <token>`

### Get Material by ID
```http
GET /api/materials/:materialId
```
**Headers:** `Authorization: Bearer <token>`

---

## Study Endpoints

### Generate Notes
```http
POST /api/study/notes
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "material_id": "uuid",
  "language": "English"
}
```

**Response:**
```json
{
  "notes": "Generated notes text...",
  "language": "English"
}
```

### Generate Flashcards
```http
POST /api/study/flashcards
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "material_id": "uuid",
  "num_cards": 20,
  "language": "English"
}
```

### Get Study Sessions
```http
GET /api/study/sessions?limit=50
```
**Headers:** `Authorization: Bearer <token>`

### Update Study Session
```http
PUT /api/study/sessions/:sessionId
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "time_spent_minutes": 45,
  "completed": true
}
```

---

## Quiz Endpoints

### Generate Quiz
```http
POST /api/quiz/generate
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "material_id": "uuid",
  "num_questions": 10,
  "language": "English"
}
```

**Response:**
```json
{
  "quiz": {
    "questions": [
      {
        "type": "MCQ",
        "question": "What is...?",
        "options": ["A", "B", "C", "D"],
        "correct": "A",
        "explanation": "..."
      }
    ]
  },
  "language": "English"
}
```

### Submit Quiz
```http
POST /api/quiz/submit
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "chapter_id": "uuid",
  "questions_data": [...],
  "answers_data": ["A", "B", "C", ...]
}
```

**Response:**
```json
{
  "attempt": {
    "attempt_id": "uuid",
    "total_questions": 10,
    "correct_answers": 8,
    "accuracy_percentage": 80.00
  },
  "accuracy": 80.00,
  "weakness_analysis": "..."
}
```

### Get Quiz Attempts
```http
GET /api/quiz/attempts?limit=50
```
**Headers:** `Authorization: Bearer <token>`

---

## Test Endpoints

### Generate Subjective Test
```http
POST /api/tests/generate
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "material_id": "uuid",
  "marks_type": 5,
  "num_questions": 5,
  "language": "English"
}
```

**Response:**
```json
{
  "test": {
    "questions": [
      {
        "question": "Explain...",
        "answer": "Model answer...",
        "marks": 5,
        "keyPoints": ["point1", "point2"]
      }
    ]
  },
  "language": "English"
}
```

### Submit Test
```http
POST /api/tests/submit
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "chapter_id": "uuid",
  "marks_type": 5,
  "questions_data": [...],
  "answers_data": [...],
  "score_estimated": 18
}
```

### Get All Tests
```http
GET /api/tests?limit=50
```
**Headers:** `Authorization: Bearer <token>`

---

## Progress Endpoints

### Get Progress Summary
```http
GET /api/progress/summary
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "student_id": "uuid",
  "total_study_time": 1200,
  "average_accuracy": 75.50,
  "strongest_subject": "uuid",
  "strongest_subject_name": "Mathematics",
  "weakest_subject": "uuid",
  "weakest_subject_name": "Physics",
  "total_chapters_studied": 15
}
```

### Get Revision Tracker
```http
GET /api/progress/revision
```
**Headers:** `Authorization: Bearer <token>`

### Get Accuracy Data
```http
GET /api/progress/accuracy?days=30
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
[
  {
    "date": "2024-01-15",
    "avg_accuracy": 75.50
  }
]
```

### Get Time Spent Data
```http
GET /api/progress/time?days=30
```
**Headers:** `Authorization: Bearer <token>`

### Get Weak vs Strong Topics
```http
GET /api/progress/topics
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "weak_topics": [
    {
      "chapter_id": "uuid",
      "chapter_name": "Mechanics",
      "subject_name": "Physics",
      "avg_accuracy": 65.00
    }
  ],
  "strong_topics": [...]
}
```

---

## Planner Endpoints

### Generate Study Plan
```http
POST /api/planner/generate
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "plan": {
    "daily_plans": [...],
    "revision_slots": [...],
    "mock_test_days": [...]
  },
  "studentData": {
    "examType": "JEE",
    "examDate": "2024-12-15",
    "remainingDays": 120
  }
}
```

### Get Today's Plan
```http
GET /api/planner/today
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "days_remaining": 120,
  "today_sessions": [...],
  "upcoming_revisions": [...],
  "daily_time_minutes": 120
}
```

---

## Subjects & Chapters

### Get All Subjects
```http
GET /api/subjects
```
**Headers:** `Authorization: Bearer <token>`

### Create Subject
```http
POST /api/subjects
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "subject_name": "Mathematics"
}
```

### Get Chapters by Subject
```http
GET /api/chapters/subject/:subjectId
```
**Headers:** `Authorization: Bearer <token>`

### Get Chapter by ID
```http
GET /api/chapters/:chapterId
```
**Headers:** `Authorization: Bearer <token>`

### Create Chapter
```http
POST /api/chapters
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "subject_id": "uuid",
  "chapter_name": "Algebra",
  "difficulty_level": "Medium"
}
```

---

## Health Check

### Check API Status
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "SikshaBuddy API is running"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently, there are no rate limits. However, OpenAI API calls are subject to OpenAI's rate limits.

---

## File Upload Limits

- Maximum file size: 50MB
- Supported formats: PDF, DOCX, DOC, PNG, JPG, JPEG, TXT

---

## Notes

- All UUIDs are in standard UUID v4 format
- Dates are in ISO 8601 format (YYYY-MM-DD)
- Time values are in minutes
- Accuracy percentages are decimals (0-100)

