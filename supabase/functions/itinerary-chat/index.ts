import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, location, currentItinerary, conversationHistory } = await req.json();
    
    console.log('Chat request:', { message, location, itineraryLength: currentItinerary?.length });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build conversation context
    const systemPrompt = `You are a friendly, helpful goose mascot for GaggleGO - a family travel planning app. Your personality:
- Enthusiastic and playful (use goose puns like "let's wing it!" or "honk if you're excited!")
- Expert at family travel logistics and constraint solving
- Understand nap schedules, dietary needs, meal preferences, nest/home base, pacing for families with kids
- Can modify itineraries based on user requests

Current trip context:
Location: ${location}
Current itinerary: ${JSON.stringify(currentItinerary, null, 2)}

When users ask to modify the schedule:
1. Acknowledge their request warmly
2. Explain what you're changing and why it works
3. Respect all constraints (naps, dietary, nest, meals)
4. If swapping restaurants, run DIETARY FIT RANKING PROTOCOL again
5. If you're making changes, respond with a JSON object wrapped in markdown code blocks containing:
   - "response": your friendly message
   - "updatedItinerary": the modified itinerary array (same format as current, including mealDetails if present)

Restaurant swap protocol:
- Ask what's wrong with current choice (time, dietary concern, budget, etc.)
- Suggest 2-3 alternatives
- Calculate new Dietary Fit Scores for each alternative
- Update itinerary with new choice

If you're just answering questions or the request doesn't require itinerary changes, just respond with friendly text.

Keep responses concise, warm, and goose-themed! Use emojis sparingly (🦆 is your signature).`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log('Calling Lovable AI...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.8,
        max_tokens: 6000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            response: "Honk! 🦆 I'm a bit overwhelmed right now. Please try again in a moment!",
            error: 'rate_limit' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            response: "Oops! 🦆 We need more flight fuel (credits). Please contact support!",
            error: 'credits_exhausted' 
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from AI');
    }

    console.log('AI Response length:', content.length);
    console.log('AI Response preview:', content.substring(0, 200));

    // Try to parse JSON if present (for itinerary updates)
    let result: any = { response: content };
    
    console.log('Attempting JSON parse...');
    try {
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1]);
        result = parsed;
        console.log('Successfully parsed JSON response');
      } else {
        // Check for incomplete/broken JSON blocks and strip them
        const brokenJsonMatch = content.match(/```json[\s\S]*/);
        if (brokenJsonMatch) {
          console.log('Detected broken JSON block, cleaning response');
          // Strip the broken JSON, keep only the text before it
          const cleanedContent = content.replace(/```json[\s\S]*/, '').trim();
          result = { 
            response: cleanedContent + "\n\n🦆 *Oops! I tried to update your itinerary but ran into a hiccup. Could you try that request again?*"
          };
        }
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Strip any broken JSON from the response
      const cleanedContent = content.replace(/```json[\s\S]*```?/g, '').trim();
      result = { 
        response: cleanedContent || "I had trouble processing that change. Could you try rephrasing your request?"
      };
    }

    if (!result.updatedItinerary) {
      console.log('No itinerary update parsed - response treated as text');
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in itinerary-chat:', error);
    return new Response(
      JSON.stringify({ 
        response: "Sorry, I had a little stumble there! 🦆 Could you try that again?",
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});