import { Button } from "@/components/ui/button";
import { MapPin, Users, Clock, Bird } from "lucide-react";
import heroImage from "@/assets/hero-families.jpg";
import gaggleGoLogo from "@/assets/gaggle-go-logo.png";
import { MapPinIcon, GroupIcon, ClockIcon } from "@/components/icons/BrandIcons";

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12 animate-in fade-in duration-1000">
          {/* Logo and tagline */}
          <div className="space-y-8">
            <img 
              src={gaggleGoLogo} 
              alt="GaggleGO" 
              className="w-auto h-32 mx-auto drop-shadow-xl cursor-pointer transition-all duration-500 hover:scale-110 hover:rotate-3 hover:drop-shadow-[0_8px_24px_rgba(232,123,26,0.5)] animate-in fade-in duration-1000"
            />
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-accent">
                Don't just wing it. Get the Gaggle Going.
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Multi-family trip planning made simple. Smart scheduling, nap-time anchors, and dietary filters—all in one place.
          </p>

          {/* CTA */}
          <div className="space-y-4">
            <Button 
              variant="accent" 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-12 py-7 h-auto shadow-2xl hover:scale-105 transition-transform"
            >
              Start Planning Your Trip
            </Button>
          </div>

          {/* Quick features */}
          <div className="grid md:grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
            <div className="space-y-2">
              <MapPinIcon size={32} className="text-accent mx-auto" />
              <h3 className="font-bold text-lg">Location-First</h3>
              <p className="text-sm text-muted-foreground">Pick your destination, we'll handle the rest</p>
            </div>
            
            <div className="space-y-2">
              <ClockIcon size={32} className="text-accent mx-auto" />
              <h3 className="font-bold text-lg">Nap-Anchored</h3>
              <p className="text-sm text-muted-foreground">Schedule around your family's needs</p>
            </div>
            
            <div className="space-y-2">
              <GroupIcon size={32} className="text-accent mx-auto" />
              <h3 className="font-bold text-lg">Smart Groups</h3>
              <p className="text-sm text-muted-foreground">Coordinate multiple families with ease</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
