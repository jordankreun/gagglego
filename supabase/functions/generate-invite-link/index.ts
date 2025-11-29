import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tripId, role } = await req.json();
    
    console.log('Generating invite link for trip:', tripId, 'with role:', role);

    if (!tripId || !role) {
      throw new Error('Missing tripId or role');
    }

    if (!['viewer', 'editor'].includes(role)) {
      throw new Error('Invalid role. Must be viewer or editor');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Unauthorized');
    }

    console.log('Authenticated user:', user.id);

    // Verify user owns the trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('id, user_id')
      .eq('id', tripId)
      .single();

    if (tripError || !trip) {
      console.error('Trip not found:', tripError);
      throw new Error('Trip not found');
    }

    if (trip.user_id !== user.id) {
      throw new Error('Unauthorized: You do not own this trip');
    }

    console.log('User owns trip, generating invite code...');

    // Generate a unique invite code
    const inviteCode = crypto.randomUUID().split('-')[0] + crypto.randomUUID().split('-')[0];

    // Create the invite
    const { data: invite, error: inviteError } = await supabase
      .from('trip_invites')
      .insert({
        trip_id: tripId,
        invite_code: inviteCode,
        role: role,
        created_by: user.id,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      })
      .select()
      .single();

    if (inviteError) {
      console.error('Error creating invite:', inviteError);
      throw inviteError;
    }

    console.log('Invite created successfully:', invite.invite_code);

    return new Response(
      JSON.stringify({ inviteCode: invite.invite_code, role: invite.role }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-invite-link:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});