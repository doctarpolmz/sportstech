import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Plus } from 'lucide-react';
import { Schedule as ScheduleType } from '@/types';
import api from '@/lib/api';

export default function Schedule() {
  const { user } = useAuthStore();
  const [schedules, setSchedules] = useState<ScheduleType[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    type: 'training' as 'training' | 'match' | 'meeting'
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await api.get('/schedules');
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/schedules', formData);
      alert('Schedule created successfully!');
      setShowCreate(false);
      setFormData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        type: 'training'
      });
      fetchSchedules();
    } catch (error) {
      console.error('Failed to create schedule:', error);
      alert('Failed to create schedule');
    }
  };

  const upcomingSchedules = schedules.filter(s => new Date(s.startTime) >= new Date());
  const pastSchedules = schedules.filter(s => new Date(s.startTime) < new Date());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Schedule</h1>
        {user?.role === 'coach' && (
          <Button onClick={() => setShowCreate(!showCreate)}>
            <Plus className="mr-2 h-5 w-5" />
            Create Schedule
          </Button>
        )}
      </div>

      {showCreate && user?.role === 'coach' && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Schedule</CardTitle>
            <CardDescription>Schedule a training session or meeting</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="training">Training</option>
                  <option value="match">Match</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>

              <Button type="submit">Create Schedule</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Schedules */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Upcoming</h2>
        <div className="space-y-4">
          {upcomingSchedules.map((schedule) => (
            <Card key={schedule._id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <CardTitle>{schedule.title}</CardTitle>
                </div>
                <CardDescription className="capitalize">{schedule.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {schedule.description && <p className="text-sm">{schedule.description}</p>}
                  <p className="text-sm text-muted-foreground">
                    {new Date(schedule.startTime).toLocaleString()} - {new Date(schedule.endTime).toLocaleTimeString()}
                  </p>
                  {schedule.location && (
                    <p className="text-sm text-muted-foreground">📍 {schedule.location}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {upcomingSchedules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-2" />
              <p>No upcoming schedules</p>
            </div>
          )}
        </div>
      </div>

      {/* Past Schedules */}
      {pastSchedules.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Past</h2>
          <div className="space-y-4">
            {pastSchedules.map((schedule) => (
              <Card key={schedule._id} className="opacity-60">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <CardTitle>{schedule.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {new Date(schedule.startTime).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
