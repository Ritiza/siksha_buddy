# Google Gemini API Setup Guide

SikshaBuddy now uses **Google Gemini API** instead of OpenAI for AI-powered content generation.

## 🔑 Getting Your Gemini API Key

1. **Visit Google AI Studio:**
   - Go to: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign in with your Google account**

3. **Create API Key:**
   - Click "Create API Key"
   - Select or create a Google Cloud project
   - Copy your API key

4. **Add to .env file:**
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

## 📝 Available Models

SikshaBuddy uses the following Gemini models:

- **gemini-pro** (default) - Best for text generation, notes, quizzes
- **gemini-pro-vision** - For image-based content (future feature)

You can change the model in `server/services/llmService.js` if needed.

## ✅ Benefits of Gemini

- **Free tier available** - Generous free usage limits
- **Fast responses** - Quick generation times
- **Multilingual support** - Great for Hindi and Hinglish
- **No credit card required** - For free tier usage

## 🔧 Configuration

Update your `.env` file:

```env
# Replace OPENAI_API_KEY with GEMINI_API_KEY
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚀 Testing

After setting up your API key, test the connection:

1. Start the server: `npm run dev`
2. Upload a study material
3. Try generating notes or a quiz
4. Check server logs for any API errors

## ⚠️ Troubleshooting

### API Key Errors
- Verify the key is correct (no extra spaces)
- Check if the key is active in Google AI Studio
- Ensure you're using the correct format

### Rate Limiting
- Free tier has rate limits
- If you hit limits, wait a few minutes or upgrade

### Model Errors
- Ensure you're using a valid model name
- Check Google AI Studio for available models

## 📚 Resources

- **Google AI Studio**: https://aistudio.google.com/
- **Gemini API Docs**: https://ai.google.dev/docs
- **Pricing**: Check Google AI Studio for current pricing

---

**Note**: Make sure to keep your API key secure and never commit it to version control!

