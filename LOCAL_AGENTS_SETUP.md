# Local Agents Setup Guide

SikshaBuddy now uses **local AI agents** that work without any API keys! 🎉

## 🚀 Two Options Available

### Option 1: Ollama (Recommended - Full AI Capabilities)

Ollama runs large language models locally on your machine. No API keys needed!

#### Installation

1. **Install Ollama:**
   - Windows: Download from https://ollama.ai/download
   - Mac: `brew install ollama`
   - Linux: `curl -fsSL https://ollama.ai/install.sh | sh`

2. **Pull a Model:**
   ```bash
   ollama pull llama2
   # or
   ollama pull mistral
   # or
   ollama pull codellama
   ```

3. **Start Ollama:**
   ```bash
   ollama serve
   ```
   (Usually runs automatically on Windows/Mac)

4. **Configure (Optional):**
   Add to `.env` if Ollama runs on different port:
   ```env
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama2
   ```

#### Available Models

- **llama2** - General purpose (recommended)
- **mistral** - Fast and efficient
- **codellama** - Good for technical content
- **phi** - Lightweight option

### Option 2: Fallback Agent (No Installation Required)

If Ollama is not running, SikshaBuddy automatically uses a **rule-based fallback agent** that:
- ✅ Works immediately without setup
- ✅ Generates notes, quizzes, flashcards, and tests
- ✅ Uses intelligent text extraction and formatting
- ⚠️  Less sophisticated than full AI models

## 📝 Configuration

### .env File

Remove or comment out API key lines:
```env
# No API keys needed!
# GEMINI_API_KEY=...
# OPENAI_API_KEY=...

# Optional Ollama configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

## ✅ Testing

1. **Test Ollama Connection:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. **Test in SikshaBuddy:**
   - Start server: `npm run dev`
   - Upload a study material
   - Generate notes or quiz
   - Check server logs for connection status

## 🎯 How It Works

1. **Primary**: Tries to use Ollama (if running)
2. **Fallback**: Uses rule-based agent (always works)
3. **No API Keys**: Everything runs locally!

## 🔧 Troubleshooting

### Ollama Not Found
- Install Ollama from https://ollama.ai
- Make sure `ollama serve` is running
- Check port 11434 is accessible

### Slow Responses
- Use a smaller model: `ollama pull phi`
- Or use the fallback agent (faster but simpler)

### Model Not Found
- Pull the model: `ollama pull llama2`
- Or change model in `.env`: `OLLAMA_MODEL=mistral`

## 💡 Benefits

✅ **No API Keys** - Complete privacy
✅ **No Internet Required** - Works offline
✅ **No Costs** - Completely free
✅ **Fast** - Local processing
✅ **Private** - Your data stays on your machine

## 🚀 Quick Start

1. **Install Ollama** (optional but recommended)
2. **Pull a model**: `ollama pull llama2`
3. **Start SikshaBuddy**: `npm run dev`
4. **That's it!** No API keys needed!

---

**Note**: The fallback agent works immediately, but Ollama provides much better AI-generated content!

