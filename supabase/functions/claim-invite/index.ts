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
    const { inviteCode } = await req.json();
    
    console.log('Claiming invite with code:', inviteCode);

    if (!inviteCode) {
      throw new Error('Missing inviteCode');
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

    // Get the invite
    const { data: invite, error: inviteError } = await supabase
      .from('trip_invites')
      .select('*')
      .eq('invite_code', inviteCode)
      .single();

    if (inviteError || !invite) {
      console.error('Invite not found:', inviteError);
      throw new Error('Invalid invite code');
    }

    // Check if invite is already claimed
    if (invite.claimed_by) {
      throw new Error('Invite already claimed');
    }

    // Check if invite is expired
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      throw new Error('Invite expired');
    }

    console.log('Invite valid, adding user to collaborators...');

    // Check if user is already a collaborator
    const { data: existingCollab } = await supabase
      .from('trip_collaborators')
      .select('id')
      .eq('trip_id', invite.trip_id)
      .eq('user_id', user.id)
      .single();

    if (existingCollab) {
      console.log('User already a collaborator, updating role...');
      // Update existing role
      const { error: updateError } = await supabase
        .from('trip_collaborators')
        .update({ role: invite.role })
        .eq('id', existingCollab.id);

      if (updateError) {
        console.error('Error updating collaborator:', updateError);
        throw updateError;
      }
    } else {
      console.log('Adding user as new collaborator...');
      // Add new collaborator
      const { error: collabError } = await supabase
        .from('trip_collaborators')
        .insert({
          trip_id: invite.trip_id,
          user_id: user.id,
          role: invite.role,
        });

      if (collabError) {
        console.error('Error adding collaborator:', collabError);
        throw collabError;
      }
    }

    // Mark invite as claimed
    const { error: claimError } = await supabase
      .from('trip_invites')
      .update({
        claimed_by: user.id,
        claimed_at: new Date().toISOString(),
      })
      .eq('id', invite.id);

    if (claimError) {
      console.error('Error marking invite as claimed:', claimError);
    }

    console.log('Invite claimed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        tripId: invite.trip_id,
        role: invite.role 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in claim-invite:', error);
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