import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Loader2, Navigation, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface LocationSuggestion {
  name: string;
  description: string;
  type: string;
  estimatedDistance: string;
}

interface LocationSuggestionsProps {
  onSelectLocation: (location: string) => void;
}

export const LocationSuggestions = ({ onSelectLocation }: LocationSuggestionsProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; city?: string } | null>(null);

  const getLocationName = async (lat: number, lng: number): Promise<string | null> => {
    try {
      // Use OpenStreetMap's Nominatim for reverse geocoding (free, no API key needed)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
        {
          headers: {
            'User-Agent': 'GaggleGO/1.0'
          }
        }
      );
      const data = await response.json();
      return data.address?.city || data.address?.town || data.address?.village || data.address?.county || null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const getCurrentLocation = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location not available",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Get city name
        const cityName = await getLocationName(latitude, longitude);
        
        setUserLocation({ lat: latitude, lng: longitude, city: cityName || undefined });
        
        // Call edge function to get suggestions
        try {
          const { data, error } = await supabase.functions.invoke('suggest-locations', {
            body: { 
              latitude, 
              longitude,
              cityName 
            }
          });

          if (error) throw error;

          if (data?.suggestions && Array.isArray(data.suggestions)) {
            setSuggestions(data.suggestions);
            toast({
              title: "Suggestions found!",
              description: `Found ${data.suggestions.length} family-friendly locations near you.`,
            });
          } else {
            throw new Error("Invalid response format");
          }
        } catch (error: any) {
          console.error("Error fetching suggestions:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to fetch location suggestions.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location access denied",
          description: "Please allow location access to get nearby suggestions.",
          variant: "destructive",
        });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "theme_park":
        return "bg-accent/10 text-accent border-accent/20";
      case "zoo_aquarium":
        return "bg-primary/10 text-primary border-primary/20";
      case "museum":
        return "bg-secondary/10 text-secondary border-secondary/20";
      case "nature_park":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      case "cultural_site":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-4">
      {!suggestions.length ? (
        <Card className="p-6 text-center space-y-4 border-2 border-dashed">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Navigation className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Need Destination Ideas?</h3>
            <p className="text-sm text-muted-foreground">
              Let us suggest family-friendly locations near you
            </p>
          </div>
          <Button
            onClick={getCurrentLocation}
            disabled={loading}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finding locations...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Get Suggestions
              </>
            )}
          </Button>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">
                Near {userLocation?.city || "Your Location"}
              </h3>
            </div>
            <Button
              onClick={getCurrentLocation}
              disabled={loading}
              variant="ghost"
              size="sm"
            >
              Refresh
            </Button>
          </div>

          <div className="grid gap-3">
            {suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className="p-4 hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => onSelectLocation(suggestion.name)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold flex-1">{suggestion.name}</h4>
                    <Badge variant="secondary" className={`text-xs ${getTypeColor(suggestion.type)}`}>
                      {formatType(suggestion.type)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {suggestion.estimatedDistance}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};