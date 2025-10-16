import { Response } from 'express';
import { Video } from '../models/Video.model';
import { AuthRequest } from '../types';
import { analyzeVideo } from '../services/video-intelligence.service';
import { fetchYouTubeRecommendations } from '../services/youtube.service';

export const uploadVideoFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No video file uploaded' });
      return;
    }

    const { title, description, sport } = req.body;

    const video = new Video({
      userId: req.user?.userId,
      title,
      description,
      sport,
      filename: req.file.filename,
      filepath: req.file.path,
      fileSize: req.file.size,
      analysisStatus: 'pending'
    });

    await video.save();

    res.status(201).json({
      message: 'Video uploaded successfully',
      video
    });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};

export const getVideos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const videos = await Video.find({ userId: req.user?.userId })
      .sort({ uploadDate: -1 });

    res.json(videos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

export const getVideoById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    // Check authorization
    if (video.userId !== req.user?.userId && req.user?.role !== 'coach' && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(video);
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
};

export const analyzeVideoById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    if (video.userId !== req.user?.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    video.analysisStatus = 'processing';
    await video.save();

    // Perform analysis
    try {
      const analysis = await analyzeVideo(video.filepath, video.sport);
      
      // Fetch YouTube recommendations
      const youtubeRecommendations = await fetchYouTubeRecommendations(
        video.sport,
        analysis.improvements || []
      );

      video.analysisResult = {
        ...analysis,
        youtubeRecommendations
      } as any;
      video.analysisStatus = 'completed';
    } catch (error) {
      console.error('Analysis error:', error);
      video.analysisStatus = 'failed';
    }

    await video.save();

    res.json({
      message: 'Analysis completed',
      video
    });
  } catch (error) {
    console.error('Analyze video error:', error);
    res.status(500).json({ error: 'Failed to analyze video' });
  }
};

export const deleteVideo = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    if (video.userId !== req.user?.userId && req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await video.deleteOne();

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};
