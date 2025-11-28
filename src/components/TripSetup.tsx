import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MapPin, Plus, X, Clock, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Family {
  id: string;
  name: string;
  napTime: string;
  dietary: string[];
  members: number;
}

interface TripSetupProps {
  onComplete: (data: { location: string; families: Family[]; noGiftShop: boolean }) => void;
}

const DEFAULT_FAMILIES: Family[] = [
  { id: "1", name: "Kreuns", napTime: "1:00 PM", dietary: ["None"], members: 4 },
  { id: "2", name: "Wafais", napTime: "1:00 PM", dietary: ["Halal"], members: 5 },
  { id: "3", name: "Sangvis", napTime: "1:00 PM", dietary: ["Plain/Simple"], members: 3 },
  { id: "4", name: "Rappaports", napTime: "1:00 PM", dietary: ["Gluten-Free", "Kosher"], members: 4 },
];

export const TripSetup = ({ onComplete }: TripSetupProps) => {
  const [location, setLocation] = useState("");
  const [families, setFamilies] = useState<Family[]>(DEFAULT_FAMILIES);
  const [noGiftShop, setNoGiftShop] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState("");

  const addFamily = () => {
    if (!newFamilyName.trim()) return;
    
    const newFamily: Family = {
      id: Date.now().toString(),
      name: newFamilyName,
      napTime: "1:00 PM",
      dietary: ["None"],
      members: 2,
    };
    
    setFamilies([...families, newFamily]);
    setNewFamilyName("");
  };

  const removeFamily = (id: string) => {
    setFamilies(families.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && families.length > 0) {
      onComplete({ location, families, noGiftShop });
    }
  };

  return (
    <section className="min-h-screen py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-bold">Set Up Your Trip</h2>
            <p className="text-muted-foreground text-lg">
              Tell us where you're going and who's coming along
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Location Input */}
            <Card className="p-6 shadow-lg border-2 border-border hover:border-primary transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-lg font-semibold">
                      Destination
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      City, theme park, resort, or any location
                    </p>
                  </div>
                </div>
                <Input
                  id="location"
                  placeholder="e.g., Disneyland, San Diego Zoo, Paris..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-lg h-12"
                  required
                />
              </div>
            </Card>

            {/* Families */}
            <Card className="p-6 shadow-lg border-2 border-border">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">The Village Families</h3>
                    <p className="text-sm text-muted-foreground">
                      Manage who's joining this trip
                    </p>
                  </div>
                </div>

                {/* Family Cards */}
                <div className="grid gap-4">
                  {families.map((family) => (
                    <div
                      key={family.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border hover:border-secondary transition-all"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-lg">{family.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {family.members} members
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 text-accent" />
                            <span>Nap: {family.napTime}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <UtensilsCrossed className="w-4 h-4 text-secondary" />
                            <span>{family.dietary.join(", ")}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFamily(family.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Add Family */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new family..."
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFamily())}
                  />
                  <Button type="button" onClick={addFamily} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Settings */}
            <Card className="p-6 shadow-lg border-2 border-border">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Trip Settings</h3>
                
                <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                  <div className="space-y-1">
                    <Label htmlFor="gift-shop" className="font-semibold">
                      No Gift Shop Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Avoid high commercial exposure zones
                    </p>
                  </div>
                  <Switch
                    id="gift-shop"
                    checked={noGiftShop}
                    onCheckedChange={setNoGiftShop}
                  />
                </div>
              </div>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full text-lg py-6 h-auto rounded-2xl"
              disabled={!location || families.length === 0}
            >
              Generate Itinerary
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
