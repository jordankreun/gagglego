import { Button } from "@/components/ui/button";
import { MapPin, Users, Clock, Bird } from "lucide-react";
import heroImage from "@/assets/hero-families.jpg";
import gooseMascot from "@/assets/goose-mascot.png";

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted">
      {/* Hero image with overlay */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src={heroImage} 
          alt="Families traveling together" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-12 animate-in fade-in duration-1000">
          {/* Main heading with mascot */}
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center">
              <img 
                src={gooseMascot} 
                alt="GaggleGO goose mascot" 
                className="w-32 h-32 md:w-40 md:h-40 mb-6 hover-scale drop-shadow-lg"
              />
              <div className="flex items-center justify-center gap-3 mb-4">
                <Bird className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse" />
                <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight">
                  <span className="text-primary">Gaggle</span>
                  <span className="text-accent">GO</span>
                </h1>
                <Bird className="w-8 h-8 md:w-10 md:h-10 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-display font-semibold text-muted-foreground max-w-3xl mx-auto">
              Flock together, travel smarter
            </p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Multi-family trip planning made simple
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-3 bg-primary/10 px-8 py-4 rounded-full shadow-sm border-2 border-primary/20 backdrop-blur-sm">
              <MapPin className="w-6 h-6 text-primary" />
              <span className="font-semibold text-primary">Location-First</span>
            </div>
            <div className="flex items-center gap-3 bg-secondary/10 px-8 py-4 rounded-full shadow-sm border-2 border-secondary/20 backdrop-blur-sm">
              <Clock className="w-6 h-6 text-secondary" />
              <span className="font-semibold text-secondary">Nap-Anchored</span>
            </div>
            <div className="flex items-center gap-3 bg-accent/10 px-8 py-4 rounded-full shadow-sm border-2 border-accent/20 backdrop-blur-sm">
              <Users className="w-6 h-6 text-accent-foreground" />
              <span className="font-semibold text-accent-foreground">Smart Groups</span>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8 space-y-6">
            <Button 
              variant="accent" 
              size="lg" 
              onClick={onGetStarted}
              className="text-xl px-12 py-8 h-auto shadow-xl hover:shadow-2xl"
            >
              Join GaggleGO
            </Button>
            <p className="text-base text-muted-foreground font-medium">
              Keep your flock together - coordinate schedules, diets, and logistics
            </p>
          </div>

          {/* How it works */}
          <div className="pt-20 grid md:grid-cols-3 gap-8">
            <div className="space-y-4 p-8 bg-card rounded-3xl border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl">Plan Trip</h3>
              <p className="text-muted-foreground leading-relaxed">
                Set your destination - theme park, city, or resort
              </p>
            </div>
            
            <div className="space-y-4 p-8 bg-card rounded-3xl border-2 border-accent/10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="font-display font-bold text-xl">View Map</h3>
              <p className="text-muted-foreground leading-relaxed">
                Add families with nap times, dietary needs, and preferences
              </p>
            </div>
            
            <div className="space-y-4 p-8 bg-card rounded-3xl border-2 border-secondary/10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="w-16 h-16 rounded-full bg-secondary/15 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-display font-bold text-xl">Life View</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get a timeline with smart scheduling and direct links
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
