import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Trash2, Clock, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { GooseIcon, GoslingIcon } from "@/components/icons/BrandIcons";
import { AnimatedGoose } from "@/components/AnimatedGoose";
import { useNavigate } from "react-router-dom";
import { FlockList } from "@/components/FlockList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
}

interface FamilyPreset {
  id: string;
  preset_name: string;
  families: any;
  location: string | null;
  no_gift_shop: boolean | null;
  created_at: string;
}

interface SavedFamily {
  id: string;
  name: string;
  dietary: string[];
  members: Array<{
    id: string;
    name: string;
    type: "adult" | "kid";
    age?: number;
    napTime?: string;
  }>;
  created_at: string;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({ display_name: null, avatar_url: null });
  const [displayName, setDisplayName] = useState("");
  const [presets, setPresets] = useState<FamilyPreset[]>([]);
  const [savedFamilies, setSavedFamilies] = useState<SavedFamily[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadPresets();
      loadSavedFamilies();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user!.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || "");
      }
    } catch (error: any) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPresets = async () => {
    try {
      const { data, error } = await supabase
        .from("family_preferences")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setPresets(data || []);
    } catch (error: any) {
      console.error("Error loading presets:", error);
    }
  };

  const loadSavedFamilies = async () => {
    try {
      const { data, error } = await supabase
        .from("saved_families")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Cast data to proper type
      const typedFamilies: SavedFamily[] = (data || []).map(family => ({
        id: family.id,
        name: family.name,
        dietary: family.dietary as unknown as string[],
        members: family.members as unknown as Array<{
          id: string;
          name: string;
          type: "adult" | "kid";
          age?: number;
          napTime?: string;
        }>,
        created_at: family.created_at,
      }));

      setSavedFamilies(typedFamilies);
    } catch (error: any) {
      console.error("Error loading saved families:", error);
    }
  };

  const updateDisplayName = async () => {
    if (!displayName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a display name.",
        variant: "destructive",
      });
      return;
    }

    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName.trim() })
        .eq("id", user!.id);

      if (error) throw error;

      // Update user metadata
      await supabase.auth.updateUser({
        data: { display_name: displayName.trim() }
      });

      setProfile({ ...profile, display_name: displayName.trim() });
      toast({
        title: "Profile updated",
        description: "Your display name has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${user!.id}/avatar.${fileExt}`;

      // Delete old avatar if exists
      if (profile.avatar_url) {
        const oldPath = profile.avatar_url.split("/").pop();
        if (oldPath) {
          await supabase.storage.from("avatars").remove([`${user!.id}/${oldPath}`]);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user!.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const deletePreset = async (presetId: string) => {
    try {
      const { error } = await supabase
        .from("family_preferences")
        .delete()
        .eq("id", presetId)
        .eq("user_id", user!.id);

      if (error) throw error;

      setPresets(presets.filter((p) => p.id !== presetId));
      toast({
        title: "Preset deleted",
        description: "Your family configuration has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteSavedFamily = async (familyId: string) => {
    try {
      const { error } = await supabase
        .from("saved_families")
        .delete()
        .eq("id", familyId)
        .eq("user_id", user!.id);

      if (error) throw error;

      setSavedFamilies(savedFamilies.filter((f) => f.id !== familyId));
      toast({
        title: "Family deleted",
        description: "The saved family has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-4">
        <div className="container max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-display font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account and flock</p>
          </div>

          <Card className="p-8 border-2">
            <div className="space-y-8">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="w-32 h-32 rounded-full" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-display font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your account and flock</p>
        </div>

        {/* Profile Info - First */}
        <Card className="p-8 border-2">
          <div className="space-y-8">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32 border-4 border-primary/30">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                >
                  {uploading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 mr-2" />
                  )}
                  Upload Avatar
                </Button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={uploadAvatar}
                  className="hidden"
                />
              </div>
            </div>

            {/* Display Name */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="h-12"
                  />
                  <Button
                    onClick={updateDisplayName}
                    disabled={updating || displayName === profile.display_name}
                    className="h-12"
                  >
                    {updating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="h-12"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Flock List - Second */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-display font-bold">My Flock</h2>
          </div>
          <FlockList />
        </div>

        {/* Saved Individual Families - Third */}
        <Card className="p-6 border-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GooseIcon size={24} className="text-primary" />
                <h2 className="text-xl font-semibold">Saved Families</h2>
              </div>
              <Badge variant="secondary">{savedFamilies.length}</Badge>
            </div>

            {savedFamilies.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <div style={{ width: 80, height: 80 }}>
                    <AnimatedGoose enableConstantAnimation={false} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">No families saved yet</p>
                  <p className="text-sm text-muted-foreground">Save individual families from trip setup to reuse them across trips</p>
                </div>
                <Button onClick={() => navigate('/plan')} variant="outline" size="sm">
                  Start Planning
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {savedFamilies.map((family) => (
                  <div
                    key={family.id}
                    className="flex items-start justify-between p-4 bg-muted/50 rounded-xl border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold">{family.name}</h3>
                      <div className="space-y-1">
                        {family.members.map((member) => (
                          <div key={member.id} className="text-sm flex items-center gap-2">
                            <Badge variant={member.type === "adult" ? "secondary" : "default"} className="text-xs flex items-center justify-center p-1">
                              {member.type === "adult" ? <GooseIcon size={12} /> : <GoslingIcon size={12} />}
                            </Badge>
                            <span>{member.name}</span>
                            {member.type === "kid" && member.age && (
                              <span className="text-muted-foreground">({member.age}y)</span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {family.dietary.length > 0 && family.dietary[0] !== "None" && (
                          <span>🍽️ {family.dietary.join(", ")}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(family.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this family?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{family.name}" from your saved families. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteSavedFamily(family.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Saved Presets - Fourth */}
        <Card className="p-6 border-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Saved Configurations</h2>
              </div>
              <Badge variant="secondary">{presets.length}</Badge>
            </div>

            {presets.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <div className="flex justify-center">
                  <div style={{ width: 80, height: 80 }}>
                    <AnimatedGoose enableConstantAnimation={false} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold">No presets saved yet</p>
                  <p className="text-sm text-muted-foreground">Save complete family configurations from trip setup to speed up future planning</p>
                </div>
                <Button onClick={() => navigate('/plan')} variant="outline" size="sm">
                  Create Configuration
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold">{preset.preset_name}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {preset.location && (
                          <span className="flex items-center gap-1">
                            📍 {preset.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {Array.isArray(preset.families) ? preset.families.length : 0} families
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(preset.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this preset?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{preset.preset_name}" from your saved configurations. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deletePreset(preset.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
