import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, TrendingUp, TrendingDown, Youtube } from 'lucide-react';
import { Video } from '@/types';
import api from '@/lib/api';

export default function VideoAnalysis() {
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await api.get(`/videos/${id}`);
      setVideo(response.data);
    } catch (error) {
      console.error('Failed to fetch video:', error);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const response = await api.post(`/videos/${id}/analyze`);
      setVideo(response.data.video);
      alert('Analysis completed!');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{video.title}</h1>
        <p className="text-muted-foreground">{video.sport} • {new Date(video.uploadDate).toLocaleDateString()}</p>
      </div>

      {/* Video Player */}
      <Card>
        <CardContent className="pt-6">
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <video controls className="w-full h-full rounded-lg">
              <source src={`/${video.filepath}`} type="video/mp4" />
            </video>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Section */}
      {video.analysisStatus === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>Analyze this video to get performance insights</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleAnalyze} disabled={analyzing}>
              <PlayCircle className="mr-2 h-5 w-5" />
              {analyzing ? 'Analyzing...' : 'Start Analysis'}
            </Button>
          </CardContent>
        </Card>
      )}

      {video.analysisResult && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-6xl font-bold text-primary">
                  {video.analysisResult.performanceScore}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detected Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {video.analysisResult.detectedLabels.map((label, idx) => (
                    <span key={idx} className="px-3 py-1 bg-secondary rounded-full text-sm">
                      {label}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {video.analysisResult.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {video.analysisResult.weaknesses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-orange-500" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {video.analysisResult.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-500">!</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {video.analysisResult.improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-primary">→</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-red-500" />
                  YouTube Training Videos
                </CardTitle>
                <CardDescription>Recommended tutorials to improve your skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {video.analysisResult.youtubeRecommendations.map((rec, idx) => (
                    <a
                      key={idx}
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <img src={rec.thumbnail} alt={rec.title} className="w-full aspect-video object-cover" />
                      <div className="p-4">
                        <h3 className="font-medium line-clamp-2">{rec.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{rec.channel}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
