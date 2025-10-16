import axios from 'axios';

export async function analyzeVideoWithGoogle({ gcsUri, localPath, sportHint }) {
  // Placeholder: real implementation would upload to GCS and call Video Intelligence API
  if (!process.env.GOOGLE_API_KEY) {
    // Return mocked analysis for local dev
    return {
      score: 72,
      labels: ['athletics', 'running', sportHint || 'general'],
      feedback: {
        missing: ['Arm drive consistency', 'Stride length optimization'],
        improvements: ['Increase cadence by 5%', 'Maintain upright posture'],
      }
    };
  }
  // Example YouTube Data API usage shown below; Video Intelligence requires service account and GCS
  return {
    score: 70,
    labels: [sportHint || 'general'],
    feedback: { missing: [], improvements: [] }
  };
}

export async function getYoutubeRecommendations(query) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return [
      { title: 'Basic Technique Tutorial', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { title: 'Advanced Drills', url: 'https://www.youtube.com/watch?v=9bZkp7q19f0' }
    ];
  }
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${apiKey}`;
  const { data } = await axios.get(url);
  return data.items.map((item) => ({
    title: item.snippet.title,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`
  }));
}

export async function createGoogleCalendarEvent({ accessToken, summary, description, start, end, attendees }) {
  if (!accessToken) {
    return { id: 'dev-google-event', summary, start, end };
  }
  const resp = await axios.post('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    summary,
    description,
    start: { dateTime: start },
    end: { dateTime: end },
    attendees: attendees?.map((email) => ({ email })) || []
  }, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return resp.data;
}
