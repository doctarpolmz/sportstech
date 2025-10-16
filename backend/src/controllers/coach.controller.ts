import { Response } from 'express';
import { User } from '../models/User.model';
import { Video } from '../models/Video.model';
import { CoachNote } from '../models/CoachNote.model';
import { AuthRequest } from '../types';

export const getAthletes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const athletes = await User.find({ 
      coachId: req.user?.userId,
      role: 'athlete'
    }).select('-password');

    res.json(athletes);
  } catch (error) {
    console.error('Get athletes error:', error);
    res.status(500).json({ error: 'Failed to fetch athletes' });
  }
};

export const addAthlete = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { athleteId } = req.body;

    const athlete = await User.findById(athleteId);
    if (!athlete || athlete.role !== 'athlete') {
      res.status(404).json({ error: 'Athlete not found' });
      return;
    }

    athlete.coachId = req.user?.userId;
    await athlete.save();

    res.json({
      message: 'Athlete added successfully',
      athlete
    });
  } catch (error) {
    console.error('Add athlete error:', error);
    res.status(500).json({ error: 'Failed to add athlete' });
  }
};

export const removeAthlete = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { athleteId } = req.params;

    const athlete = await User.findById(athleteId);
    if (!athlete) {
      res.status(404).json({ error: 'Athlete not found' });
      return;
    }

    if (athlete.coachId !== req.user?.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    athlete.coachId = undefined;
    await athlete.save();

    res.json({ message: 'Athlete removed successfully' });
  } catch (error) {
    console.error('Remove athlete error:', error);
    res.status(500).json({ error: 'Failed to remove athlete' });
  }
};

export const addNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { athleteId, videoId, note, category } = req.body;

    const newNote = new CoachNote({
      coachId: req.user?.userId,
      athleteId,
      videoId,
      note,
      category
    });

    await newNote.save();

    res.status(201).json({
      message: 'Note added successfully',
      note: newNote
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ error: 'Failed to add note' });
  }
};

export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { athleteId } = req.params;

    const notes = await CoachNote.find({
      coachId: req.user?.userId,
      athleteId
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

export const getAthleteVideos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { athleteId } = req.params;

    // Verify coach owns this athlete
    const athlete = await User.findById(athleteId);
    if (!athlete || athlete.coachId !== req.user?.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const videos = await Video.find({ userId: athleteId })
      .sort({ uploadDate: -1 });

    res.json(videos);
  } catch (error) {
    console.error('Get athlete videos error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};
