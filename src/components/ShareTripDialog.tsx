import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Link as LinkIcon, Mail, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ShareTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripId: string;
  shareCode?: string;
}

export const ShareTripDialog = ({ open, onOpenChange, tripId, shareCode: initialShareCode }: ShareTripDialogProps) => {
  const { toast } = useToast();
  const [shareCode, setShareCode] = useState(initialShareCode || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [isInviting, setIsInviting] = useState(false);

  const generateShareCode = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-share-code', {
        body: { tripId }
      });

      if (error) throw error;
      
      setShareCode(data.shareCode);
      toast({
        title: "Share link created!",
        description: "Anyone with this link can view your trip",
      });
    } catch (error) {
      console.error('Error generating share code:', error);
      toast({
        title: "Failed to create share link",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/trip/${shareCode}`;
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
        body: { tripId, email: inviteEmail, role: inviteRole }
      });

      if (error) throw error;
      
      toast({
        title: "Invite sent!",
        description: `${inviteEmail} has been invited as ${inviteRole}`,
      });
      setInviteEmail("");
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: "Invite failed",
        description: "Could not send invitation",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const shareUrl = shareCode ? `${window.location.origin}/trip/${shareCode}` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Migration 🦆</DialogTitle>
          <DialogDescription>
            Invite collaborators or create a public link
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="invite">Invite Collaborators</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            {!shareCode ? (
              <div className="text-center py-6">
                <Button onClick={generateShareCode} disabled={isGenerating} variant="hero">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Share Link"}
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Shareable Link</Label>
                  <div className="flex gap-2">
                    <Input value={shareUrl} readOnly className="font-mono text-sm" />
                    <Button onClick={copyLink} variant="outline" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-2">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 text-sm">
                      <p className="font-semibold mb-1">Anyone with the link can view</p>
                      <p className="text-muted-foreground">They won't be able to edit unless you add them as a collaborator</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Public View Only
                  </Badge>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="invite" className="space-y-4">
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
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger id="role">
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
                    <p className="font-semibold mb-1">Collaborative editing</p>
                    <p className="text-muted-foreground">Editors can modify the itinerary in real-time. Viewers can only see the trip.</p>
                  </div>
                </div>
              </div>
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