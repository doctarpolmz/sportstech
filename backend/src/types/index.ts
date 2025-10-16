import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'athlete' | 'coach' | 'admin';
  profilePhoto?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  coachId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IVideo extends Document {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  filename: string;
  filepath: string;
  fileSize: number;
  duration?: number;
  sport: string;
  uploadDate: Date;
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed';
  analysisResult?: IAnalysisResult;
}

export interface IAnalysisResult {
  performanceScore: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  youtubeRecommendations: IYouTubeRecommendation[];
  detectedLabels: string[];
  poseAnalysis?: any;
  timestamp: Date;
}

export interface IYouTubeRecommendation {
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  url: string;
}

export interface IMessage extends Document {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'file' | 'video';
  fileUrl?: string;
  read: boolean;
  createdAt: Date;
}

export interface ISchedule extends Document {
  _id: string;
  coachId: string;
  athleteId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  type: 'training' | 'match' | 'meeting';
  googleCalendarEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILineup extends Document {
  _id: string;
  coachId: string;
  teamName: string;
  sport: string;
  formation: string;
  players: ILineupPlayer[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ILineupPlayer {
  playerId: string;
  playerName: string;
  position: string;
  photo?: string;
  x: number;
  y: number;
}

export interface ICoachNote extends Document {
  _id: string;
  coachId: string;
  athleteId: string;
  videoId?: string;
  note: string;
  category: 'performance' | 'technique' | 'fitness' | 'mental' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: 'athlete' | 'coach' | 'admin';
  };
}
