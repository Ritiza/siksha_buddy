# 🎓 SikshaBuddy - AI-Powered Study Companion

<div align="center">

![SikshaBuddy Logo](https://img.shields.io/badge/SikshaBuddy-AI%20Study%20Companion-blue?style=for-the-badge&logo=graduation-cap)

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**An intelligent study companion that transforms your learning materials into personalized, AI-enhanced study resources.**

[🚀 Features](#-features) • [📋 Installation](#-installation) • [🎯 Usage](#-usage) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

SikshaBuddy is a comprehensive AI-powered study platform designed specifically for Indian competitive exams (JEE, NEET, CBSE). It leverages advanced AI to transform uploaded study materials into multiple formats including enhanced notes, intelligent flashcards, and interactive quizzes.

### 🎯 **Key Highlights**
- **🧠 AI-Enhanced Content Generation** - Deep analysis with multiple note formats
- **📚 Multiple Study Formats** - Cornell Notes, Mind Maps, Charts, Outlines
- **🃏 Intelligent Flashcards** - Cognitive-level based learning with 6 difficulty tiers
- **🌙 Modern UI/UX** - Dark mode, responsive design, smooth animations
- **📊 Progress Tracking** - Comprehensive analytics and study insights
- **🎓 Exam-Specific** - Tailored for JEE, NEET, and CBSE curricula

---

## ✨ Features

### 📝 **Enhanced Notes Generation**
- **5 Different Formats**: Structured, Cornell, Mind Map, Chart, Outline
- **Deep Content Analysis**: Relationships, cause-effects, applications
- **Smart Formatting**: Auto-categorized sections with icons
- **Interactive Elements**: Collapsible sections, bookmarking, search

### 🃏 **AI-Powered Flashcards**
- **Cognitive Levels**: Knowledge → Comprehension → Application → Analysis → Synthesis → Evaluation
- **Deep Questions**: Why/How questions instead of simple definitions
- **Progressive Difficulty**: Easy → Medium → Hard with smart progression
- **Multiple Card Types**: Conceptual, Application, Problem-solving, Critical thinking

### 🎨 **Modern User Interface**
- **🌙 Dark/Light Mode**: Comfortable reading in any environment
- **🔍 Advanced Search**: Real-time search with highlighting
- **📚 Table of Contents**: Quick navigation with bookmarking
- **👁️ Focus Mode**: Distraction-free study experience
- **📱 Responsive Design**: Perfect on desktop, tablet, and mobile

### 📊 **Study Analytics**
- **Progress Tracking**: Reading progress and completion rates
- **Performance Insights**: Strengths and weakness analysis
- **Study Planning**: AI-generated personalized study schedules
- **Goal Setting**: Track and achieve learning objectives

### 🎓 **Exam-Specific Features**
- **JEE Focus**: Numerical problems, derivations, engineering applications
- **NEET Optimization**: Medical applications, diagrams, factual recall
- **CBSE Alignment**: Board exam patterns and marking schemes

---

## 🚀 Technology Stack

### **Frontend**
- **React 18** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - Beautiful SVG icons
- **Axios** - HTTP client for API calls

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication
- **Multer** - File upload handling

### **AI & Content Processing**
- **Custom AI Engine** - Deep content analysis
- **Text Extraction** - PDF, DOCX, image processing
- **Natural Language Processing** - Content understanding
- **Cognitive Analysis** - Learning level assessment

---

## 📋 Installation

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### **Quick Start**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/siksha-buddy.git
   cd siksha-buddy
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp .env.example .env
   cp client/.env.example client/.env
   ```

4. **Configure Environment Variables**
   ```env
   # .env (root)
   MONGODB_URI=mongodb://localhost:27017/siksha_buddy
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   
   # client/.env
   REACT_APP_API_URL=http://localhost:5000
   ```

5. **Start MongoDB**
   ```bash
   # Using Docker (recommended)
   docker run -d -p 27018:27017 --name mongodb mongo:latest
   
   # Or start local MongoDB service
   mongod
   ```

6. **Run the application**
   ```bash
   # Start both server and client
   npm run dev
   
   # Or start separately
   npm run server  # Backend on port 5000
   npm run client  # Frontend on port 3001
   ```

7. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:5000

---

## 🎯 Usage

### **Getting Started**

1. **Register/Login**
   - Create account with exam type (JEE/NEET/CBSE)
   - Set your grade and subjects

2. **Upload Study Materials**
   - Support for PDF, DOCX, TXT, and image files
   - Automatic text extraction and processing
   - Subject detection and categorization

3. **Generate Enhanced Content**
   - Choose from 5 note formats
   - Generate AI-powered flashcards
   - Create practice quizzes and tests

4. **Study & Track Progress**
   - Use interactive study tools
   - Track reading progress and performance
   - Get personalized recommendations

### **Study Formats Guide**

| Format | Best For | Features |
|--------|----------|----------|
| 📋 **Structured** | Comprehensive learning | Deep analysis, relationships, applications |
| 📝 **Cornell** | Active note-taking | Cue column, summary section, review system |
| 🧠 **Mind Map** | Visual learners | Branching concepts, visual connections |
| 📊 **Chart** | Process understanding | Flowcharts, cause-effect diagrams |
| 📑 **Outline** | Hierarchical learning | Numbered sections, organized structure |

---

## 🏗️ Project Structure

```
siksha-buddy/
├── 📁 client/                 # React frontend
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable UI components
│   │   ├── 📁 pages/          # Page components
│   │   ├── 📁 services/       # API services
│   │   └── 📁 utils/          # Utility functions
│   └── 📄 package.json
├── 📁 server/                 # Node.js backend
│   ├── 📁 config/             # Database configuration
│   ├── 📁 middleware/         # Express middleware
│   ├── 📁 models/             # MongoDB models
│   ├── 📁 routes/             # API routes
│   ├── 📁 services/           # Business logic
│   │   ├── 📄 llmService.js           # AI content generation
│   │   ├── 📄 enhancedContentGenerator.js  # Format-specific generation
│   │   └── 📄 deepAnalysis.js         # Content analysis engine
│   └── 📁 utils/              # Helper functions
├── 📁 database/               # Database schemas
├── 📄 package.json
├── 📄 README.md
└── 📄 .env.example
```

---

## 🔧 API Documentation

### **Authentication**
```javascript
POST /api/auth/register  # User registration
POST /api/auth/login     # User login
GET  /api/auth/profile   # Get user profile
```

### **Materials Management**
```javascript
GET    /api/materials           # Get user materials
POST   /api/materials/upload    # Upload new material
DELETE /api/materials/:id       # Delete material
```

### **Study Content Generation**
```javascript
POST /api/study/notes       # Generate enhanced notes
POST /api/study/flashcards  # Generate AI flashcards
POST /api/study/quiz        # Generate practice quiz
```

### **Progress Tracking**
```javascript
GET  /api/progress/stats    # Get study statistics
POST /api/progress/update   # Update progress
GET  /api/progress/analytics # Get detailed analytics
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### **Contribution Guidelines**
- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

### **Areas for Contribution**
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🧪 Test coverage expansion

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for AI inspiration and techniques
- **React Team** for the amazing frontend framework
- **MongoDB** for the flexible database solution
- **Tailwind CSS** for the utility-first CSS framework
- **Heroicons** for beautiful icons

---

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/siksha-buddy/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/siksha-buddy/discussions)

---

<div align="center">

**Made with ❤️ for Indian students preparing for competitive exams**

⭐ **Star this repo if you find it helpful!** ⭐

</div>