import mongoose, { Schema } from 'mongoose';
import { IVideo } from '../types';

const videoSchema = new Schema<IVideo>({
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  filepath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  duration: Number,
  sport: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  analysisStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  analysisResult: {
    performanceScore: Number,
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
    youtubeRecommendations: [{
      videoId: String,
      title: String,
      thumbnail: String,
      channel: String,
      url: String
    }],
    detectedLabels: [String],
    poseAnalysis: Schema.Types.Mixed,
    timestamp: Date
  }
}, {
  timestamps: true
});

export const Video = mongoose.model<IVideo>('Video', videoSchema);
