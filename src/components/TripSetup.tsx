import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { MapPin, Plus, X, Clock, UtensilsCrossed, Pencil, Save, FolderOpen, Trash2, Loader2, Calendar as CalendarIcon, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/DateRangePicker";
import { GooseIcon, GoslingIcon } from "@/components/icons/BrandIcons";
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
import { AnimatedGoose } from "@/components/AnimatedGoose";
import { useAuth } from "@/contexts/AuthContext";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";
import { GooseStatusCard } from "@/components/GooseStatusCard";

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
  enabled: boolean;
  mode: "shared" | "separate";
  sharedAddress?: string;
  sharedCoordinates?: { lat: number; lng: number };
  perFamilyAddresses?: Map<string, string>;
  perFamilyCoordinates?: Map<string, { lat: number; lng: number }>;
  allowCarNaps: boolean;
}

interface MealPreferences {
  enabled: boolean;
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
  preset_name: string;
  families: Family[];
  location?: string;
  no_gift_shop?: boolean;
  nest_config?: NestConfig;
  meal_preferences?: MealPreferences;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

const DEFAULT_FAMILIES: Family[] = [];

export const TripSetup = ({ onComplete }: TripSetupProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [families, setFamilies] = useState<Family[]>(DEFAULT_FAMILIES);
  const [noGiftShop, setNoGiftShop] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [editingFamily, setEditingFamily] = useState<Family | null>(null);
  const [editForm, setEditForm] = useState<Family | null>(null);
  
  const [nestConfig, setNestConfig] = useState<NestConfig>({
    enabled: false,
    mode: "shared",
    sharedAddress: "",
    sharedCoordinates: undefined,
    perFamilyAddresses: new Map(),
    perFamilyCoordinates: new Map(),
    allowCarNaps: false,
  });
  
  const [mealPreferences, setMealPreferences] = useState<MealPreferences>({
    enabled: false,
    breakfast: { enabled: true, time: "08:00" },
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
  const [loadingPresets, setLoadingPresets] = useState(false);

  // Load presets from Supabase
  useEffect(() => {
    if (user) {
      loadPresetsFromDatabase();
    }
  }, [user]);

  const loadPresetsFromDatabase = async () => {
    if (!user) return;
    
    setLoadingPresets(true);
    try {
      const { data, error } = await supabase
        .from('family_preferences')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Cast the data to the correct type
      const typedPresets: FamilyPreset[] = (data || []).map(preset => ({
        id: preset.id,
        preset_name: preset.preset_name,
        families: preset.families as unknown as Family[],
        location: preset.location || undefined,
        no_gift_shop: preset.no_gift_shop || undefined,
        nest_config: preset.nest_config as unknown as NestConfig | undefined,
        meal_preferences: preset.meal_preferences as unknown as MealPreferences | undefined,
        start_date: preset.start_date || undefined,
        end_date: preset.end_date || undefined,
        created_at: preset.created_at,
      }));
      
      setPresets(typedPresets);
    } catch (error: any) {
      console.error('Failed to load presets:', error);
      toast({
        title: "Error loading presets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingPresets(false);
    }
  };

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

  const savePreset = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save presets.",
        variant: "destructive",
      });
      return;
    }

    if (!presetName.trim()) {
      toast({
        title: "Preset name required",
        description: "Please enter a name for your preset.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('family_preferences')
        .insert([{
          user_id: user.id,
          preset_name: presetName.trim(),
          families: families as any,
          location: location || null,
          no_gift_shop: noGiftShop,
          nest_config: nestConfig as any,
          meal_preferences: mealPreferences as any,
          start_date: dateRange?.from?.toISOString().split('T')[0] || null,
          end_date: dateRange?.to?.toISOString().split('T')[0] || null,
        }])
        .select()
        .single();

      if (error) throw error;

      const newPreset: FamilyPreset = {
        id: data.id,
        preset_name: data.preset_name,
        families: data.families as unknown as Family[],
        location: data.location || undefined,
        no_gift_shop: data.no_gift_shop || undefined,
        nest_config: data.nest_config as unknown as NestConfig | undefined,
        meal_preferences: data.meal_preferences as unknown as MealPreferences | undefined,
        start_date: data.start_date || undefined,
        end_date: data.end_date || undefined,
        created_at: data.created_at,
      };

      setPresets([newPreset, ...presets]);
      
      toast({
        title: "Preset saved!",
        description: `"${presetName}" has been saved successfully.`,
      });

      setShowSavePreset(false);
      setPresetName("");
    } catch (error: any) {
      console.error('Failed to save preset:', error);
      toast({
        title: "Error saving preset",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const loadPreset = (preset: FamilyPreset) => {
    setFamilies([...preset.families]);
    if (preset.location) setLocation(preset.location);
    if (preset.no_gift_shop !== undefined) setNoGiftShop(preset.no_gift_shop);
    if (preset.nest_config) setNestConfig(preset.nest_config);
    if (preset.meal_preferences) setMealPreferences(preset.meal_preferences);
    
    // Load date range if available
    if (preset.start_date && preset.end_date) {
      setDateRange({
        from: new Date(preset.start_date),
        to: new Date(preset.end_date),
      });
    } else if (preset.start_date) {
      setDateRange({
        from: new Date(preset.start_date),
        to: undefined,
      });
    }
    
    setShowLoadPreset(false);
    toast({
      title: "Preset loaded!",
      description: `"${preset.preset_name}" configuration has been loaded.`,
    });
  };

  const deletePreset = async (presetId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('family_preferences')
        .delete()
        .eq('id', presetId)
        .eq('user_id', user.id);

      if (error) throw error;

      setPresets(presets.filter(p => p.id !== presetId));
      toast({
        title: "Preset deleted",
        description: "The preset has been removed.",
      });
    } catch (error: any) {
      console.error('Failed to delete preset:', error);
      toast({
        title: "Error deleting preset",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveIndividualFamily = async (family: Family) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save families.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_families')
        .insert([{
          user_id: user.id,
          name: family.name,
          dietary: family.dietary as any,
          members: family.members as any,
        }]);

      if (error) throw error;

      toast({
        title: "Family saved!",
        description: `"${family.name}" has been saved to your profile.`,
      });
    } catch (error: any) {
      console.error('Failed to save family:', error);
      toast({
        title: "Error saving family",
        description: error.message,
        variant: "destructive",
      });
    }
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

    // Check if any kids need naps
    const hasNapTimeKids = families.some(f => 
      f.members.some(m => m.type === 'kid' && m.napTime)
    );

    // Require nest address if kids have nap times
    if (hasNapTimeKids) {
      const hasNestAddress = nestConfig.mode === "shared" 
        ? !!nestConfig.sharedAddress 
        : families.every(f => nestConfig.perFamilyAddresses?.get(f.id));
      
      if (!hasNestAddress) {
        toast({
          title: "Nest address required",
          description: "Please provide a nest address for nap times",
          variant: "destructive"
        });
        return;
      }
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
      {isGenerating ? (
        <div className="container max-w-3xl mx-auto flex items-center justify-center min-h-[60vh]">
          <GooseStatusCard
            title="Generating Your Itinerary"
            estimatedSeconds={25}
            messages={[
              "Gathering the flock...",
              "Plotting the migration route...",
              "Finding family-friendly spots...",
              "Checking for quiet zones...",
              "Almost ready for takeoff!"
            ]}
            onCancel={() => setIsGenerating(false)}
          />
        </div>
      ) : (
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
                <div className="flex items-center justify-between">
                  <Label className="text-sm sm:text-base font-semibold flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Trip Dates
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      setDateRange({ from: today, to: today });
                    }}
                  >
                    Today
                  </Button>
                </div>
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
                            onClick={() => saveIndividualFamily(family)}
                          >
                            <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
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
                            <Badge variant={member.type === "adult" ? "secondary" : "default"} className="text-xs flex-shrink-0 flex items-center justify-center p-1">
                              {member.type === "adult" ? <GooseIcon size={14} /> : <GoslingIcon size={14} />}
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
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm sm:text-base font-semibold">🏠 The Nest (Home Base)</Label>
                    {!nestConfig.enabled && (
                      <p className="text-xs text-muted-foreground">
                        Nap requirements will be ignored
                      </p>
                    )}
                  </div>
                  <Switch
                    id="nest-enabled"
                    checked={nestConfig.enabled}
                    onCheckedChange={(checked) => setNestConfig({ ...nestConfig, enabled: checked })}
                  />
                </div>
                
                {nestConfig.enabled && (
                  <>
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
                      <div className="space-y-2">
                        <Label htmlFor="shared-address" className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Nest Address
                        </Label>
                        <AddressAutocomplete
                          value={nestConfig.sharedAddress || ""}
                          onChange={(address, coords) => 
                            setNestConfig({ 
                              ...nestConfig, 
                              sharedAddress: address,
                              sharedCoordinates: coords 
                            })
                          }
                          placeholder="Hotel address or home base location"
                          className="h-11 sm:h-12"
                        />
                      </div>
                    )}

                    {/* Per-family nest inputs */}
                    {nestConfig.mode === "separate" && families.length > 0 && (
                      <div className="space-y-3">
                        <Label className="text-sm">Family Nest Addresses</Label>
                        {families.map((family) => (
                          <div key={family.id} className="space-y-2">
                            <Label htmlFor={`nest-${family.id}`} className="text-sm font-medium flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              {family.name}
                            </Label>
                            <AddressAutocomplete
                              value={nestConfig.perFamilyAddresses?.get(family.id) || ""}
                              onChange={(address, coords) => {
                                const newAddressMap = new Map(nestConfig.perFamilyAddresses);
                                newAddressMap.set(family.id, address);
                                
                                const newCoordMap = new Map(nestConfig.perFamilyCoordinates);
                                if (coords) {
                                  newCoordMap.set(family.id, coords);
                                }
                                
                                setNestConfig({ 
                                  ...nestConfig, 
                                  perFamilyAddresses: newAddressMap,
                                  perFamilyCoordinates: newCoordMap
                                });
                              }}
                              placeholder={`Address for ${family.name}`}
                              className="h-10 sm:h-11"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="space-y-1">
                        <Label htmlFor="car-naps" className="text-sm">
                          Allow car naps during travel
                        </Label>
                        {nestConfig.allowCarNaps && (
                          <p className="text-xs text-muted-foreground">
                            🚗 Only for drives 2+ hours long
                          </p>
                        )}
                      </div>
                      <Switch
                        id="car-naps"
                        checked={nestConfig.allowCarNaps}
                        onCheckedChange={(checked) => setNestConfig({ ...nestConfig, allowCarNaps: checked })}
                      />
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Feeding the Flock */}
            <Card className="p-4 sm:p-5 md:p-6 border-2 hover:border-primary/30 transition-colors">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm sm:text-base font-semibold">🍽️ Feeding the Flock</Label>
                    {!mealPreferences.enabled && (
                      <p className="text-xs text-muted-foreground">
                        Meal planning will be skipped
                      </p>
                    )}
                  </div>
                  <Switch
                    id="meals-enabled"
                    checked={mealPreferences.enabled}
                    onCheckedChange={(checked) => setMealPreferences({ ...mealPreferences, enabled: checked })}
                  />
                </div>
                
                {mealPreferences.enabled && (
                  <>
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
                  </>
                )}
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
      )}

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
            <DialogTitle>Save Trip Configuration</DialogTitle>
            <DialogDescription>
              Save your complete trip setup including families, dates, location, and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Configuration Name</Label>
              <Input
                id="preset-name"
                placeholder="e.g., Summer 2024, Weekend Trip..."
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && savePreset()}
              />
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>✓ {families.length} {families.length === 1 ? "family" : "families"}</p>
              {location && <p>✓ Location: {location}</p>}
              {dateRange?.from && (
                <p>
                  ✓ Dates: {dateRange.from.toLocaleDateString()}
                  {dateRange.to && dateRange.to !== dateRange.from && ` - ${dateRange.to.toLocaleDateString()}`}
                </p>
              )}
              {nestConfig.sharedAddress && <p>✓ Nest configured</p>}
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
            <DialogTitle>Load Trip Configuration</DialogTitle>
            <DialogDescription>
              Select a saved configuration to quickly set up your entire trip.
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
                    <h4 className="font-semibold">{preset.preset_name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{preset.families.length} {preset.families.length === 1 ? "family" : "families"}</span>
                      {preset.location && (
                        <>
                          <span>•</span>
                          <span>{preset.location}</span>
                        </>
                      )}
                      {preset.start_date && (
                        <>
                          <span>•</span>
                          <span>
                            {new Date(preset.start_date).toLocaleDateString()}
                            {preset.end_date && preset.end_date !== preset.start_date && 
                              ` - ${new Date(preset.end_date).toLocaleDateString()}`
                            }
                          </span>
                        </>
                      )}
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
