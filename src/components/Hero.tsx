import { Button } from "@/components/ui/button";
import { MapPin, Users, Clock, Bird } from "lucide-react";
import heroImage from "@/assets/hero-families.jpg";

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted -z-10" />
      
      {/* Hero image with overlay */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage} 
          alt="Families traveling together" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in duration-1000">
          {/* Main heading */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Bird className="w-10 h-10 md:w-12 md:h-12 text-primary animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  GaggleGO
                </span>
              </h1>
              <Bird className="w-10 h-10 md:w-12 md:h-12 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Flock together, travel smarter - for multi-family groups
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-sm border border-border">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-medium">Location-First Planning</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-sm border border-border">
              <Clock className="w-5 h-5 text-secondary" />
              <span className="font-medium">Nap-Time Anchored</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-sm border border-border">
              <Users className="w-5 h-5 text-accent" />
              <span className="font-medium">Constraint-Aware</span>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8 space-y-4">
            <Button 
              variant="hero" 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 py-6 h-auto rounded-2xl"
            >
              Get Your Gaggle Going
            </Button>
            <p className="text-sm text-muted-foreground">
              Keep your flock together - no more juggling schedules, dietary needs, and gift shop meltdowns
            </p>
          </div>

          {/* How it works */}
          <div className="pt-16 grid md:grid-cols-3 gap-8 text-left">
            <div className="space-y-3 p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">1. Set Your Destination</h3>
              <p className="text-muted-foreground">
                Tell us where you're going - theme park, city, or resort
              </p>
            </div>
            
            <div className="space-y-3 p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg">2. Gather Your Gaggle</h3>
              <p className="text-muted-foreground">
                Add families with their nap times, dietary needs, and preferences
              </p>
            </div>
            
            <div className="space-y-3 p-6 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">3. Get Your Timeline</h3>
              <p className="text-muted-foreground">
                Receive a constraint-aware itinerary with direct links to everything
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
