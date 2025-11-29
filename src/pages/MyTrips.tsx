import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Trip {
  id: string;
  name: string;
  location: string;
  date: string;
  families: any;
  itinerary: any;
  progress: any;
  created_at: string;
}

export default function MyTrips() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data as any || []);
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
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No trips yet! Time to start planning.</p>
            <Button onClick={() => navigate('/plan')} variant="hero">
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
                      <h3 className="font-semibold text-xl mb-2">{trip.name}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {trip.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {trip.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {Array.isArray(trip.families) ? trip.families.length : 0} {Array.isArray(trip.families) && trip.families.length === 1 ? 'family' : 'families'}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTrip(trip.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
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