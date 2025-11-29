import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Link as LinkIcon, Mail, UserPlus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShareTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  shareCode?: string;
}

interface Collaborator {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    email: string;
    display_name: string | null;
  };
}

export const ShareTripDialog = ({ open, onOpenChange, tripId }: ShareTripDialogProps) => {
  const { toast } = useToast();
  const [inviteCode, setInviteCode] = useState("");
  const [inviteRole, setInviteRole] = useState<"viewer" | "editor">("viewer");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [emailInviteRole, setEmailInviteRole] = useState("viewer");
  const [isInviting, setIsInviting] = useState(false);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(true);

  useEffect(() => {
    if (open) {
      fetchCollaborators();
    }
  }, [open, tripId]);

  const fetchCollaborators = async () => {
    setLoadingCollaborators(true);
    try {
      const { data, error } = await supabase
        .from('trip_collaborators')
        .select(`
          id,
          user_id,
          role,
          profiles!inner (
            email,
            display_name
          )
        `)
        .eq('trip_id', tripId);

      if (error) throw error;
      setCollaborators(data as any);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    } finally {
      setLoadingCollaborators(false);
    }
  };

  const generateInviteLink = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-invite-link', {
        body: { tripId, role: inviteRole }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }
      
      setInviteCode(data.inviteCode);
      toast({
        title: "Invite link created!",
        description: `Share this link to invite ${inviteRole}s`,
      });
    } catch (error) {
      console.error('Error generating invite link:', error);
      toast({
        title: "Failed to create invite link",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/invite/${inviteCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied!",
      description: "Share it with your flock",
    });
  };

  const inviteCollaborator = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      const { data, error } = await supabase.functions.invoke('invite-collaborator', {
        body: { tripId, email: inviteEmail, role: emailInviteRole }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }
      
      toast({
        title: "Invite sent!",
        description: `${inviteEmail} has been added as ${emailInviteRole}`,
      });
      setInviteEmail("");
      fetchCollaborators();
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      const errorMessage = error instanceof Error ? error.message : "Could not send invitation";
      toast({
        title: "Invite failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const removeCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from('trip_collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;

      toast({
        title: "Collaborator removed",
        description: "User removed from trip",
      });
      fetchCollaborators();
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Failed to remove collaborator",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const inviteUrl = inviteCode ? `${window.location.origin}/invite/${inviteCode}` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Migration 🦆</DialogTitle>
          <DialogDescription>
            Invite collaborators with view or edit access
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Invite Link</TabsTrigger>
            <TabsTrigger value="email">By Email</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkRole">Access Level</Label>
              <Select value={inviteRole} onValueChange={(val) => setInviteRole(val as "viewer" | "editor")}>
                <SelectTrigger id="linkRole">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer - Can view itinerary</SelectItem>
                  <SelectItem value="editor">Editor - Can edit itinerary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!inviteCode ? (
              <div className="text-center py-6">
                <Button onClick={generateInviteLink} disabled={isGenerating} variant="hero">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Invite Link"}
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Shareable Link</Label>
                  <div className="flex gap-2">
                    <Input value={inviteUrl} readOnly className="font-mono text-sm" />
                    <Button onClick={copyLink} variant="outline" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold mb-1">
                        {inviteRole === "viewer" ? "View Access" : "Edit Access"}
                      </p>
                      <p className="text-muted-foreground">
                        {inviteRole === "viewer" 
                          ? "Anyone with this link can view your trip" 
                          : "Anyone with this link can edit your trip"}
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setInviteCode("")} 
                  variant="outline" 
                  className="w-full"
                >
                  Generate New Link
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="friend@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailRole">Role</Label>
                <Select value={emailInviteRole} onValueChange={setEmailInviteRole}>
                  <SelectTrigger id="emailRole">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Can view itinerary</SelectItem>
                    <SelectItem value="editor">Editor - Can edit itinerary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={inviteCollaborator} 
                disabled={isInviting || !inviteEmail.trim()}
                className="w-full"
                variant="hero"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isInviting ? "Sending invite..." : "Send Invite"}
              </Button>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="font-semibold mb-1">Direct invite</p>
                    <p className="text-muted-foreground">User must have a GaggleGO account with this email</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <div className="space-y-2">
              <Label>Current Collaborators</Label>
              {loadingCollaborators ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : collaborators.length === 0 ? (
                <p className="text-sm text-muted-foreground">No collaborators yet</p>
              ) : (
                <div className="space-y-2">
                  {collaborators.map((collab) => (
                    <div key={collab.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {collab.profiles.display_name || collab.profiles.email}
                        </p>
                        <p className="text-xs text-muted-foreground">{collab.profiles.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {collab.role}
                        </Badge>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeCollaborator(collab.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};