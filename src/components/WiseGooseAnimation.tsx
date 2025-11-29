import { useEffect, useState } from "react";
import wiseGoose from "@/assets/wise-goose-sage.png";

export const WiseGooseAnimation = () => {
  const [isFloating, setIsFloating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFloating(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Glowing aura */}
      <div className="absolute inset-0 bg-gradient-radial from-accent/20 via-primary/10 to-transparent animate-pulse" />
      
      {/* Wise goose with floating animation */}
      <div
        className={`relative transition-transform duration-2000 ease-in-out ${
          isFloating ? "translate-y-[-8px]" : "translate-y-[8px]"
        }`}
      >
        <img
          src={wiseGoose}
          alt="Wise Goose AI Sage"
          className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-2xl"
        />
        
        {/* Sparkle effects */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-accent rounded-full animate-ping" />
        <div className="absolute bottom-4 left-2 w-2 h-2 bg-primary rounded-full animate-ping delay-700" />
        <div className="absolute top-8 left-0 w-2 h-2 bg-accent/60 rounded-full animate-ping delay-1000" />
      </div>
    </div>
  );
};
