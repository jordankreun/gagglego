import { Button } from "@/components/ui/button";
import { MapPin, Users, Clock, Bird } from "lucide-react";
import heroImage from "@/assets/hero-families.jpg";
import gaggleGoLogo from "@/assets/gaggle-go-logo.png";
import { MapPinIcon, GroupIcon, ClockIcon } from "@/components/icons/BrandIcons";
import { AnimatedGoose } from "./AnimatedGoose";

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="container mx-auto py-12 md:py-20 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-8 md:space-y-12 animate-in fade-in duration-1000">
          {/* Animated Goose */}
          <div className="flex justify-center">
            <AnimatedGoose size="xl" state="excited" />
          </div>

          {/* Logo and tagline */}
          <div className="space-y-4 md:space-y-6">
            <img 
              src={gaggleGoLogo} 
              alt="GaggleGO" 
              className="h-20 sm:h-24 md:h-28 w-auto mx-auto drop-shadow-xl object-contain"
            />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-accent px-4">
              Don't just wing it. Get the Gaggle Going.
            </h1>
          </div>

          {/* CTA */}
          <Button 
            variant="accent" 
            size="lg" 
            onClick={onGetStarted}
            className="text-base sm:text-lg md:text-xl px-8 sm:px-10 md:px-14 py-5 sm:py-6 md:py-8 h-auto shadow-2xl hover:scale-105 transition-transform w-full sm:w-auto"
          >
            Start Planning
          </Button>

          {/* Simple feature tags */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-4 md:pt-8 px-4">
            <div className="flex items-center gap-2 bg-card/50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl border border-accent/20 backdrop-blur-sm">
              <MapPinIcon size={16} className="text-accent sm:w-[18px] sm:h-[18px]" />
              <span className="text-xs sm:text-sm font-semibold">Location-First</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl border border-accent/20 backdrop-blur-sm">
              <ClockIcon size={16} className="text-accent sm:w-[18px] sm:h-[18px]" />
              <span className="text-xs sm:text-sm font-semibold">Nap-Anchored</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl border border-accent/20 backdrop-blur-sm">
              <GroupIcon size={16} className="text-accent sm:w-[18px] sm:h-[18px]" />
              <span className="text-xs sm:text-sm font-semibold">Multi-Family</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
