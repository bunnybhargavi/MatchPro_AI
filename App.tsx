
import React, { useState } from 'react';
import { analyzeResume, ResumeInput } from './services/geminiService';
import { AnalysisResult } from './types';
import SkillChart from './components/SkillChart';
import { 
  FileText, 
  Briefcase, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Loader2, 
  ChevronRight, 
  ShieldCheck,
  Search,
  Upload,
  FileIcon,
  X
} from 'lucide-react';

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState<{ data: string, mimeType: string, name: string } | null>(null);
  const [jdText, setJdText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    // Handle Text Files
    if (file.type === 'text/plain' || file.name.endsWith('.md')) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
        setResumeFile(null);
      };
      reader.readAsText(file);
    } 
    // Handle PDFs and Images
    else if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setResumeFile({
          data: base64,
          mimeType: file.type,
          name: file.name
        });
        setResumeText(''); // Clear text if file is uploaded
      };
      reader.readAsDataURL(file);
    } else {
      setError("Unsupported file format. Please upload a .txt, .pdf, or image file.");
    }
  };

  const removeFile = () => {
    setResumeFile(null);
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() && !resumeFile) {
      setError("Please provide your resume as text or an uploaded file.");
      return;
    }
    if (!jdText.trim()) {
      setError("Please provide a job description.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    try {
      const input: ResumeInput = {
        text: resumeText || undefined,
        file: resumeFile ? { data: resumeFile.data, mimeType: resumeFile.mimeType } : undefined
      };
      const data = await analyzeResume(input, jdText);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Zap className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">MatchPro AI</h1>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Analysis</span>
            <span className="flex items-center gap-1"><Search className="w-4 h-4 text-indigo-500" /> Multi-modal AI</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 space-y-8">
        {/* SEO Content Section */}
        <section className="text-center space-y-4 py-6">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">
            Land Your Dream Job with <span className="text-indigo-600">AI Precision</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Analyze your resume (PDF, Image, or Text) against any job description. Find missing keywords and optimize for ATS.
          </p>
        </section>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileText className="w-4 h-4 text-indigo-500" /> Your Resume
              </label>
              <input 
                type="file" 
                id="resume-upload" 
                className="hidden" 
                accept=".txt,.pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload} 
              />
              <label 
                htmlFor="resume-upload" 
                className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 cursor-pointer hover:bg-indigo-100 transition-colors flex items-center gap-1"
              >
                <Upload className="w-3 h-3" /> Upload PDF / Image
              </label>
            </div>
            
            {resumeFile ? (
              <div className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/30 group relative">
                <button 
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
                <FileIcon className="w-12 h-12 text-indigo-400 mb-2" />
                <p className="text-sm font-medium text-slate-700">{resumeFile.name}</p>
                <p className="text-xs text-slate-500">File attached and ready for analysis</p>
              </div>
            ) : (
              <textarea
                className="w-full h-64 p-4 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white shadow-sm"
                placeholder="Paste your resume text here, or use the upload button above..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Briefcase className="w-4 h-4 text-indigo-500" /> Job Description
            </label>
            <textarea
              className="w-full h-64 p-4 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white shadow-sm"
              placeholder="Paste the job description you are targeting..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col items-center justify-center pt-4">
          {error && (
            <div className="mb-4 text-sm text-rose-600 bg-rose-50 px-4 py-2 rounded-lg border border-rose-100">
              {error}
            </div>
          )}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`
              w-full md:w-64 py-4 px-8 rounded-full text-white font-bold text-lg shadow-lg shadow-indigo-200 
              transition-all flex items-center justify-center gap-2
              ${isAnalyzing ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}
            `}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              'Analyze Match'
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && !isAnalyzing && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Score Card */}
              <div className="md:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                <h3 className="text-slate-500 font-medium text-sm mb-4">Overall Match Score</h3>
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-slate-100"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={364.4}
                      strokeDashoffset={364.4 - (364.4 * result.matchScore) / 100}
                      className="text-indigo-600 transition-all duration-1000"
                    />
                  </svg>
                  <span className="absolute text-3xl font-bold text-slate-800">{result.matchScore}%</span>
                </div>
                <p className="mt-4 text-sm text-slate-500 italic">
                  "{result.matchScore > 80 ? 'Highly compatible! Great job.' : result.matchScore > 50 ? 'Strong potential, needs optimization.' : 'Significant gaps detected.'}"
                </p>
              </div>

              {/* Chart Section */}
              <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-slate-800 font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" /> Skill Overlap Analysis
                </h3>
                <SkillChart 
                  matchedCount={result.matchedSkills.length} 
                  missingCount={result.missingSkills.length} 
                />
              </div>
            </div>

            {/* Detailed Skills Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-emerald-700 flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5" /> Matched Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.length > 0 ? (
                    result.matchedSkills.map((skill, idx) => (
                      <span key={idx} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium border border-emerald-100">
                        {skill.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">No direct skill matches found.</span>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-rose-700 flex items-center gap-2 mb-4">
                  <XCircle className="w-5 h-5" /> Missing Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill, idx) => (
                      <span key={idx} className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-sm font-medium border border-rose-100">
                        {skill.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">You match all identified skills!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2 mb-6">
                <Lightbulb className="w-6 h-6 text-amber-500" /> Strategic Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-indigo-800">Summary</h4>
                  <p className="text-slate-700 leading-relaxed text-sm">
                    {result.summary}
                  </p>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-indigo-800">Learning Paths</h4>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-700 bg-white/50 p-3 rounded-lg">
                        <ChevronRight className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Zap className="text-indigo-600 w-6 h-6" />
              <span className="text-xl font-bold">MatchPro AI</span>
            </div>
            <p className="text-sm text-slate-500">
              Empowering job seekers with state-of-the-art AI analysis for a faster, smarter job search.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Privacy & Security</h4>
            <p className="text-sm text-slate-500">
              Your data is processed securely via Google Gemini. We do not store your files on our servers.
            </p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 mt-12 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} MatchPro AI. All rights reserved. Built for professional career optimization.
        </div>
      </footer>
    </div>
  );
};

export default App;
