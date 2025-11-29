import { useState } from "react";
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
}

const Index = () => {
  const [view, setView] = useState<ViewState>("hero");
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [itineraryItems, setItineraryItems] = useState<any[]>([]);
  const [tripId, setTripId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGetStarted = () => {
    setView("setup");
  };

  const handleSetupComplete = async (data: TripData, items: any[]) => {
    setTripData(data);
    setItineraryItems(items);
    setView("itinerary");
    
    // Auto-save trip to database
    if (user) {
      try {
        const { data: trip, error } = await supabase
          .from('trips')
          .insert([{
            user_id: user.id,
            name: `${data.location} Trip`,
            location: data.location,
            date: new Date().toISOString(),
            families: data.families as any,
            itinerary: items as any,
            settings: { noGiftShop: data.noGiftShop },
            progress: { completed: [] }
          }])
          .select()
          .single();

        if (error) throw error;
        
        setTripId(trip.id);
        toast({
          title: "Trip saved!",
          description: "Your itinerary has been automatically saved",
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
          date={new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          items={itineraryItems}
          onBack={handleBack}
          tripId={tripId}
        />
      )}
    </main>
  );
};

export default Index;
