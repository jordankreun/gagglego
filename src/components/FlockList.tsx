import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Check, X, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedGoose } from "@/components/AnimatedGoose";
import { BrandIcons } from "@/components/icons/BrandIcons";
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

interface FlockConnection {
  id: string;
  user_id: string;
  friend_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  profiles?: {
    email: string;
    display_name: string | null;
  };
}

export const FlockList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchEmail, setSearchEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [connections, setConnections] = useState<FlockConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  const fetchConnections = async () => {
    try {
      // Fetch sent connections
      const { data: sent, error: sentError } = await supabase
        .from('flock_connections')
        .select(`
          *,
          profiles:friend_id (
            email,
            display_name
          )
        `)
        .eq('user_id', user!.id);

      if (sentError) throw sentError;

      // Fetch received connections
      const { data: received, error: receivedError } = await supabase
        .from('flock_connections')
        .select(`
          *,
          profiles:user_id (
            email,
            display_name
          )
        `)
        .eq('friend_id', user!.id);

      if (receivedError) throw receivedError;

      const allConnections = [
        ...(sent || []).map(c => ({ ...c, type: 'sent' })),
        ...(received || []).map(c => ({ ...c, type: 'received' }))
      ];

      setConnections(allConnections as any);
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({
        title: "Failed to load flock",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendFlockRequest = async () => {
    if (!searchEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-flock-request', {
        body: { friendEmail: searchEmail.trim() }
      });

      if (error) throw error;

      if (data.error) {
        // Handle specific error cases
        if (data.error.includes("not found") || data.error.includes("No user")) {
          toast({
            title: "User not found",
            description: "No GaggleGO account exists with that email. Ask your friend to sign up first!",
            variant: "destructive",
          });
        } else if (data.error.includes("already exists") || data.error.includes("duplicate")) {
          toast({
            title: "Already connected",
            description: "You already have a connection with this user.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Failed to send request",
            description: data.error,
            variant: "destructive",
          });
        }
        return;
      }

      toast({
        title: "Flock request sent!",
        description: data.message || "Your request has been sent.",
      });
      setSearchEmail("");
      fetchConnections();
    } catch (error) {
      console.error('Error sending flock request:', error);
      toast({
        title: "Failed to send request",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const respondToRequest = async (connectionId: string, action: 'accept' | 'reject') => {
    try {
      const { data, error } = await supabase.functions.invoke('respond-flock-request', {
        body: { connectionId, action }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: action === 'accept' ? "Request accepted!" : "Request rejected",
        description: data.message,
      });
      fetchConnections();
    } catch (error) {
      console.error('Error responding to request:', error);
      toast({
        title: "Failed to respond",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const removeConnection = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('flock_connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Connection removed",
        description: "User removed from your flock",
      });
      fetchConnections();
    } catch (error) {
      console.error('Error removing connection:', error);
      toast({
        title: "Failed to remove",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const acceptedConnections = connections.filter(c => c.status === 'accepted');
  const pendingReceived = connections.filter(c => c.status === 'pending' && (c as any).type === 'received');
  const pendingSent = connections.filter(c => c.status === 'pending' && (c as any).type === 'sent');

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="p-6 border-2">
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 w-32" />
            </div>
          </div>
        </Card>
        <Card className="p-6 border-2">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add to Flock */}
      <Card className="p-6 border-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BrandIcons.Flock size={20} className="text-accent" />
              <h3 className="font-semibold text-lg">Add to Your Flock</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Connect with friends and family to coordinate trips together. Enter the email of someone who has a GaggleGO account.
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="friend@example.com"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendFlockRequest()}
            />
            <Button onClick={sendFlockRequest} disabled={isSending} variant="hero">
              <UserPlus className="w-4 h-4 mr-2" />
              {isSending ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </div>
      </Card>

      {/* Flock Tabs */}
      <Card className="p-6 border-2">
        <Tabs defaultValue="flock" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flock">
              My Flock ({acceptedConnections.length})
            </TabsTrigger>
            <TabsTrigger value="requests">
              Requests ({pendingReceived.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flock" className="mt-6 space-y-3">
            {acceptedConnections.length === 0 && pendingSent.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="flex justify-center">
                  <div style={{ width: 100, height: 100 }}>
                    <AnimatedGoose enableConstantAnimation={false} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-display font-semibold text-xl">Your Flock is Empty</h4>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Connect with friends and family who use GaggleGO. You'll be able to share trip plans, coordinate activities, and plan together!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {acceptedConnections.map((connection) => {
                  const profile = connection.profiles as any;
                  return (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <BrandIcons.Flock size={20} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {profile?.display_name || profile?.email || 'Unknown User'}
                          </p>
                          {profile?.display_name && (
                            <p className="text-xs text-muted-foreground">{profile?.email}</p>
                          )}
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove from flock?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove {profile?.display_name || profile?.email || 'this user'} from your flock. You can always send a new request later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeConnection(connection.id)} className="bg-destructive hover:bg-destructive/90">
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pending Sent - Show at top for visibility */}
            {pendingSent.length > 0 && acceptedConnections.length > 0 && (
              <div className="mb-6 pb-6 border-b space-y-3">
                <div className="flex items-center gap-2">
                  <BrandIcons.FlyingGoose size={16} className="text-muted-foreground" />
                  <h4 className="text-sm font-semibold text-muted-foreground">Pending Sent Requests</h4>
                </div>
                {pendingSent.map((connection) => {
                  const profile = connection.profiles as any;
                  return (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <BrandIcons.FlyingGoose size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {profile?.display_name || profile?.email || 'Unknown User'}
                          </p>
                          {profile?.display_name && (
                            <p className="text-xs text-muted-foreground">{profile?.email}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">Pending</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="mt-6 space-y-3">
            {pendingReceived.length === 0 ? (
              <div className="text-center py-12 space-y-4">
                <div className="flex justify-center">
                  <BrandIcons.NestingGoose size={60} className="text-muted-foreground/40" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold">No Pending Requests</h4>
                  <p className="text-sm text-muted-foreground">
                    When someone sends you a flock request, it will appear here.
                  </p>
                </div>
              </div>
            ) : (
              pendingReceived.map((connection) => {
                const profile = connection.profiles as any;
                return (
                  <div
                    key={connection.id}
                    className="flex items-center justify-between p-4 bg-accent/10 border-2 border-accent/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <BrandIcons.HatchingEgg size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {profile?.display_name || profile?.email || 'Unknown User'}
                        </p>
                        {profile?.display_name && (
                          <p className="text-xs text-muted-foreground">{profile?.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="hero"
                        size="sm"
                        onClick={() => respondToRequest(connection.id, 'accept')}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => respondToRequest(connection.id, 'reject')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};