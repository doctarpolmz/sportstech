import { Response } from 'express';
import { Lineup } from '../models/Lineup.model';
import { AuthRequest } from '../types';

export const createLineup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teamName, sport, formation, players } = req.body;

    const lineup = new Lineup({
      coachId: req.user?.userId,
      teamName,
      sport,
      formation,
      players
    });

    await lineup.save();

    res.status(201).json({
      message: 'Lineup created successfully',
      lineup
    });
  } catch (error) {
    console.error('Create lineup error:', error);
    res.status(500).json({ error: 'Failed to create lineup' });
  }
};

export const getLineups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lineups = await Lineup.find({ coachId: req.user?.userId })
      .sort({ createdAt: -1 });

    res.json(lineups);
  } catch (error) {
    console.error('Get lineups error:', error);
    res.status(500).json({ error: 'Failed to fetch lineups' });
  }
};

export const getLineupById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lineup = await Lineup.findById(req.params.id);

    if (!lineup) {
      res.status(404).json({ error: 'Lineup not found' });
      return;
    }

    if (lineup.coachId !== req.user?.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json(lineup);
  } catch (error) {
    console.error('Get lineup error:', error);
    res.status(500).json({ error: 'Failed to fetch lineup' });
  }
};

export const updateLineup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lineup = await Lineup.findById(req.params.id);

    if (!lineup) {
      res.status(404).json({ error: 'Lineup not found' });
      return;
    }

    if (lineup.coachId !== req.user?.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const { teamName, sport, formation, players } = req.body;

    if (teamName) lineup.teamName = teamName;
    if (sport) lineup.sport = sport;
    if (formation) lineup.formation = formation;
    if (players) lineup.players = players;

    await lineup.save();

    res.json({
      message: 'Lineup updated successfully',
      lineup
    });
  } catch (error) {
    console.error('Update lineup error:', error);
    res.status(500).json({ error: 'Failed to update lineup' });
  }
};

export const deleteLineup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lineup = await Lineup.findById(req.params.id);

    if (!lineup) {
      res.status(404).json({ error: 'Lineup not found' });
      return;
    }

    if (lineup.coachId !== req.user?.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await lineup.deleteOne();

    res.json({ message: 'Lineup deleted successfully' });
  } catch (error) {
    console.error('Delete lineup error:', error);
    res.status(500).json({ error: 'Failed to delete lineup' });
  }
};
