import { google } from 'googleapis';
import { ISchedule } from '../types';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const createCalendarEvent = async (
  schedule: ISchedule,
  accessToken: string
): Promise<string | undefined> => {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: schedule.title,
      description: schedule.description || '',
      location: schedule.location || '',
      start: {
        dateTime: schedule.startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: schedule.endTime.toISOString(),
        timeZone: 'UTC',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return response.data.id;
  } catch (error) {
    console.error('Google Calendar API error:', error);
    return undefined;
  }
};

export const updateCalendarEvent = async (
  eventId: string,
  schedule: ISchedule,
  accessToken: string
): Promise<void> => {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: schedule.title,
      description: schedule.description || '',
      location: schedule.location || '',
      start: {
        dateTime: schedule.startTime.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: schedule.endTime.toISOString(),
        timeZone: 'UTC',
      },
    };

    await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: event,
    });
  } catch (error) {
    console.error('Google Calendar API error:', error);
  }
};

export const deleteCalendarEvent = async (
  eventId: string,
  accessToken: string
): Promise<void> => {
  try {
    oauth2Client.setCredentials({ access_token: accessToken });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });
  } catch (error) {
    console.error('Google Calendar API error:', error);
  }
};
