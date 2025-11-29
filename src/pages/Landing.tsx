import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Users, 
  Clock, 
  Sparkles, 
  Utensils,
  ShoppingBag,
  Calendar,
  Heart,
  ArrowRight,
  Check
} from "lucide-react";
import heroImage from "@/assets/hero-families.jpg";
import { WiseGooseAnimation } from "@/components/WiseGooseAnimation";
import { AnimatedGoose } from "@/components/AnimatedGoose";
import { GaggleGoWordmark } from "@/components/GaggleGoWordmark";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 md:space-y-12 animate-fade-in-subtle">
            {/* Animated Goose */}
            <div className="flex justify-center">
              <AnimatedGoose size="xl" />
            </div>
            
            {/* Logo */}
            <GaggleGoWordmark size="xl" className="drop-shadow-2xl" />
            
            {/* Headline */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
                Keep Your Flock Together,
                <br />
                <span className="text-accent">Navigate Like a Pro</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                Stop juggling nap times, dietary restrictions, and gift shop detours. 
                Let AI chart a flight plan that actually works for your gaggle.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button 
                variant="hero" 
                size="lg" 
                asChild
                className="text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-7 h-auto shadow-2xl hover:scale-105 transition-transform"
              >
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                asChild
                className="text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-7 h-auto border-2 hover:bg-accent/10"
              >
                <a href="#how-it-works">
                  See How It Works
                </a>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent" />
                <span>Free forever</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Problem Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4 bg-gradient-to-b from-background to-muted/20">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12 md:mb-16">
            <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1">
              The Problem
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">
              Family travel shouldn't feel like wrangling a wild gaggle
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Coordinating multiple families means juggling nap schedules, dietary needs, 
              and everyone's different energy levels. Sound familiar?
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="p-5 sm:p-6 space-y-3 border-2 hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Nap Time Chaos</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                One kid naps at 1pm, another at 2:30pm. Your itinerary just collapsed.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 space-y-3 border-2 hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Dietary Minefield</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Gluten-free, halal, and "plain chicken nuggets only" walk into a restaurant...
              </p>
            </Card>

            <Card className="p-5 sm:p-6 space-y-3 border-2 hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Tourist Trap Hell</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Every path leads through the gift shop. The kids are melting down. Again.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 sm:py-16 md:py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12 md:mb-16">
            <Badge variant="default" className="text-xs sm:text-sm px-3 py-1">
              The Solution
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">
              AI co-pilot that actually gets it
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Fly in formation with constraint-solving AI that plans around what actually matters
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="p-5 sm:p-6 space-y-3 border-2 hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Nap-Anchored Scheduling</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Tell us when each kid naps. We hard-lock those times and build everything else around them.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 space-y-3 border-2 hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Dietary Intersection Filtering</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Only suggests restaurants that work for ALL your families' dietary needs simultaneously.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 space-y-3 border-2 hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Gift Shop Avoidance</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Toggle to minimize routes through high-commercial zones. Your wallet will thank you.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 space-y-3 border-2 hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-base sm:text-lg">Multi-Family Coordination</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Add unlimited families with their own needs. We optimize for the whole gaggle.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-16 md:py-24 px-4 bg-gradient-to-b from-muted/20 to-background">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12 md:mb-16">
            <Badge variant="outline" className="text-xs sm:text-sm px-3 py-1">
              How It Works
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">
              Three steps to smooth sailing (or flying)
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="p-6 sm:p-8 text-center space-y-4 border-2 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/10 text-accent font-bold text-xl sm:text-2xl flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="font-semibold text-lg sm:text-xl">Set your flight plan</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Enter your destination, add families, set nap times and dietary needs
              </p>
            </Card>

            <Card className="p-6 sm:p-8 text-center space-y-4 border-2 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/10 text-accent font-bold text-xl sm:text-2xl flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="font-semibold text-lg sm:text-xl">Your co-pilot takes the wheel</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                AI charts a day plan that keeps your whole flock happy
              </p>
            </Card>

            <Card className="p-6 sm:p-8 text-center space-y-4 border-2 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/10 text-accent font-bold text-xl sm:text-2xl flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="font-semibold text-lg sm:text-xl">Soar with confidence</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Get direct links to tickets, menus, and maps. Fly without guesswork.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 sm:py-16 md:py-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <Card className="p-8 sm:p-12 md:p-16 text-center space-y-6 sm:space-y-8 bg-gradient-to-br from-accent/10 via-primary/5 to-background border-2">
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold">
                Stop winging it. Start flying smart.
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Join the flock of families already flying stress-free
              </p>
            </div>
            
            <Button 
              variant="hero" 
              size="lg" 
              asChild
              className="text-base sm:text-lg md:text-xl px-8 sm:px-12 py-6 sm:py-8 h-auto shadow-2xl hover:scale-105 transition-transform"
            >
              <Link to="/auth">
                Start Planning Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <p className="text-xs sm:text-sm text-muted-foreground">
              Free forever • No credit card required • Get your first itinerary in minutes
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 border-t">
        <div className="container max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GaggleGoWordmark size="sm" animate={false} />
            <span>© 2025 GaggleGO</span>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <Link to="/auth" className="hover:text-primary transition-colors">
              Sign In
            </Link>
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              How It Works
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
