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

interface LocationSuggestionsExtendedProps extends LocationSuggestionsProps {
  families?: any[];
  tripDate?: string;
}

export const LocationSuggestions = ({ onSelectLocation, families, tripDate }: LocationSuggestionsExtendedProps) => {
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
        
        // Call edge function to get suggestions with context
        try {
          const { data, error } = await supabase.functions.invoke('suggest-locations', {
            body: { 
              latitude, 
              longitude,
              cityName,
              families: families || [],
              tripDate: tripDate || new Date().toLocaleDateString()
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
    <div className="space-y-3 sm:space-y-4">
      {!suggestions.length ? (
        <Card className="p-4 sm:p-5 md:p-6 text-center space-y-3 sm:space-y-4 border-2 border-dashed bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex justify-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h3 className="font-semibold text-base sm:text-lg">Discover Nearby Adventures</h3>
            <p className="text-xs sm:text-sm text-muted-foreground px-2">
              AI-powered suggestions tailored for your flock
            </p>
          </div>
          <Button
            onClick={getCurrentLocation}
            disabled={loading}
            variant="hero"
            size="lg"
            className="gap-2 h-10 sm:h-11 text-sm sm:text-base"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Finding perfect spots...</span>
                <span className="sm:hidden">Finding...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Get AI Suggestions</span>
                <span className="sm:hidden">Get Suggestions</span>
              </>
            )}
          </Button>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-sm sm:text-base truncate">
                Near {userLocation?.city || "Your Location"}
              </h3>
            </div>
            <Button
              onClick={getCurrentLocation}
              disabled={loading}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 h-8 px-2 sm:px-3"
            >
              <span className="text-xs sm:text-sm">Refresh</span>
            </Button>
          </div>

          <div className="grid gap-2 sm:gap-3">
            {suggestions.map((suggestion, index) => (
              <Card
                key={index}
                className="p-3 sm:p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] group"
                onClick={() => onSelectLocation(suggestion.name)}
              >
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm sm:text-base flex-1 break-words group-hover:text-primary transition-colors">
                      {suggestion.name}
                    </h4>
                    <Badge variant="secondary" className={`text-[10px] sm:text-xs flex-shrink-0 ${getTypeColor(suggestion.type)}`}>
                      {formatType(suggestion.type)}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {suggestion.description}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span>{suggestion.estimatedDistance}</span>
                    </div>
                    <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Select →
                    </span>
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