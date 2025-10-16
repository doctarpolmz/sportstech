import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout, Plus, Save } from 'lucide-react';
import { Lineup, LineupPlayer } from '@/types';
import api from '@/lib/api';

export default function LineupDesigner() {
  const [lineups, setLineups] = useState<Lineup[]>([]);
  const [selectedLineup, setSelectedLineup] = useState<Lineup | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [formData, setFormData] = useState({
    teamName: '',
    sport: 'football',
    formation: '4-4-2'
  });

  useEffect(() => {
    fetchLineups();
  }, []);

  const fetchLineups = async () => {
    try {
      const response = await api.get('/lineups');
      setLineups(response.data);
    } catch (error) {
      console.error('Failed to fetch lineups:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/lineups', {
        ...formData,
        players: []
      });
      alert('Lineup created successfully!');
      setShowCreate(false);
      setFormData({ teamName: '', sport: 'football', formation: '4-4-2' });
      fetchLineups();
      setSelectedLineup(response.data.lineup);
    } catch (error) {
      console.error('Failed to create lineup:', error);
      alert('Failed to create lineup');
    }
  };

  const formations = {
    football: ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1'],
    basketball: ['2-3 Zone', '3-2 Zone', 'Man-to-Man'],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lineup Designer</h1>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="mr-2 h-5 w-5" />
          Create Lineup
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Lineup</CardTitle>
            <CardDescription>Design your team's formation and positions</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                  required
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
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formation">Formation</Label>
                <select
                  id="formation"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.formation}
                  onChange={(e) => setFormData({ ...formData, formation: e.target.value })}
                >
                  {(formations[formData.sport as keyof typeof formations] || formations.football).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <Button type="submit">Create Lineup</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Lineups List */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              My Lineups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lineups.map((lineup) => (
              <div
                key={lineup._id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-accent ${
                  selectedLineup?._id === lineup._id ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedLineup(lineup)}
              >
                <p className="font-medium">{lineup.teamName}</p>
                <p className="text-sm text-muted-foreground">
                  {lineup.sport} • {lineup.formation}
                </p>
              </div>
            ))}

            {lineups.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Layout className="mx-auto h-12 w-12 mb-2" />
                <p>No lineups yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lineup Designer Canvas */}
        <Card className="col-span-8">
          {selectedLineup ? (
            <>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedLineup.teamName}</CardTitle>
                    <CardDescription>
                      {selectedLineup.sport} • {selectedLineup.formation}
                    </CardDescription>
                  </div>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Field Canvas */}
                <div className="bg-green-600 rounded-lg aspect-[2/3] relative border-4 border-white">
                  {/* Field markings */}
                  <div className="absolute inset-0">
                    {/* Center circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full"></div>
                    
                    {/* Center line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white"></div>
                    
                    {/* Goal areas */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-white border-t-0"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-white border-b-0"></div>
                  </div>

                  {/* Players */}
                  {selectedLineup.players.map((player, idx) => (
                    <div
                      key={idx}
                      className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 cursor-move"
                      style={{
                        left: `${player.x || 50}%`,
                        top: `${player.y || 50}%`
                      }}
                    >
                      <div className="w-full h-full rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      {player.playerName && (
                        <p className="text-xs text-white text-center mt-1 bg-black bg-opacity-50 rounded px-1">
                          {player.playerName}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>Drag and drop players to position them on the field</p>
                  <p className="mt-2">Players: {selectedLineup.players.length}</p>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground py-12">
              Select a lineup to design
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
