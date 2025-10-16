import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Video, FileText } from 'lucide-react';
import { User, CoachNote } from '@/types';
import api from '@/lib/api';

export default function CoachDashboard() {
  const [athletes, setAthletes] = useState<User[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<User | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [notes, setNotes] = useState<CoachNote[]>([]);
  const [newNote, setNewNote] = useState({
    note: '',
    category: 'performance' as const
  });

  useEffect(() => {
    fetchAthletes();
  }, []);

  useEffect(() => {
    if (selectedAthlete) {
      fetchAthleteData(selectedAthlete.id);
    }
  }, [selectedAthlete]);

  const fetchAthletes = async () => {
    try {
      const response = await api.get('/coach/athletes');
      setAthletes(response.data);
    } catch (error) {
      console.error('Failed to fetch athletes:', error);
    }
  };

  const fetchAthleteData = async (athleteId: string) => {
    try {
      const [videosRes, notesRes] = await Promise.all([
        api.get(`/coach/athletes/${athleteId}/videos`),
        api.get(`/coach/notes/${athleteId}`)
      ]);
      setVideos(videosRes.data);
      setNotes(notesRes.data);
    } catch (error) {
      console.error('Failed to fetch athlete data:', error);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAthlete) return;

    try {
      await api.post('/coach/notes', {
        athleteId: selectedAthlete.id,
        ...newNote
      });
      alert('Note added successfully!');
      setNewNote({ note: '', category: 'performance' });
      fetchAthleteData(selectedAthlete.id);
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Failed to add note');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Coach Dashboard</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Athletes List */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Athletes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {athletes.map((athlete) => (
              <div
                key={athlete.id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-accent ${
                  selectedAthlete?.id === athlete.id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedAthlete(athlete)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    {athlete.firstName[0]}{athlete.lastName[0]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {athlete.firstName} {athlete.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{athlete.email}</p>
                  </div>
                </div>
              </div>
            ))}

            {athletes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-2" />
                <p>No athletes yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Athlete Details */}
        <Card className="col-span-8">
          {selectedAthlete ? (
            <>
              <CardHeader>
                <CardTitle>
                  {selectedAthlete.firstName} {selectedAthlete.lastName}
                </CardTitle>
                <CardDescription>{selectedAthlete.email}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="videos" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="videos" className="space-y-4 mt-4">
                    {videos.map((video) => (
                      <div key={video._id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Video className="h-5 w-5" />
                          <h3 className="font-medium">{video.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{video.sport}</p>
                        {video.analysisResult && (
                          <p className="text-sm font-medium text-primary mt-2">
                            Performance: {video.analysisResult.performanceScore}/100
                          </p>
                        )}
                      </div>
                    ))}

                    {videos.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Video className="mx-auto h-12 w-12 mb-2" />
                        <p>No videos uploaded yet</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4 mt-4">
                    {/* Add Note Form */}
                    <form onSubmit={handleAddNote} className="border rounded-lg p-4">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="note">Add Note</Label>
                          <Input
                            id="note"
                            value={newNote.note}
                            onChange={(e) => setNewNote({ ...newNote, note: e.target.value })}
                            placeholder="Enter your note..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <select
                            id="category"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={newNote.category}
                            onChange={(e) => setNewNote({ ...newNote, category: e.target.value as any })}
                          >
                            <option value="performance">Performance</option>
                            <option value="technique">Technique</option>
                            <option value="fitness">Fitness</option>
                            <option value="mental">Mental</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <Button type="submit">Add Note</Button>
                      </div>
                    </form>

                    {/* Notes List */}
                    {notes.map((note) => (
                      <div key={note._id} className="border rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5" />
                          <span className="text-sm font-medium capitalize">{note.category}</span>
                        </div>
                        <p className="text-sm">{note.note}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}

                    {notes.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="mx-auto h-12 w-12 mb-2" />
                        <p>No notes yet</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground py-12">
              Select an athlete to view details
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
