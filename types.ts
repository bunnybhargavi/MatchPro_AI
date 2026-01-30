
export interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'tool';
}

export interface AnalysisResult {
  matchScore: number;
  matchedSkills: Skill[];
  missingSkills: Skill[];
  skillGapScore: number; // 0-100
  recommendations: string[];
  summary: string;
}

export interface ChartData {
  name: string;
  value: number;
  fill: string;
}
