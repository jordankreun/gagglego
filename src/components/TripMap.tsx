import { APIProvider, Map, Marker, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/config/maps";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { MapPin, Navigation } from "lucide-react";

interface Activity {
  id?: string;
  time: string;
  title: string;
  description: string;
  duration?: string;
  type?: string;
  day?: number;
}

interface TripMapProps {
  activities: Activity[];
  location: string;
}

const MapContent = ({ activities, location }: TripMapProps) => {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");
  const geocodingLibrary = useMapsLibrary("geocoding");
  const [activityLocations, setActivityLocations] = useState<Array<{ lat: number; lng: number; title: string }>>([]);
  const [routePath, setRoutePath] = useState<google.maps.LatLng[]>([]);
  const [totalDistance, setTotalDistance] = useState<string>("");
  const [totalDuration, setTotalDuration] = useState<string>("");

  useEffect(() => {
    if (!geocodingLibrary || !routesLibrary) return;

    const geocoder = new geocodingLibrary.Geocoder();
    const directionsService = new routesLibrary.DirectionsService();

    // Geocode each activity
    const geocodeActivities = async () => {
      const locations: Array<{ lat: number; lng: number; title: string }> = [];
      
      for (const activity of activities) {
        try {
          const result = await geocoder.geocode({
            address: `${activity.title}, ${location}`,
          });
          
          if (result.results[0]) {
            const { lat, lng } = result.results[0].geometry.location;
            locations.push({
              lat: lat(),
              lng: lng(),
              title: activity.title,
            });
          }
        } catch (error) {
          console.error(`Failed to geocode ${activity.title}:`, error);
        }
      }

      setActivityLocations(locations);

      // Calculate route if we have multiple locations
      if (locations.length > 1) {
        const waypoints = locations.slice(1, -1).map((loc) => ({
          location: new google.maps.LatLng(loc.lat, loc.lng),
          stopover: true,
        }));

        try {
          const result = await directionsService.route({
            origin: new google.maps.LatLng(locations[0].lat, locations[0].lng),
            destination: new google.maps.LatLng(locations[locations.length - 1].lat, locations[locations.length - 1].lng),
            waypoints,
            travelMode: google.maps.TravelMode.DRIVING,
          });

          if (result.routes[0]) {
            const path = result.routes[0].overview_path;
            setRoutePath(path);

            // Calculate total distance and duration
            let distance = 0;
            let duration = 0;
            result.routes[0].legs.forEach((leg) => {
              distance += leg.distance?.value || 0;
              duration += leg.duration?.value || 0;
            });

            setTotalDistance(`${(distance / 1609.34).toFixed(1)} mi`);
            setTotalDuration(`${Math.round(duration / 60)} min`);
          }
        } catch (error) {
          console.error("Failed to calculate route:", error);
        }
      }

      // Fit map bounds to show all markers
      if (map && locations.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        locations.forEach((loc) => {
          bounds.extend(new google.maps.LatLng(loc.lat, loc.lng));
        });
        map.fitBounds(bounds);
      }
    };

    geocodeActivities();
  }, [activities, location, geocodingLibrary, routesLibrary, map]);

  // Draw route on map
  useEffect(() => {
    if (!map || routePath.length === 0) return;

    const polyline = new google.maps.Polyline({
      path: routePath,
      geodesic: true,
      strokeColor: "#EA580C",
      strokeOpacity: 0.8,
      strokeWeight: 4,
    });

    polyline.setMap(map);

    return () => {
      polyline.setMap(null);
    };
  }, [map, routePath]);

  return (
    <>
      <Map
        defaultZoom={12}
        defaultCenter={{ lat: 0, lng: 0 }}
        gestureHandling="greedy"
        disableDefaultUI={false}
        mapId="gaggle-go-map"
        className="w-full h-full"
      >
        {activityLocations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            title={location.title}
            label={{
              text: `${index + 1}`,
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          />
        ))}
      </Map>

      {totalDistance && totalDuration && (
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="p-3 bg-background/95 backdrop-blur shadow-lg">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{totalDistance}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Navigation className="h-4 w-4 text-primary" />
                <span className="font-medium">{totalDuration}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export const TripMap = ({ activities, location }: TripMapProps) => {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="relative w-full h-[500px] rounded-xl overflow-hidden border border-border">
        <MapContent activities={activities} location={location} />
      </div>
    </APIProvider>
  );
};
