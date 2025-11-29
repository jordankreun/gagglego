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
        <div className="max-w-3xl mx-auto text-center space-y-16 animate-in fade-in duration-1000">
          {/* Logo and tagline */}
          <div className="space-y-8">
            <img 
              src={gaggleGoLogo} 
              alt="GaggleGO" 
              className="w-auto h-40 mx-auto drop-shadow-xl cursor-pointer transition-all duration-500 hover:scale-110 hover:rotate-3 hover:drop-shadow-[0_8px_24px_rgba(232,123,26,0.5)]"
            />
            <h1 className="text-4xl md:text-5xl font-display font-bold text-accent">
              Don't just wing it. Get the Gaggle Going.
            </h1>
          </div>

          {/* CTA */}
          <Button 
            variant="accent" 
            size="lg" 
            onClick={onGetStarted}
            className="text-xl px-14 py-8 h-auto shadow-2xl hover:scale-105 transition-transform"
          >
            Start Planning
          </Button>

          {/* Simple feature tags */}
          <div className="flex flex-wrap justify-center gap-3 pt-8">
            <div className="flex items-center gap-2 bg-card/50 px-5 py-2.5 rounded-2xl border border-accent/20 backdrop-blur-sm">
              <MapPinIcon size={18} className="text-accent" />
              <span className="text-sm font-semibold">Location-First</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 px-5 py-2.5 rounded-2xl border border-accent/20 backdrop-blur-sm">
              <ClockIcon size={18} className="text-accent" />
              <span className="text-sm font-semibold">Nap-Anchored</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 px-5 py-2.5 rounded-2xl border border-accent/20 backdrop-blur-sm">
              <GroupIcon size={18} className="text-accent" />
              <span className="text-sm font-semibold">Multi-Family</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
