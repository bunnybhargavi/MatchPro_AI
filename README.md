
# MatchPro AI - Resume & Job Description Matcher

MatchPro AI is a professional, SEO-optimized web application that helps job seekers align their resumes with job descriptions using Google's Gemini AI. 

## 🚀 Deployment Instructions

### 1. Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Initialize your local folder: `git init`.
3. Add files: `git add .`.
4. Commit: `git commit -m "Initial commit"`.
5. Link to GitHub: `git remote add origin YOUR_GITHUB_REPO_URL`.
6. Push: `git push -u origin main`.

### 2. Deploy to Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Select **GitHub** and authorize MatchPro AI.
4. Leave the build settings as default (usually Netlify detects static sites automatically).
5. **CRITICAL SECURITY STEP**: 
   - Go to **Site Configuration** > **Environment variables**.
   - Create a new variable named `API_KEY`.
   - Paste your Google Gemini API Key as the value.
6. Click **Deploy site**.

## 🛠 Features
- **Multi-modal Analysis**: Upload PDF, Images, or paste Text.
- **ATS Optimization**: Identifies missing keywords and skill gaps.
- **Visual Insights**: Interactive charts showing skill overlap.
- **Privacy Focused**: No data is stored permanently on servers.

## 🛡 Security
This app uses environment variables to keep your API keys secret. Never hardcode your API key directly into `geminiService.ts` before pushing to GitHub.
