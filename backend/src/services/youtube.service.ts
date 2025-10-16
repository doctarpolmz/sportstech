import axios from 'axios';
import { IYouTubeRecommendation } from '../types';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

export const fetchYouTubeRecommendations = async (
  sport: string,
  improvements: string[]
): Promise<IYouTubeRecommendation[]> => {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured');
    return [];
  }

  try {
    const searchQueries = improvements.map(improvement => 
      `${sport} ${improvement} tutorial`
    );

    const recommendations: IYouTubeRecommendation[] = [];

    for (const query of searchQueries.slice(0, 3)) { // Limit to 3 queries
      const response = await axios.get(YOUTUBE_API_URL, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 2,
          key: YOUTUBE_API_KEY,
          videoDuration: 'medium',
          order: 'relevance'
        }
      });

      const videos = response.data.items || [];
      
      videos.forEach((video: any) => {
        recommendations.push({
          videoId: video.id.videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.medium.url,
          channel: video.snippet.channelTitle,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`
        });
      });
    }

    return recommendations.slice(0, 6); // Return top 6 recommendations
  } catch (error) {
    console.error('YouTube API error:', error);
    return [];
  }
};
