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

    // Look up user by email in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('email', email)
      .single();

    if (profileError || !profile) {
      console.log('User not found with email:', email);
      throw new Error('User not found. Make sure they have a GaggleGO account.');
    }

    console.log('Found user profile:', profile.id);

    // Check if user is already a collaborator
    const { data: existingCollab } = await supabase
      .from('trip_collaborators')
      .select('id')
      .eq('trip_id', tripId)
      .eq('user_id', profile.id)
      .single();

    if (existingCollab) {
      console.log('User already a collaborator, updating role...');
      // Update existing role
      const { error: updateError } = await supabase
        .from('trip_collaborators')
        .update({ role })
        .eq('id', existingCollab.id);

      if (updateError) {
        console.error('Error updating collaborator:', updateError);
        throw updateError;
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Collaborator role updated successfully'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add user as collaborator
    const { error: collaboratorError } = await supabase
      .from('trip_collaborators')
      .insert({
        trip_id: tripId,
        user_id: profile.id,
        role: role,
      });

    if (collaboratorError) {
      console.error('Error adding collaborator:', collaboratorError);
      throw collaboratorError;
    }

    console.log('Collaborator added successfully');

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Collaborator added successfully'
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
