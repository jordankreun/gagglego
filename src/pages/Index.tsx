import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { Hero } from "@/components/Hero";
import { TripSetup } from "@/components/TripSetup";
import { ItineraryView } from "@/components/ItineraryView";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type ViewState = "hero" | "setup" | "itinerary";

interface Member {
  id: string;
  name: string;
  type: "adult" | "kid";
  age?: number;
  napTime?: string;
}

interface TripData {
  location: string;
  families: Array<{
    id: string;
    name: string;
    dietary: string[];
    members: Member[];
  }>;
  noGiftShop: boolean;
  dateRange?: DateRange;
}

const Index = () => {
  const [view, setView] = useState<ViewState>("hero");
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [itineraryItems, setItineraryItems] = useState<any[]>([]);
  const [tripId, setTripId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Load trip from navigation state (when opening from My Trips)
  useEffect(() => {
    const loadTrip = location.state?.loadTrip;
    if (loadTrip) {
      setTripId(loadTrip.id);
      setTripData({
        location: loadTrip.location,
        families: loadTrip.families,
        noGiftShop: loadTrip.settings?.noGiftShop || false,
        dateRange: loadTrip.start_date ? {
          from: new Date(loadTrip.start_date),
          to: loadTrip.end_date ? new Date(loadTrip.end_date) : new Date(loadTrip.start_date)
        } : undefined
      });
      setItineraryItems(loadTrip.itinerary || []);
      setView("itinerary");
    }
  }, [location.state]);

  const handleGetStarted = () => {
    setView("setup");
  };

  const handleSetupComplete = async (data: any, items: any[]) => {
    setTripData(data);
    setItineraryItems(items);
    setView("itinerary");
    
    // Auto-save trip to database
    if (user && data.dateRange?.from) {
      try {
        const durationDays = data.dateRange.to 
          ? Math.ceil((data.dateRange.to.getTime() - data.dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1
          : 1;

        const { data: trip, error } = await supabase
          .from('trips')
          .insert([{
            user_id: user.id,
            name: `${data.location} Trip`,
            location: data.location,
            start_date: data.dateRange.from.toISOString().split('T')[0],
            end_date: (data.dateRange.to || data.dateRange.from).toISOString().split('T')[0],
            trip_duration_days: durationDays,
            date: data.dateRange.from.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            families: data.families as any,
            itinerary: items as any,
            settings: { 
              noGiftShop: data.noGiftShop,
              nestConfig: data.nestConfig,
              mealPreferences: data.mealPreferences
            },
            progress: { completed: [] }
          }])
          .select()
          .single();

        if (error) throw error;
        
        setTripId(trip.id);
        toast({
          title: "Trip saved!",
          description: `Your ${durationDays}-day itinerary has been saved`,
        });
      } catch (error) {
        console.error('Error saving trip:', error);
        toast({
          title: "Save failed",
          description: "Couldn't auto-save your trip",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    setView("setup");
  };

  return (
    <main className="flex-1 bg-background">
      {view === "hero" && <Hero onGetStarted={handleGetStarted} />}
      
      {view === "setup" && <TripSetup onComplete={handleSetupComplete} />}
      
      {view === "itinerary" && tripData && (
        <ItineraryView
          location={tripData.location}
          date={tripData.dateRange?.from 
            ? tripData.dateRange.from.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
          }
          dateRange={tripData.dateRange}
          items={itineraryItems}
          onBack={handleBack}
          tripId={tripId}
        />
      )}
    </main>
  );
};

export default Index;
