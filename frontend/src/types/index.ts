export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'athlete' | 'coach' | 'admin';
  profilePhoto?: string;
  isEmailVerified: boolean;
  coachId?: string;
}

export interface Video {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  filename: string;
  filepath: string;
  sport: string;
  uploadDate: string;
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed';
  analysisResult?: AnalysisResult;
}

export interface AnalysisResult {
  performanceScore: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  youtubeRecommendations: YouTubeRecommendation[];
  detectedLabels: string[];
  timestamp: string;
}

export interface YouTubeRecommendation {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  url: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'file' | 'video';
  fileUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface Schedule {
  _id: string;
  coachId: string;
  athleteId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  type: 'training' | 'match' | 'meeting';
}

export interface Lineup {
  _id: string;
  coachId: string;
  teamName: string;
  sport: string;
  formation: string;
  players: LineupPlayer[];
}

export interface LineupPlayer {
  playerId: string;
  playerName: string;
  position: string;
  photo?: string;
  x: number;
  y: number;
}

export interface CoachNote {
  _id: string;
  coachId: string;
  athleteId: string;
  videoId?: string;
  note: string;
  category: 'performance' | 'technique' | 'fitness' | 'mental' | 'other';
  createdAt: string;
}

export interface DashboardStats {
  totalVideos?: number;
  analyzedVideos?: number;
  upcomingSchedules?: number;
  averagePerformanceScore?: number;
  recentVideos?: Video[];
  totalAthletes?: number;
  totalNotes?: number;
  athletesList?: User[];
}
