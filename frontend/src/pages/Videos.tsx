import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Video as VideoIcon, Eye } from 'lucide-react';
import { Video } from '@/types';
import api from '@/lib/api';

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sport: 'football'
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.get('/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const form = e.currentTarget;
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (!file) {
      alert('Please select a video file');
      setUploading(false);
      return;
    }

    const data = new FormData();
    data.append('video', file);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('sport', formData.sport);

    try {
      await api.post('/videos/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Video uploaded successfully!');
      setShowUpload(false);
      setFormData({ title: '', description: '', sport: 'football' });
      fetchVideos();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Videos</h1>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Upload className="mr-2 h-5 w-5" />
          Upload Video
        </Button>
      </div>

      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle>Upload New Video</CardTitle>
            <CardDescription>Upload a video for AI analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sport">Sport</Label>
                <select
                  id="sport"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.sport}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                >
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="tennis">Tennis</option>
                  <option value="athletics">Athletics</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Video File</Label>
                <Input id="video" type="file" accept="video/*" required />
              </div>

              <Button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Video'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <Card key={video._id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <VideoIcon className="h-5 w-5" />
                <CardTitle className="text-lg">{video.title}</CardTitle>
              </div>
              <CardDescription>{video.sport}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {new Date(video.uploadDate).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  Status: <span className="capitalize">{video.analysisStatus}</span>
                </p>
                {video.analysisResult && (
                  <p className="text-sm font-medium text-primary">
                    Performance Score: {video.analysisResult.performanceScore}
                  </p>
                )}
                <Link to={`/videos/${video._id}`}>
                  <Button variant="outline" className="w-full mt-2">
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <VideoIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No videos yet</h3>
          <p className="text-muted-foreground">Upload your first video to get started</p>
        </div>
      )}
    </div>
  );
}
