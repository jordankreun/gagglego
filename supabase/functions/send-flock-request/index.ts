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

    const { friendEmail } = await req.json();

    if (!friendEmail) {
      return new Response(JSON.stringify({ error: 'Friend email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`User ${user.email} sending flock request to ${friendEmail}`);

    // Find the friend by email
    const { data: friendProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, display_name')
      .eq('email', friendEmail)
      .single();

    if (profileError || !friendProfile) {
      console.error('Profile lookup error:', profileError);
      return new Response(JSON.stringify({ error: 'User not found with that email' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (friendProfile.id === user.id) {
      return new Response(JSON.stringify({ error: 'Cannot add yourself to your flock' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check if connection already exists
    const { data: existing, error: checkError } = await supabase
      .from('flock_connections')
      .select('*')
      .or(`and(user_id.eq.${user.id},friend_id.eq.${friendProfile.id}),and(user_id.eq.${friendProfile.id},friend_id.eq.${user.id})`)
      .maybeSingle();

    if (checkError) {
      console.error('Check existing error:', checkError);
      return new Response(JSON.stringify({ error: 'Database error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (existing) {
      if (existing.status === 'pending') {
        return new Response(JSON.stringify({ error: 'Connection request already pending' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (existing.status === 'accepted') {
        return new Response(JSON.stringify({ error: 'Already in your flock' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Create the connection request
    const { data: connection, error: insertError } = await supabase
      .from('flock_connections')
      .insert({
        user_id: user.id,
        friend_id: friendProfile.id,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to send flock request' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Flock request sent successfully:', connection.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        connection,
        message: `Flock request sent to ${friendProfile.display_name || friendEmail}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-flock-request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});