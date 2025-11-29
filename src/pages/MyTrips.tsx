import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Users, Trash2, ExternalLink, Edit2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatedGoose } from "@/components/AnimatedGoose";

interface Trip {
  id: string;
  name: string;
  location: string;
  date: string;
  start_date?: string;
  end_date?: string;
  trip_duration_days?: number;
  families: any;
  itinerary: any;
  progress: any;
  settings: any;
  share_code?: string;
  created_at: string;
  user_id?: string;
  role?: string; // For collaborative trips
}

export default function MyTrips() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      // Fetch owned trips
      const { data: ownedTrips, error: ownedError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user?.id);

      if (ownedError) throw ownedError;

      // Fetch collaborative trips
      const { data: collabData, error: collabError } = await supabase
        .from('trip_collaborators')
        .select(`
          role,
          trips (*)
        `)
        .eq('user_id', user?.id);

      if (collabError) throw collabError;

      // Combine and format trips
      const owned = (ownedTrips || []).map(trip => ({ ...trip, role: 'owner' }));
      const collaborative = (collabData || [])
        .filter(c => c.trips)
        .map(c => ({ ...(c.trips as any), role: c.role }));

      const allTrips = [...owned, ...collaborative].sort((a, b) => {
        const dateA = a.start_date || a.created_at;
        const dateB = b.start_date || b.created_at;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

      setTrips(allTrips);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast({
        title: "Failed to load trips",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTrips(trips.filter(t => t.id !== id));
      toast({
        title: "Trip deleted",
        description: "Your migration has been removed",
      });
    } catch (error) {
      console.error('Error deleting trip:', error);
      toast({
        title: "Delete failed",
        description: "Could not delete trip",
        variant: "destructive",
      });
    }
  };

  const startRename = (trip: Trip) => {
    setEditingId(trip.id);
    setEditName(trip.name);
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditName("");
  };

  const saveRename = async (id: string) => {
    if (!editName.trim()) {
      toast({
        title: "Name required",
        description: "Trip name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('trips')
        .update({ name: editName.trim() })
        .eq('id', id);

      if (error) throw error;

      setTrips(trips.map(t => t.id === id ? { ...t, name: editName.trim() } : t));
      setEditingId(null);
      setEditName("");
      toast({
        title: "Trip renamed",
        description: "Your migration has been updated",
      });
    } catch (error) {
      console.error('Error renaming trip:', error);
      toast({
        title: "Rename failed",
        description: "Could not update trip name",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="container max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground">Loading your migrations...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-12 px-4">
      <div className="container max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-display font-bold">My Migrations 🦆</h1>
          <p className="text-muted-foreground">Your saved family adventures</p>
        </div>

        {trips.length === 0 ? (
          <Card className="p-12 text-center space-y-6">
            <div className="flex justify-center">
              <div style={{ width: 120, height: 120 }}>
                <AnimatedGoose enableConstantAnimation={false} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold">Ready to Fly?</h3>
              <p className="text-muted-foreground">No migrations saved yet. Start planning your first family adventure!</p>
            </div>
            <Button onClick={() => navigate('/plan')} variant="hero" size="lg">
              Plan Your First Trip
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {trips.map((trip) => {
              const completedCount = trip.progress?.completed?.length || 0;
              const totalCount = Array.isArray(trip.itinerary) ? trip.itinerary.length : 0;
              const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

              return (
                <Card key={trip.id} className="p-5 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {editingId === trip.id ? (
                        <div className="flex items-center gap-2 mb-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="font-semibold text-xl"
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => saveRename(trip.id)}
                          >
                            <Check className="w-4 h-4 text-primary" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={cancelRename}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-xl">{trip.name}</h3>
                          {trip.role === 'owner' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => startRename(trip)}
                              className="h-8 w-8"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          )}
                          <Badge 
                            variant={trip.role === 'owner' ? 'default' : trip.role === 'editor' ? 'secondary' : 'outline'} 
                            className={trip.role === 'owner' ? 'ml-auto bg-accent text-accent-foreground' : trip.role === 'editor' ? 'ml-auto bg-accent/50 text-accent-foreground' : 'ml-auto'}
                          >
                            {trip.role === 'owner' ? 'Owner' : trip.role === 'editor' ? 'Editor' : 'Viewer'}
                          </Badge>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {trip.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {trip.start_date && trip.end_date ? (
                            `${new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                          ) : trip.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {Array.isArray(trip.families) ? trip.families.length : 0} {Array.isArray(trip.families) && trip.families.length === 1 ? 'family' : 'families'}
                        </div>
                      </div>
                      {trip.trip_duration_days && (
                        <Badge variant="secondary" className="mb-2">
                          {trip.trip_duration_days === 1 ? 'Day trip' : `${trip.trip_duration_days}-day trip`}
                        </Badge>
                      )}
                    </div>
                    
                    {trip.role === 'owner' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTrip(trip.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <Badge variant="secondary">
                        {completedCount}/{totalCount} activities
                      </Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate('/plan', { state: { loadTrip: trip } })}
                    variant="outline"
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Trip
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}