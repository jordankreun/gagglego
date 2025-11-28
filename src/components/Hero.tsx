import { Button } from "@/components/ui/button";
import { MapPin, Users, Clock, Bird } from "lucide-react";
import heroImage from "@/assets/hero-families.jpg";
import gooseMascot from "@/assets/goose-mascot.png";
import { MapPinIcon, GroupIcon, ClockIcon } from "@/components/icons/BrandIcons";

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-16 animate-in fade-in duration-1000">
          {/* Main heading */}
          <div className="space-y-8">
            <img 
              src={gooseMascot} 
              alt="GaggleGO" 
              className="w-32 h-32 mx-auto drop-shadow-xl hover-scale"
            />
            <div>
              <h1 className="text-7xl md:text-8xl font-display font-bold tracking-tight mb-4">
                <span className="text-primary">Gaggle</span>
                <span className="text-accent">GO</span>
              </h1>
              <p className="text-2xl md:text-3xl font-display text-muted-foreground">
                Flock together, travel smarter
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-full border-2 border-primary/20 shadow-lg backdrop-blur-sm">
              <MapPinIcon size={20} />
              <span className="font-semibold text-sm">Location-First</span>
            </div>
            <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-full border-2 border-accent/20 shadow-lg backdrop-blur-sm">
              <ClockIcon size={20} />
              <span className="font-semibold text-sm">Nap-Anchored</span>
            </div>
            <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-full border-2 border-secondary/20 shadow-lg backdrop-blur-sm">
              <GroupIcon size={20} />
              <span className="font-semibold text-sm">Smart Groups</span>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <Button 
              variant="accent" 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-10 py-6 h-auto shadow-2xl hover:scale-105 transition-transform"
            >
              Start Planning
            </Button>
            <p className="text-muted-foreground">
              Multi-family trip planning made simple
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-3 gap-6 pt-8">
            <div className="p-6 bg-card/50 rounded-2xl backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPinIcon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Set Location</h3>
              <p className="text-sm text-muted-foreground">Choose your destination</p>
            </div>
            
            <div className="p-6 bg-card/50 rounded-2xl backdrop-blur-sm border border-border/50 hover:border-accent/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <GroupIcon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Add Families</h3>
              <p className="text-sm text-muted-foreground">Configure preferences</p>
            </div>
            
            <div className="p-6 bg-card/50 rounded-2xl backdrop-blur-sm border border-border/50 hover:border-secondary/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <ClockIcon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Get Itinerary</h3>
              <p className="text-sm text-muted-foreground">Smart scheduling</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
