
# MatchPro AI - Resume & Job Description Matcher

MatchPro AI is a professional, SEO-optimized web application that helps job seekers align their resumes with job descriptions using Google's Gemini AI. 

## 🚀 Deployment Instructions

### 1. Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Open your project folder in a terminal.
3. Run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### 2. Deploy to Netlify
1. Log in to [Netlify](https://app.netlify.com/).
2. Click **Add new site** > **Import an existing project**.
3. Select **GitHub** and pick this repository.
4. Netlify will automatically detect the settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. **IMPORTANT (SECURITY)**: 
   - Go to **Site Configuration** > **Environment variables**.
   - Create a new variable named `API_KEY`.
   - Paste your Google Gemini API Key.
6. Trigger a new deploy.

## 🛠 Features
- **Multi-modal Analysis**: Upload PDF, Images, or paste Text.
- **ATS Optimization**: Identifies missing keywords and skill gaps.
- **Visual Insights**: Interactive charts showing skill overlap.

## 🛡 Security
This app uses `process.env.API_KEY` injected during the build process. Your key is never stored in the source code on GitHub.
