import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tripId, email, role } = await req.json();
    
    if (!tripId || !email || !role) {
      throw new Error('Trip ID, email, and role are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the requesting user owns this trip
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('user_id')
      .eq('id', tripId)
      .single();

    if (tripError || trip.user_id !== user.id) {
      throw new Error('You do not have permission to invite collaborators to this trip');
    }

    // Look up user by email
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .ilike('display_name', email) // Assuming display_name might contain email
      .limit(1);

    if (profileError) {
      console.error('Profile lookup error:', profileError);
    }

    // For now, we'll just log the invite since we don't have email column in profiles
    // In production, you'd want to send an email notification or use a proper user lookup
    console.log('Invite request:', { tripId, email, role, requestedBy: user.id });

    // If we found a user, add them as collaborator
    if (profiles && profiles.length > 0) {
      const { error: collaboratorError } = await supabase
        .from('trip_collaborators')
        .insert({
          trip_id: tripId,
          user_id: profiles[0].id,
          role: role
        });

      if (collaboratorError) {
        // Check if already exists
        if (collaboratorError.code === '23505') {
          throw new Error('User is already a collaborator on this trip');
        }
        throw collaboratorError;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: profiles && profiles.length > 0 
          ? 'Collaborator added successfully' 
          : 'Invite logged (user lookup by email not fully implemented)'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in invite-collaborator:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
