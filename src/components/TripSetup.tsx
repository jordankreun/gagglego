import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MapPin, Plus, X, Clock, UtensilsCrossed, Pencil, Save, FolderOpen, Trash2, Loader2 } from "lucide-react";
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
import { FamilyMemberEditor } from "@/components/FamilyMemberEditor";
import { supabase } from "@/integrations/supabase/client";

interface Member {
  id: string;
  name: string;
  type: "adult" | "kid";
  age?: number; // Only for kids
  napTime?: string; // Only for kids
}

interface Family {
  id: string;
  name: string;
  dietary: string[];
  members: Member[];
}

interface TripSetupProps {
  onComplete: (data: { location: string; families: Family[]; noGiftShop: boolean }, items: any[]) => void;
}

interface FamilyPreset {
  id: string;
  name: string;
  families: Family[];
  createdAt: string;
}

const DEFAULT_FAMILIES: Family[] = [
  { 
    id: "1", 
    name: "Kreuns", 
    dietary: ["None"], 
    members: [
      { id: "1-1", name: "Parent 1", type: "adult" },
      { id: "1-2", name: "Parent 2", type: "adult" },
      { id: "1-3", name: "Child 1", type: "kid", age: 3, napTime: "1:00 PM" },
      { id: "1-4", name: "Child 2", type: "kid", age: 5, napTime: "1:00 PM" },
    ]
  },
  { 
    id: "2", 
    name: "Wafais", 
    dietary: ["Halal"], 
    members: [
      { id: "2-1", name: "Parent 1", type: "adult" },
      { id: "2-2", name: "Parent 2", type: "adult" },
      { id: "2-3", name: "Child 1", type: "kid", age: 2, napTime: "1:00 PM" },
      { id: "2-4", name: "Child 2", type: "kid", age: 4, napTime: "1:00 PM" },
      { id: "2-5", name: "Child 3", type: "kid", age: 7, napTime: "1:00 PM" },
    ]
  },
  { 
    id: "3", 
    name: "Sangvis", 
    dietary: ["Plain/Simple"], 
    members: [
      { id: "3-1", name: "Parent 1", type: "adult" },
      { id: "3-2", name: "Child 1", type: "kid", age: 4, napTime: "1:00 PM" },
      { id: "3-3", name: "Child 2", type: "kid", age: 6, napTime: "1:00 PM" },
    ]
  },
  { 
    id: "4", 
    name: "Rappaports", 
    dietary: ["Gluten-Free", "Kosher"], 
    members: [
      { id: "4-1", name: "Parent 1", type: "adult" },
      { id: "4-2", name: "Parent 2", type: "adult" },
      { id: "4-3", name: "Child 1", type: "kid", age: 3, napTime: "1:00 PM" },
      { id: "4-4", name: "Child 2", type: "kid", age: 8, napTime: "1:30 PM" },
    ]
  },
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
  const [isGenerating, setIsGenerating] = useState(false);

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
      dietary: ["None"],
      members: [],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || families.length === 0) return;

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-itinerary', {
        body: {
          location,
          families,
          noGiftShop,
          date: new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      });

      if (error) throw error;
      if (!data?.items) throw new Error('No itinerary items returned');

      toast({
        title: "Itinerary generated!",
        description: `Created ${data.items.length} activities for your trip`,
      });

      onComplete({ location, families, noGiftShop }, data.items);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
                      className="p-4 bg-muted/50 rounded-xl border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{family.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {family.members.length} member{family.members.length !== 1 ? 's' : ''}
                          </p>
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
                      
                      {/* Members List */}
                      <div className="space-y-1.5 mb-3">
                        {family.members.map((member) => (
                          <div key={member.id} className="text-sm flex items-center gap-2">
                            <Badge variant={member.type === "adult" ? "secondary" : "default"} className="text-xs">
                              {member.type === "adult" ? "👤" : "🧒"}
                            </Badge>
                            <span>{member.name}</span>
                            {member.type === "kid" && member.age && (
                              <span className="text-muted-foreground">({member.age}y)</span>
                            )}
                            {member.type === "kid" && member.napTime && (
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {member.napTime}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Dietary Info */}
                      {family.dietary.length > 0 && family.dietary[0] !== "None" && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground pt-2 border-t">
                          <UtensilsCrossed className="w-3.5 h-3.5" />
                          <span>{family.dietary.join(", ")}</span>
                        </div>
                      )}
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
              disabled={!location || families.length === 0 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Your Itinerary...
                </>
              ) : (
                "Generate Itinerary"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Edit Family Dialog */}
      <Dialog open={!!editingFamily} onOpenChange={(open) => !open && setEditingFamily(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Family Details</DialogTitle>
            <DialogDescription>
              Add family members, set nap times for kids, and configure dietary needs.
            </DialogDescription>
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
                <Label>Family Members</Label>
                <FamilyMemberEditor
                  members={editForm.members}
                  onChange={(members) => updateEditForm("members", members)}
                />
              </div>

              <div className="space-y-3">
                <Label>Dietary Restrictions (Family-wide)</Label>
                
                {/* Quick-select chips */}
                <div className="flex flex-wrap gap-2">
                  {["None", "Halal", "Kosher", "Gluten Free", "Vegan", "Vegetarian", "Dairy Free", "Nut Allergy", "Plain Simple"].map((option) => {
                    const isSelected = editForm.dietary.includes(option);
                    return (
                      <Badge
                        key={option}
                        variant={isSelected ? "default" : "outline"}
                        className="cursor-pointer hover:bg-primary/80 transition-colors"
                        onClick={() => {
                          if (isSelected) {
                            const filtered = editForm.dietary.filter(item => item !== option);
                            updateEditForm("dietary", filtered.length > 0 ? filtered : ["None"]);
                          } else {
                            const updated = editForm.dietary.filter(item => item !== "None");
                            updateEditForm("dietary", [...updated, option]);
                          }
                        }}
                      >
                        {option}
                      </Badge>
                    );
                  })}
                </div>

                {/* Freeform input for custom restrictions */}
                <div className="space-y-1">
                  <Label htmlFor="edit-dietary" className="text-xs text-muted-foreground">
                    Add custom restrictions (comma-separated)
                  </Label>
                  <Input
                    id="edit-dietary"
                    placeholder="e.g., Low Sodium, Shellfish Allergy"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const input = e.currentTarget;
                        const items = input.value.split(",").map(item => item.trim()).filter(item => item !== "");
                        if (items.length > 0) {
                          const updated = [...new Set([...editForm.dietary.filter(d => d !== "None"), ...items])];
                          updateEditForm("dietary", updated);
                          input.value = "";
                        }
                      }
                    }}
                  />
                </div>
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
