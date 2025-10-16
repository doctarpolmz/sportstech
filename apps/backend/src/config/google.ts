import { google } from 'googleapis';

export function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CALENDAR_CLIENT_ID,
    process.env.GOOGLE_CALENDAR_CLIENT_SECRET,
    process.env.GOOGLE_CALENDAR_REDIRECT_URI,
  );
  return client;
}

export const youtube = google.youtube('v3');
export const calendar = google.calendar('v3');
