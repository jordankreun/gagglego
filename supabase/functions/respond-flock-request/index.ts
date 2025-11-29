import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.86.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { connectionId, action } = await req.json();

    if (!connectionId || !action || !['accept', 'reject'].includes(action)) {
      return new Response(JSON.stringify({ error: 'Invalid request parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`User ${user.email} ${action}ing flock request ${connectionId}`);

    // Verify the connection exists and user is the recipient
    const { data: connection, error: fetchError } = await supabase
      .from('flock_connections')
      .select('*')
      .eq('id', connectionId)
      .eq('friend_id', user.id)
      .eq('status', 'pending')
      .single();

    if (fetchError || !connection) {
      console.error('Connection fetch error:', fetchError);
      return new Response(JSON.stringify({ error: 'Connection request not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update the connection status
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    const { data: updated, error: updateError } = await supabase
      .from('flock_connections')
      .update({ status: newStatus })
      .eq('id', connectionId)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update connection' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If accepted, create notification for the requester
    if (action === 'accept') {
      const { data: responderProfile } = await supabase
        .from('profiles')
        .select('display_name, email')
        .eq('id', user.id)
        .single();

      const responderName = responderProfile?.display_name || responderProfile?.email || 'Someone';
      
      await supabase
        .from('notifications')
        .insert({
          user_id: connection.user_id,
          type: 'flock_request',
          title: '✅ Flock Request Accepted!',
          message: `${responderName} accepted your flock request`,
          link: `/profile`,
          metadata: { connectionId: connectionId, responderId: user.id },
        });
    }

    console.log(`Flock request ${action}ed successfully:`, connectionId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        connection: updated,
        message: `Flock request ${action}ed` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in respond-flock-request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});