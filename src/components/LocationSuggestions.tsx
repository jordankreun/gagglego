import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Loader2, Navigation, Sparkles, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GooseStatusCard } from "@/components/GooseStatusCard";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";

interface LocationSuggestion {
  name: string;
  description: string;
  type: string;
  estimatedDistance: string;
}

interface LocationSuggestionsProps {
  onSelectLocation: (location: string) => void;
  onSetAsNest?: (address: string, coords?: { lat: number; lng: number }) => void;
}

interface LocationSuggestionsExtendedProps extends LocationSuggestionsProps {
  families?: any[];
  tripDate?: string;
}

export const LocationSuggestions = ({ onSelectLocation, onSetAsNest, families, tripDate }: LocationSuggestionsExtendedProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; city?: string } | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCoords, setSearchCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activityType, setActivityType] = useState<string>("all");
  const [setAsNest, setSetAsNest] = useState(false);

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

  const getSuggestions = async () => {
    setLoading(true);
    
    try {
      let requestBody: any = {
        families: families || [],
        tripDate: tripDate || new Date().toLocaleDateString(),
        activityType: activityType !== "all" ? activityType : undefined
      };

      // Use manual location if provided, otherwise use geolocation
      if (searchLocation && searchCoords) {
        requestBody.locationQuery = searchLocation;
        requestBody.latitude = searchCoords.lat;
        requestBody.longitude = searchCoords.lng;
      } else if (userLocation) {
        requestBody.latitude = userLocation.lat;
        requestBody.longitude = userLocation.lng;
        requestBody.cityName = userLocation.city;
      } else {
        toast({
          title: "Location required",
          description: "Please enter a location or use your current location.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('suggest-locations', {
        body: requestBody
      });

      if (error) throw error;

      if (data?.suggestions && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions);
        toast({
          title: "Suggestions found!",
          description: `Found ${data.suggestions.length} family-friendly locations.`,
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
        setSearchLocation("");
        setSearchCoords(null);
        
        toast({
          title: "Location found!",
          description: cityName ? `Using ${cityName}` : "Using your current location",
        });
        setLoading(false);
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

  const activityTypes = [
    { value: "all", label: "All Types" },
    { value: "theme_park", label: "Theme Parks" },
    { value: "zoo_aquarium", label: "Zoos & Aquariums" },
    { value: "museum", label: "Museums" },
    { value: "nature_park", label: "Nature Parks" },
    { value: "beach", label: "Beaches" },
    { value: "playground", label: "Playgrounds" },
    { value: "cultural_site", label: "Cultural Sites" }
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Location & Activity Type Input */}
      <Card className="p-4 sm:p-5 border-2 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="location-input" className="text-sm font-semibold">
            Where are you exploring?
          </Label>
          <div className="flex gap-2">
            <AddressAutocomplete
              value={searchLocation}
              onChange={(address, coords) => {
                setSearchLocation(address);
                setSearchCoords(coords || null);
                setUserLocation(null);
              }}
              placeholder="Enter a city or address..."
              className="flex-1"
            />
            <Button
              onClick={getCurrentLocation}
              variant="outline"
              disabled={loading}
              className="flex-shrink-0 gap-2"
            >
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">Near Me</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">
            What kind of activities?
          </Label>
          <div className="flex flex-wrap gap-2">
            {activityTypes.map((type) => (
              <Badge
                key={type.value}
                variant={activityType === type.value ? "default" : "outline"}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  activityType === type.value 
                    ? "bg-accent text-accent-foreground border-accent" 
                    : "hover:bg-accent/10"
                }`}
                onClick={() => setActivityType(type.value)}
              >
                {type.label}
              </Badge>
            ))}
          </div>
        </div>

        {onSetAsNest && (
          <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
            <Checkbox
              id="set-as-nest"
              checked={setAsNest}
              onCheckedChange={(checked) => setSetAsNest(checked === true)}
            />
            <Label htmlFor="set-as-nest" className="text-sm flex items-center gap-2 cursor-pointer">
              <Home className="w-4 h-4 text-primary" />
              Also set this as my Nest (home base)
            </Label>
          </div>
        )}

        <Button
          onClick={getSuggestions}
          disabled={loading || (!searchLocation && !userLocation)}
          variant="hero"
          size="lg"
          className="w-full gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Finding suggestions...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Get AI Suggestions
            </>
          )}
        </Button>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <GooseStatusCard
            title="Finding Nearby Adventures"
            estimatedSeconds={8}
            messages={[
              "Getting your location...",
              "Finding family-friendly spots...",
              "Checking age-appropriateness...",
              "Ready to explore!"
            ]}
          />
        </div>
      ) : suggestions.length > 0 ? (
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
                onClick={() => {
                  onSelectLocation(suggestion.name);
                  if (setAsNest && onSetAsNest) {
                    onSetAsNest(searchLocation || userLocation?.city || suggestion.name, searchCoords || (userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : undefined));
                  }
                }}
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
      ) : null}
    </div>
  );
};