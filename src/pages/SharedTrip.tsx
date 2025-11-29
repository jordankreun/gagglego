import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import gaggleGoLogo from "@/assets/gaggle-go-logo.png";

interface Trip {
  name: string;
  location: string;
  date: string;
  itinerary: any;
}

export default function SharedTrip() {
  const { shareCode } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (shareCode) {
      fetchSharedTrip();
    }
  }, [shareCode]);

  const fetchSharedTrip = async () => {
    try {
      const { data, error} = await supabase
        .from('trips')
        .select('name, location, date, itinerary')
        .eq('share_code', shareCode)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      setTrip(data as any);
    } catch (error) {
      console.error('Error fetching shared trip:', error);
      toast({
        title: "Trip not found",
        description: "This link may be invalid or expired",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <p className="text-muted-foreground">Loading trip...</p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Trip Not Found</h2>
          <p className="text-muted-foreground mb-4">This shared trip doesn't exist or has been removed</p>
          <Button onClick={() => navigate('/')} variant="hero">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <section className="min-h-screen py-12 px-4">
      {/* Header */}
      <div className="container max-w-4xl mx-auto mb-8">
        <img src={gaggleGoLogo} alt="GaggleGO" className="h-12 w-auto object-contain mb-4" />
        <Badge variant="secondary" className="mb-4">Shared Trip</Badge>
      </div>

      <div className="container max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-display font-bold">{trip.location}</h1>
          </div>
          <p className="text-muted-foreground">{trip.date}</p>
        </div>

        {/* Itinerary */}
        <div className="space-y-3">
          {Array.isArray(trip.itinerary) && trip.itinerary.map((item: any, index: number) => (
            <Card key={index} className="p-4 border-l-2 border-l-primary/30">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.time}
                      </Badge>
                      <Badge className="text-xs bg-primary/10 text-primary">
                        {item.type}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                  </div>
                  
                  {item.link && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={item.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">{item.description}</p>

                {item.constraints && item.constraints.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.constraints.map((constraint: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {constraint}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Footer CTA */}
        <Card className="p-6 bg-primary/5 border-primary/20 text-center">
          <h3 className="font-display font-bold text-xl mb-2">Want to create your own?</h3>
          <p className="text-muted-foreground mb-4">Plan your perfect family adventure with GaggleGO</p>
          <Button onClick={() => navigate('/')} variant="hero">
            Start Planning
          </Button>
        </Card>
      </div>
    </section>
  );
}