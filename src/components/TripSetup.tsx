import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MapPin, Plus, X, Clock, UtensilsCrossed, Pencil, Save, FolderOpen, Trash2, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/DateRangePicker";
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

interface NestConfig {
  mode: "shared" | "separate";
  sharedAddress?: string;
  perFamilyAddresses?: Map<string, string>;
  allowCarNaps: boolean;
}

interface MealPreferences {
  breakfast: { enabled: boolean; time: string };
  lunch: { enabled: boolean; time: string };
  dinner: { enabled: boolean; time: string };
  snacks: { enabled: boolean };
  budgetLevel: "budget" | "moderate" | "splurge";
  kidMenuRequired: boolean;
  highchairRequired: boolean;
  quickServiceOk: boolean;
}

interface TripSetupProps {
  onComplete: (data: { 
    location: string; 
    families: Family[]; 
    noGiftShop: boolean;
    nestConfig?: NestConfig;
    mealPreferences: MealPreferences;
    dateRange?: DateRange;
  }, items: any[]) => void;
}

interface FamilyPreset {
  id: string;
  name: string;
  families: Family[];
  createdAt: string;
}

const DEFAULT_FAMILIES: Family[] = [];

const PRESETS_STORAGE_KEY = "village-family-presets";

export const TripSetup = ({ onComplete }: TripSetupProps) => {
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [families, setFamilies] = useState<Family[]>(DEFAULT_FAMILIES);
  const [noGiftShop, setNoGiftShop] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [editForm, setEditForm] = useState<Family | null>(null);
  
  const [nestConfig, setNestConfig] = useState<NestConfig>({
    mode: "shared",
    sharedAddress: "",
    perFamilyAddresses: new Map(),
    allowCarNaps: false,
  });
  
  const [mealPreferences, setMealPreferences] = useState<MealPreferences>({
    breakfast: { enabled: true, time: "8:00" },
    lunch: { enabled: true, time: "12:00" },
    dinner: { enabled: true, time: "18:00" },
    snacks: { enabled: false },
    budgetLevel: "moderate",
    kidMenuRequired: true,
    highchairRequired: true,
    quickServiceOk: true,
  });
  
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
    if (!location || families.length === 0 || !dateRange?.from) {
      toast({
        title: "Missing information",
        description: "Please select a location, add families, and choose trip dates",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Calculate youngest family member age for age-appropriate filtering
      const allAges = families
        .flatMap(f => f.members)
        .filter(m => m.age !== undefined)
        .map(m => m.age as number);
      const youngestAge = allAges.length > 0 ? Math.min(...allAges) : undefined;

      // Calculate trip duration
      const startDate = dateRange.from;
      const endDate = dateRange.to || dateRange.from;
      const durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      const { data, error } = await supabase.functions.invoke('generate-itinerary', {
        body: {
          location,
          families,
          noGiftShop,
          youngestAge,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          durationDays,
          nestConfig,
          mealPreferences
        },
      });

      if (error) throw error;
      if (!data?.items) throw new Error('No itinerary items returned');

      toast({
        title: "Itinerary generated!",
        description: `Created ${durationDays}-day trip with ${data.items.length} activities`,
      });

      const hasNestConfig = nestConfig.mode === "shared" 
        ? !!nestConfig.sharedAddress 
        : nestConfig.perFamilyAddresses && nestConfig.perFamilyAddresses.size > 0;
      
      onComplete({ 
        location, 
        families, 
        noGiftShop,
        nestConfig: hasNestConfig ? nestConfig : undefined,
        mealPreferences,
        dateRange
      }, data.items);
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
    <section className="min-h-screen py-6 sm:py-12 md:py-16 px-3 sm:px-4">
      <div className="container max-w-3xl mx-auto">
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* Header */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">Plan Your Trip</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Location and families
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Location Input */}
            <Card className="p-4 sm:p-5 md:p-6 border-2 hover:border-primary/30 transition-colors">
              <div className="space-y-3 sm:space-y-4">
                <Label htmlFor="location" className="text-sm sm:text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Destination
                </Label>
                <Input
                  id="location"
                  placeholder="Disneyland, Paris, San Diego Zoo..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-11 sm:h-12 text-base"
                  required
                />
                
                {/* AI-powered location suggestions */}
                <div className="pt-4 border-t">
                  <LocationSuggestions 
                    onSelectLocation={setLocation}
                    families={families}
                    tripDate={new Date().toLocaleDateString()}
                  />
                </div>
              </div>
            </Card>

            {/* Trip Dates */}
            <Card className="p-4 sm:p-5 md:p-6 border-2 hover:border-primary/30 transition-colors">
              <div className="space-y-3 sm:space-y-4">
                <Label className="text-sm sm:text-base font-semibold flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Trip Dates
                </Label>
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />
                {dateRange?.from && dateRange?.to && (
                  <div className="text-sm text-muted-foreground">
                    {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1} day trip
                  </div>
                )}
              </div>
            </Card>

            {/* Families */}
            <Card className="p-4 sm:p-5 md:p-6 border-2 hover:border-primary/30 transition-colors">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-sm sm:text-base font-semibold">Families</Label>
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
                <div className="space-y-2 sm:space-y-3">
                  {families.map((family) => (
                    <div
                      key={family.id}
                      className="p-3 sm:p-4 bg-muted/50 rounded-xl border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base sm:text-lg truncate">{family.name}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {family.members.length} member{family.members.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => openEditDialog(family)}
                          >
                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 sm:h-10 sm:w-10"
                            onClick={() => removeFamily(family.id)}
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Members List */}
                      <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                        {family.members.map((member) => (
                          <div key={member.id} className="text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 flex-wrap">
                            <Badge variant={member.type === "adult" ? "secondary" : "default"} className="text-xs flex-shrink-0">
                              {member.type === "adult" ? "👤" : "🧒"}
                            </Badge>
                            <span className="truncate">{member.name}</span>
                            {member.type === "kid" && member.age && (
                              <span className="text-muted-foreground flex-shrink-0">({member.age}y)</span>
                            )}
                            {member.type === "kid" && member.napTime && (
                              <span className="text-muted-foreground flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs">{member.napTime}</span>
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
                    className="h-10 sm:h-11 text-sm sm:text-base"
                  />
                  <Button type="button" onClick={addFamily} variant="outline" className="h-10 sm:h-11 px-3 sm:px-4">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* The Nest */}
            <Card className="p-4 sm:p-5 md:p-6 border-2 hover:border-primary/30 transition-colors">
              <div className="space-y-4">
                <Label className="text-sm sm:text-base font-semibold">🏠 The Nest (Home Base)</Label>
                
                {/* Mode selector */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={nestConfig.mode === "shared" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNestConfig({ ...nestConfig, mode: "shared" })}
                    className="flex-1"
                  >
                    Shared Nest
                  </Button>
                  <Button
                    type="button"
                    variant={nestConfig.mode === "separate" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNestConfig({ ...nestConfig, mode: "separate" })}
                    className="flex-1"
                  >
                    Separate Nests
                  </Button>
                </div>

                {/* Shared nest input */}
                {nestConfig.mode === "shared" && (
                  <Input
                    placeholder="Hotel address or meeting point (optional)"
                    value={nestConfig.sharedAddress || ""}
                    onChange={(e) => setNestConfig({ ...nestConfig, sharedAddress: e.target.value })}
                    className="h-11 sm:h-12"
                  />
                )}

                {/* Per-family nest inputs */}
                {nestConfig.mode === "separate" && families.length > 0 && (
                  <div className="space-y-3">
                    {families.map((family) => (
                      <div key={family.id} className="space-y-2">
                        <Label htmlFor={`nest-${family.id}`} className="text-sm font-medium">
                          {family.name}'s Nest
                        </Label>
                        <Input
                          id={`nest-${family.id}`}
                          placeholder={`${family.name}'s accommodation address`}
                          value={nestConfig.perFamilyAddresses?.get(family.id) || ""}
                          onChange={(e) => {
                            const newMap = new Map(nestConfig.perFamilyAddresses);
                            newMap.set(family.id, e.target.value);
                            setNestConfig({ ...nestConfig, perFamilyAddresses: newMap });
                          }}
                          className="h-10 sm:h-11"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <Label htmlFor="car-naps" className="text-sm">
                    Allow car naps during travel
                  </Label>
                  <Switch
                    id="car-naps"
                    checked={nestConfig.allowCarNaps}
                    onCheckedChange={(checked) => setNestConfig({ ...nestConfig, allowCarNaps: checked })}
                  />
                </div>
              </div>
            </Card>

            {/* Feeding the Flock */}
            <Card className="p-4 sm:p-5 md:p-6 border-2 hover:border-primary/30 transition-colors">
              <div className="space-y-4">
                <Label className="text-sm sm:text-base font-semibold">🍽️ Feeding the Flock</Label>
                
                {/* Meal toggles with times */}
                <div className="space-y-3">
                  {/* Breakfast */}
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <Switch
                      id="breakfast-toggle"
                      checked={mealPreferences.breakfast.enabled}
                      onCheckedChange={(checked) => 
                        setMealPreferences({ 
                          ...mealPreferences, 
                          breakfast: { ...mealPreferences.breakfast, enabled: checked }
                        })
                      }
                    />
                    <div className="flex-1 flex items-center gap-3">
                      <Label htmlFor="breakfast-toggle" className="text-sm font-medium flex-shrink-0">
                        🌅 Breakfast
                      </Label>
                      {mealPreferences.breakfast.enabled && (
                        <Input
                          type="time"
                          value={mealPreferences.breakfast.time}
                          onChange={(e) => 
                            setMealPreferences({ 
                              ...mealPreferences, 
                              breakfast: { ...mealPreferences.breakfast, time: e.target.value }
                            })
                          }
                          className="h-9 w-32"
                        />
                      )}
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <Switch
                      id="lunch-toggle"
                      checked={mealPreferences.lunch.enabled}
                      onCheckedChange={(checked) => 
                        setMealPreferences({ 
                          ...mealPreferences, 
                          lunch: { ...mealPreferences.lunch, enabled: checked }
                        })
                      }
                    />
                    <div className="flex-1 flex items-center gap-3">
                      <Label htmlFor="lunch-toggle" className="text-sm font-medium flex-shrink-0">
                        ☀️ Lunch
                      </Label>
                      {mealPreferences.lunch.enabled && (
                        <Input
                          type="time"
                          value={mealPreferences.lunch.time}
                          onChange={(e) => 
                            setMealPreferences({ 
                              ...mealPreferences, 
                              lunch: { ...mealPreferences.lunch, time: e.target.value }
                            })
                          }
                          className="h-9 w-32"
                        />
                      )}
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <Switch
                      id="dinner-toggle"
                      checked={mealPreferences.dinner.enabled}
                      onCheckedChange={(checked) => 
                        setMealPreferences({ 
                          ...mealPreferences, 
                          dinner: { ...mealPreferences.dinner, enabled: checked }
                        })
                      }
                    />
                    <div className="flex-1 flex items-center gap-3">
                      <Label htmlFor="dinner-toggle" className="text-sm font-medium flex-shrink-0">
                        🌙 Dinner
                      </Label>
                      {mealPreferences.dinner.enabled && (
                        <Input
                          type="time"
                          value={mealPreferences.dinner.time}
                          onChange={(e) => 
                            setMealPreferences({ 
                              ...mealPreferences, 
                              dinner: { ...mealPreferences.dinner, time: e.target.value }
                            })
                          }
                          className="h-9 w-32"
                        />
                      )}
                    </div>
                  </div>

                  {/* Snacks */}
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <Switch
                      id="snacks-toggle"
                      checked={mealPreferences.snacks.enabled}
                      onCheckedChange={(checked) => 
                        setMealPreferences({ 
                          ...mealPreferences, 
                          snacks: { enabled: checked }
                        })
                      }
                    />
                    <Label htmlFor="snacks-toggle" className="text-sm font-medium">
                      🍎 Include snack recommendations
                    </Label>
                  </div>
                </div>

                {/* Budget level */}
                <div className="pt-2 border-t space-y-2">
                  <Label className="text-xs text-muted-foreground">Budget Level</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={mealPreferences.budgetLevel === "budget" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMealPreferences({ ...mealPreferences, budgetLevel: "budget" })}
                      className="flex-1"
                    >
                      $ Budget
                    </Button>
                    <Button
                      type="button"
                      variant={mealPreferences.budgetLevel === "moderate" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMealPreferences({ ...mealPreferences, budgetLevel: "moderate" })}
                      className="flex-1"
                    >
                      $$ Moderate
                    </Button>
                    <Button
                      type="button"
                      variant={mealPreferences.budgetLevel === "splurge" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMealPreferences({ ...mealPreferences, budgetLevel: "splurge" })}
                      className="flex-1"
                    >
                      $$$ Splurge
                    </Button>
                  </div>
                </div>

                {/* Additional preferences */}
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="kid-menu"
                      checked={mealPreferences.kidMenuRequired}
                      onCheckedChange={(checked) => setMealPreferences({ ...mealPreferences, kidMenuRequired: checked })}
                    />
                    <Label htmlFor="kid-menu" className="text-sm">Kid menu required</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="highchairs"
                      checked={mealPreferences.highchairRequired}
                      onCheckedChange={(checked) => setMealPreferences({ ...mealPreferences, highchairRequired: checked })}
                    />
                    <Label htmlFor="highchairs" className="text-sm">Highchairs needed</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="quick-service"
                      checked={mealPreferences.quickServiceOk}
                      onCheckedChange={(checked) => setMealPreferences({ ...mealPreferences, quickServiceOk: checked })}
                    />
                    <Label htmlFor="quick-service" className="text-sm">Quick service OK</Label>
                  </div>
                </div>
              </div>
            </Card>

            {/* Settings */}
            <Card className="p-4 sm:p-5 md:p-6 border-2 hover:border-primary/30 transition-colors">
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5 sm:space-y-1 flex-1">
                  <Label htmlFor="gift-shop" className="text-sm sm:text-base font-semibold">
                    Avoid Tourist Traps
                  </Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Skip retail areas when planning paths
                  </p>
                </div>
                <Switch
                  id="gift-shop"
                  checked={noGiftShop}
                  onCheckedChange={setNoGiftShop}
                  className="flex-shrink-0"
                />
              </div>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full h-12 sm:h-14 text-sm sm:text-base"
              disabled={!location || families.length === 0 || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Generating Your Itinerary...</span>
                  <span className="sm:hidden">Generating...</span>
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
