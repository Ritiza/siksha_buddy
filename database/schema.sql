-- SikshaBuddy Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE students (
    student_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(20) DEFAULT 'English' CHECK (preferred_language IN ('English', 'Hindi', 'Hinglish')),
    exam_type VARCHAR(50) CHECK (exam_type IN ('Boards', 'JEE', 'NEET', 'CUET', 'University')),
    exam_date DATE,
    daily_study_time_minutes INTEGER DEFAULT 120,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE subjects (
    subject_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chapters table
CREATE TABLE chapters (
    chapter_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID REFERENCES subjects(subject_id) ON DELETE CASCADE,
    chapter_name VARCHAR(255) NOT NULL,
    difficulty_level VARCHAR(20) DEFAULT 'Medium' CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Uploaded materials table
CREATE TABLE uploaded_materials (
    material_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(subject_id) ON DELETE SET NULL,
    chapter_id UUID REFERENCES chapters(chapter_id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) CHECK (file_type IN ('PDF', 'PPT', 'Image', 'Text', 'DOCX')),
    extracted_text TEXT,
    file_size BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study sessions table
CREATE TABLE study_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(chapter_id) ON DELETE SET NULL,
    mode VARCHAR(50) CHECK (mode IN ('Notes', 'Quiz', 'Flashcards', 'Test', 'Revision')),
    time_spent_minutes INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    session_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz attempts table
CREATE TABLE quiz_attempts (
    attempt_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(chapter_id) ON DELETE SET NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0.00,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    questions_data JSONB,
    answers_data JSONB
);

-- Subjective tests table
CREATE TABLE subjective_tests (
    test_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(chapter_id) ON DELETE SET NULL,
    marks_type INTEGER CHECK (marks_type IN (2, 4, 5, 8, 10)),
    score_estimated DECIMAL(5,2),
    feedback TEXT,
    questions_data JSONB,
    answers_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Revision tracker table
CREATE TABLE revision_tracker (
    revision_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(student_id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES chapters(chapter_id) ON DELETE CASCADE,
    weakness_level VARCHAR(20) DEFAULT 'Medium' CHECK (weakness_level IN ('Low', 'Medium', 'High')),
    last_revised TIMESTAMP,
    revision_count INTEGER DEFAULT 0,
    next_revision_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress summary table
CREATE TABLE progress_summary (
    student_id UUID PRIMARY KEY REFERENCES students(student_id) ON DELETE CASCADE,
    total_study_time INTEGER DEFAULT 0,
    average_accuracy DECIMAL(5,2) DEFAULT 0.00,
    strongest_subject UUID REFERENCES subjects(subject_id) ON DELETE SET NULL,
    weakest_subject UUID REFERENCES subjects(subject_id) ON DELETE SET NULL,
    total_chapters_studied INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id)
);

-- Indexes for performance
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_chapters_subject ON chapters(subject_id);
CREATE INDEX idx_materials_student ON uploaded_materials(student_id);
CREATE INDEX idx_materials_chapter ON uploaded_materials(chapter_id);
CREATE INDEX idx_sessions_student ON study_sessions(student_id);
CREATE INDEX idx_sessions_date ON study_sessions(session_date);
CREATE INDEX idx_quiz_student ON quiz_attempts(student_id);
CREATE INDEX idx_revision_student ON revision_tracker(student_id);
CREATE INDEX idx_revision_next_date ON revision_tracker(next_revision_date);

-- Insert default subjects
INSERT INTO subjects (subject_name) VALUES
    ('Mathematics'),
    ('Physics'),
    ('Chemistry'),
    ('Biology'),
    ('English'),
    ('Hindi'),
    ('History'),
    ('Geography'),
    ('Economics'),
    ('Computer Science');

