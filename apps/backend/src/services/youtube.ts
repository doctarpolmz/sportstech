import { youtube as yt } from '../config/google.js';

export async function fetchTutorialsForKeywords(keywords: string[]): Promise<{ title: string; url: string }[]> {
  const q = keywords.slice(0, 5).join(' ');
  const res = await yt.search.list({
    key: process.env.YOUTUBE_API_KEY,
    part: ['snippet'],
    maxResults: 5,
    q: q + ' training tutorial',
    type: ['video'],
    relevanceLanguage: 'en'
  } as any);
  const items = res.data.items || [];
  return items.map((i: any) => ({
    title: i.snippet?.title,
    url: `https://www.youtube.com/watch?v=${i.id?.videoId}`,
  }));
}
