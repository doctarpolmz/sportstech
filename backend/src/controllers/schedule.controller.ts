import { Response } from 'express';
import { Schedule } from '../models/Schedule.model';
import { AuthRequest } from '../types';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../services/calendar.service';

export const createSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { athleteId, title, description, startTime, endTime, location, type } = req.body;

    const schedule = new Schedule({
      coachId: req.user?.userId,
      athleteId,
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      location,
      type
    });

    await schedule.save();

    // Optional: Create Google Calendar event
    if (req.body.googleAccessToken) {
      const eventId = await createCalendarEvent(schedule, req.body.googleAccessToken);
      if (eventId) {
        schedule.googleCalendarEventId = eventId;
        await schedule.save();
      }
    }

    res.status(201).json({
      message: 'Schedule created successfully',
      schedule
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: 'Failed to create schedule' });
  }
};

export const getSchedules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    let schedules;
    if (role === 'coach') {
      schedules = await Schedule.find({ coachId: userId })
        .populate('athleteId', 'firstName lastName profilePhoto')
        .sort({ startTime: 1 });
    } else {
      schedules = await Schedule.find({ athleteId: userId })
        .populate('coachId', 'firstName lastName profilePhoto')
        .sort({ startTime: 1 });
    }

    res.json(schedules);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

export const updateSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    if (schedule.coachId !== req.user?.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const { title, description, startTime, endTime, location, type } = req.body;

    if (title) schedule.title = title;
    if (description !== undefined) schedule.description = description;
    if (startTime) schedule.startTime = new Date(startTime);
    if (endTime) schedule.endTime = new Date(endTime);
    if (location !== undefined) schedule.location = location;
    if (type) schedule.type = type;

    await schedule.save();

    // Update Google Calendar event
    if (req.body.googleAccessToken && schedule.googleCalendarEventId) {
      await updateCalendarEvent(
        schedule.googleCalendarEventId,
        schedule,
        req.body.googleAccessToken
      );
    }

    res.json({
      message: 'Schedule updated successfully',
      schedule
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ error: 'Failed to update schedule' });
  }
};

export const deleteSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);

    if (!schedule) {
      res.status(404).json({ error: 'Schedule not found' });
      return;
    }

    if (schedule.coachId !== req.user?.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Delete Google Calendar event
    if (req.body.googleAccessToken && schedule.googleCalendarEventId) {
      await deleteCalendarEvent(
        schedule.googleCalendarEventId,
        req.body.googleAccessToken
      );
    }

    await schedule.deleteOne();

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: 'Failed to delete schedule' });
  }
};
