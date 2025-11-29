import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GooseStatusCard } from "@/components/GooseStatusCard";
import { AnimatedGoose } from "@/components/AnimatedGoose";

export default function InviteClaim() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const claimInvite = async () => {
      if (authLoading) return;

      if (!user) {
        // Not logged in, redirect to auth with return URL
        const returnUrl = encodeURIComponent(`/invite/${inviteCode}`);
        navigate(`/auth?redirect=/invite/${inviteCode}`);
        return;
      }

      if (!inviteCode) {
        setError("Invalid invite link");
        return;
      }

      setClaiming(true);

      try {
        const { data, error: inviteError } = await supabase.functions.invoke('claim-invite', {
          body: { inviteCode }
        });

        if (inviteError) throw inviteError;

        if (data.error) {
          throw new Error(data.error);
        }

        toast({
          title: "Invite accepted!",
          description: `You've joined the trip as a ${data.role}`,
        });

        // Redirect to the trip
        navigate(`/plan?tripId=${data.tripId}`);
      } catch (err) {
        console.error('Error claiming invite:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to claim invite';
        setError(errorMessage);
        toast({
          title: "Failed to join trip",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setClaiming(false);
      }
    };

    claimInvite();
  }, [inviteCode, user, authLoading, navigate, toast]);

  if (authLoading || claiming) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <GooseStatusCard
          title="Joining the flock..."
          estimatedSeconds={5}
          messages={[
            "Validating invite code...",
            "Adding you to the trip...",
            "Setting up your access...",
            "Almost there!"
          ]}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AnimatedGoose size="lg" />
            </div>
            <CardTitle>Unable to Join Trip</CardTitle>
            <CardDescription className="text-destructive mt-2">
              {error}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/')} variant="default">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}