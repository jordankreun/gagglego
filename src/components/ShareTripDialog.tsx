import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, Link as LinkIcon, Mail } from "lucide-react";
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

  const shareUrl = shareCode ? `${window.location.origin}/trip/${shareCode}` : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Migration 🦆</DialogTitle>
          <DialogDescription>
            Create a shareable link so your family can view the itinerary
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};