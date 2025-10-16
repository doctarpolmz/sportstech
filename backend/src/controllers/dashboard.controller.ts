import { Response } from 'express';
import { Video } from '../models/Video.model';
import { Schedule } from '../models/Schedule.model';
import { CoachNote } from '../models/CoachNote.model';
import { User } from '../models/User.model';
import { AuthRequest } from '../types';

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (role === 'athlete') {
      const totalVideos = await Video.countDocuments({ userId });
      const analyzedVideos = await Video.countDocuments({ 
        userId, 
        analysisStatus: 'completed' 
      });
      
      const upcomingSchedules = await Schedule.countDocuments({
        athleteId: userId,
        startTime: { $gte: new Date() }
      });

      const recentVideos = await Video.find({ userId })
        .sort({ uploadDate: -1 })
        .limit(5);

      const avgPerformance = await Video.aggregate([
        { 
          $match: { 
            userId, 
            analysisStatus: 'completed',
            'analysisResult.performanceScore': { $exists: true }
          } 
        },
        {
          $group: {
            _id: null,
            avgScore: { $avg: '$analysisResult.performanceScore' }
          }
        }
      ]);

      res.json({
        totalVideos,
        analyzedVideos,
        upcomingSchedules,
        averagePerformanceScore: avgPerformance[0]?.avgScore || 0,
        recentVideos
      });
    } else if (role === 'coach') {
      const totalAthletes = await User.countDocuments({ coachId: userId });
      const totalNotes = await CoachNote.countDocuments({ coachId: userId });
      const upcomingSchedules = await Schedule.countDocuments({
        coachId: userId,
        startTime: { $gte: new Date() }
      });

      const athletesList = await User.find({ coachId: userId })
        .select('firstName lastName profilePhoto')
        .limit(10);

      res.json({
        totalAthletes,
        totalNotes,
        upcomingSchedules,
        athletesList
      });
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};

export const getPerformanceHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const videos = await Video.find({
      userId,
      analysisStatus: 'completed',
      'analysisResult.performanceScore': { $exists: true }
    })
    .sort({ uploadDate: 1 })
    .select('title uploadDate analysisResult.performanceScore sport');

    const history = videos.map(video => ({
      date: video.uploadDate,
      score: video.analysisResult?.performanceScore || 0,
      title: video.title,
      sport: video.sport
    }));

    res.json(history);
  } catch (error) {
    console.error('Get performance history error:', error);
    res.status(500).json({ error: 'Failed to fetch performance history' });
  }
};
