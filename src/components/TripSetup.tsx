import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MapPin, Plus, X, Clock, UtensilsCrossed, Pencil, Save, FolderOpen, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LocationSuggestions } from "@/components/LocationSuggestions";

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

interface FamilyPreset {
  id: string;
  name: string;
  families: Family[];
  createdAt: string;
}

const DEFAULT_FAMILIES: Family[] = [
  { id: "1", name: "Kreuns", napTime: "1:00 PM", dietary: ["None"], members: 4 },
  { id: "2", name: "Wafais", napTime: "1:00 PM", dietary: ["Halal"], members: 5 },
  { id: "3", name: "Sangvis", napTime: "1:00 PM", dietary: ["Plain/Simple"], members: 3 },
  { id: "4", name: "Rappaports", napTime: "1:00 PM", dietary: ["Gluten-Free", "Kosher"], members: 4 },
];

const PRESETS_STORAGE_KEY = "village-family-presets";

export const TripSetup = ({ onComplete }: TripSetupProps) => {
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [families, setFamilies] = useState<Family[]>(DEFAULT_FAMILIES);
  const [noGiftShop, setNoGiftShop] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [editForm, setEditForm] = useState<Family | null>(null);
  
  const [presets, setPresets] = useState<FamilyPreset[]>([]);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [showLoadPreset, setShowLoadPreset] = useState(false);
  const [presetName, setPresetName] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (stored) {
      try {
        setPresets(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load presets", e);
      }
    }
  }, []);

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

  const openEditDialog = (family: Family) => {
    setEditingFamily(family);
    setEditForm({ ...family });
  };

  const saveEditedFamily = () => {
    if (!editForm) return;
    setFamilies(families.map(f => f.id === editForm.id ? editForm : f));
    setEditingFamily(null);
    setEditForm(null);
  };

  const updateEditForm = (field: keyof Family, value: any) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [field]: value });
  };

  const savePreset = () => {
    if (!presetName.trim()) {
      toast({
        title: "Preset name required",
        description: "Please enter a name for your preset.",
        variant: "destructive",
      });
      return;
    }

    const newPreset: FamilyPreset = {
      id: Date.now().toString(),
      name: presetName.trim(),
      families: [...families],
      createdAt: new Date().toISOString(),
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
    
    toast({
      title: "Preset saved!",
      description: `"${presetName}" has been saved successfully.`,
    });

    setShowSavePreset(false);
    setPresetName("");
  };

  const loadPreset = (preset: FamilyPreset) => {
    setFamilies([...preset.families]);
    setShowLoadPreset(false);
    toast({
      title: "Preset loaded!",
      description: `"${preset.name}" configuration has been loaded.`,
    });
  };

  const deletePreset = (presetId: string) => {
    const updatedPresets = presets.filter(p => p.id !== presetId);
    setPresets(updatedPresets);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updatedPresets));
    toast({
      title: "Preset deleted",
      description: "The preset has been removed.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && families.length > 0) {
      onComplete({ location, families, noGiftShop });
    }
  };

  return (
    <section className="min-h-screen py-16 px-4">
      <div className="container max-w-3xl mx-auto">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-display font-bold">Plan Your Trip</h2>
            <p className="text-muted-foreground">
              Location and families
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Input */}
            <Card className="p-6 border-2 hover:border-primary/30 transition-colors">
              <div className="space-y-4">
                <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Destination
                </Label>
                <Input
                  id="location"
                  placeholder="Disneyland, Paris, San Diego Zoo..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12"
                  required
                />
                
                {/* AI-powered location suggestions */}
                <div className="pt-4 border-t">
                  <LocationSuggestions onSelectLocation={setLocation} />
                </div>
              </div>
            </Card>

            {/* Families */}
            <Card className="p-6 border-2 hover:border-primary/30 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Families</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLoadPreset(true)}
                    >
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Load
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowSavePreset(true)}
                      disabled={families.length === 0}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>

                {/* Family Cards */}
                <div className="space-y-3">
                  {families.map((family) => (
                    <div
                      key={family.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{family.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {family.members}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {family.napTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <UtensilsCrossed className="w-3.5 h-3.5" />
                            {family.dietary.join(", ")}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(family)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFamily(family.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
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
            <Card className="p-6 border-2 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="gift-shop" className="text-base font-semibold">
                    Avoid Tourist Traps
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Skip retail areas when planning paths
                  </p>
                </div>
                <Switch
                  id="gift-shop"
                  checked={noGiftShop}
                  onCheckedChange={setNoGiftShop}
                />
              </div>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full h-12"
              disabled={!location || families.length === 0}
            >
              Generate Itinerary
            </Button>
          </form>
        </div>
      </div>

      {/* Edit Family Dialog */}
      <Dialog open={!!editingFamily} onOpenChange={(open) => !open && setEditingFamily(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Family Details</DialogTitle>
          </DialogHeader>
          {editForm && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Family Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) => updateEditForm("name", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-members">Number of Members</Label>
                <Input
                  id="edit-members"
                  type="number"
                  min="1"
                  value={editForm.members}
                  onChange={(e) => updateEditForm("members", parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-naptime">Nap Time</Label>
                <Input
                  id="edit-naptime"
                  type="time"
                  value={editForm.napTime}
                  onChange={(e) => {
                    const time = e.target.value;
                    const [hours, minutes] = time.split(":");
                    const hour = parseInt(hours);
                    const ampm = hour >= 12 ? "PM" : "AM";
                    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                    updateEditForm("napTime", `${displayHour}:${minutes} ${ampm}`);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-dietary">Dietary Restrictions</Label>
                <Input
                  id="edit-dietary"
                  placeholder="Separate with commas"
                  value={editForm.dietary.join(", ")}
                  onChange={(e) => updateEditForm("dietary", e.target.value.split(",").map(s => s.trim()).filter(s => s.length > 0))}
                />
                <p className="text-xs text-muted-foreground">
                  Examples: None, Halal, Kosher, Gluten-Free, Vegan, Plain/Simple
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFamily(null)}>
              Cancel
            </Button>
            <Button onClick={saveEditedFamily}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Preset Dialog */}
      <Dialog open={showSavePreset} onOpenChange={setShowSavePreset}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Save Family Configuration</DialogTitle>
            <DialogDescription>
              Save your current family setup as a preset for future trips.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                placeholder="e.g., Summer 2024, Weekend Trip..."
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && savePreset()}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Currently saving {families.length} {families.length === 1 ? "family" : "families"}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSavePreset(false)}>
              Cancel
            </Button>
            <Button onClick={savePreset}>
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Preset Dialog */}
      <Dialog open={showLoadPreset} onOpenChange={setShowLoadPreset}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Load Family Configuration</DialogTitle>
            <DialogDescription>
              Select a saved preset to quickly set up your families.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-[400px] overflow-y-auto">
            {presets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No saved presets yet.</p>
                <p className="text-sm">Save your first configuration to get started!</p>
              </div>
            ) : (
              presets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border hover:border-secondary transition-all"
                >
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold">{preset.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{preset.families.length} {preset.families.length === 1 ? "family" : "families"}</span>
                      <span>•</span>
                      <span>{new Date(preset.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {preset.families.map((f) => (
                        <Badge key={f.id} variant="secondary" className="text-xs">
                          {f.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => loadPreset(preset)}
                    >
                      Load
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePreset(preset.id)}
                      className="hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoadPreset(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
