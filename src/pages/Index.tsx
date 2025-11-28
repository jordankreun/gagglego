import { useState } from "react";
import { Hero } from "@/components/Hero";
import { TripSetup } from "@/components/TripSetup";
import { ItineraryView } from "@/components/ItineraryView";

type ViewState = "hero" | "setup" | "itinerary";

interface TripData {
  location: string;
  families: Array<{
    id: string;
    name: string;
    napTime: string;
    dietary: string[];
    members: number;
  }>;
  noGiftShop: boolean;
}

const Index = () => {
  const [view, setView] = useState<ViewState>("hero");
  const [tripData, setTripData] = useState<TripData | null>(null);

  const handleGetStarted = () => {
    setView("setup");
  };

  const handleSetupComplete = (data: TripData) => {
    setTripData(data);
    setView("itinerary");
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
          items={[]} // Will use mock data from component
          onBack={handleBack}
        />
      )}
    </main>
  );
};

export default Index;
