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
    const { location, families, noGiftShop, date } = await req.json();
    
    console.log('Generating itinerary for:', { location, families, noGiftShop, date });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Extract all family members and their constraints
    const allMembers = families.flatMap((f: any) => f.members || []);
    const napTimes = allMembers
      .filter((m: any) => m.napTime)
      .map((m: any) => `${m.name} (${m.type}, age ${m.age || 'unknown'}) has nap time at ${m.napTime}`);
    
    const allDietaryRestrictions = families.flatMap((f: any) => f.dietary || []);
    const uniqueDietary = [...new Set(allDietaryRestrictions)].filter(d => d !== 'None');

    // Build constraint description
    const napConstraint = napTimes.length > 0 
      ? `CRITICAL NAP ANCHOR: ${napTimes.join('; ')}. The 1:00 PM slot MUST be reserved for naps/quiet time. The entire schedule must warp around this hard-locked anchor point.`
      : 'No specific nap times required, but consider a mid-day rest period around 1:00 PM for young children.';

    const dietaryConstraint = uniqueDietary.length > 0
      ? `DIETARY INTERSECTION RULE: All dining suggestions must accommodate ALL of these restrictions simultaneously: ${uniqueDietary.join(', ')}. Use the "Least Common Denominator" approach - restaurants must be safe for everyone.`
      : 'No specific dietary restrictions.';

    const giftShopMode = noGiftShop 
      ? 'GIFT SHOP AVOIDANCE: User has disabled Gift Shop Mode. Route the itinerary to minimize exposure to high-commercial zones. Alert with "Warning: High commercial exposure zone" if unavoidable.'
      : 'Standard routing (Gift Shop Mode ON).';

    const systemPrompt = `You are an expert family travel planner for "GaggleGO" - The Village v2.0, powered by a sophisticated Constraint Solver Engine.

CORE ARCHITECTURE - Location-First Context Engine:
Analyze the location "${location}" to determine:
1. Topology: Single-gate venue (zoo, theme park) vs. open city
2. Vibe: Educational / High Energy / Relaxed
3. Facilities: Quiet Zones, Stroller Parking, Nursing Rooms
4. Known tourist traps and high-commercial areas

CONSTRAINT SOLVER RULES (MANDATORY):
1. ${napConstraint}
2. ${dietaryConstraint}
3. PACING CALCULATIONS: Buffer all walking times by 20% to account for toddlers and elderly family members. Never assume standard adult walking pace.
4. ${giftShopMode}

FAMILY CONTEXT:
${families.map((f: any, i: number) => `
Family ${i + 1}: "${f.name}"
Members: ${f.members?.map((m: any) => `${m.name} (${m.type}, age ${m.age || 'unknown'})`).join(', ') || 'No members listed'}
Dietary: ${f.dietary?.join(', ') || 'None'}
`).join('\n')}

EXTERNAL CONNECTIVITY REQUIREMENT:
Every activity and dining suggestion MUST include actionable external links:
- Activities: Direct links to official websites, ticket pages, or booking systems
- Dining: Links to menus and reservation systems
Use search query format: [Location] + [Activity/Restaurant Name]

OUTPUT FORMAT (JSON):
Return a JSON array of 5-7 itinerary items with this structure:
{
  "time": "9:00 AM",
  "title": "Activity Name",
  "description": "Detailed description with practical tips for families",
  "type": "activity|meal|nap|travel",
  "link": "https://actual-link-to-activity-or-menu",
  "constraints": ["Relevant tags like 'Stroller-friendly', 'GF available', 'Nap anchor', 'Low energy']"
}

Generate a complete day itinerary for ${date || 'the trip date'} at ${location}.`;

    console.log('Calling Lovable AI...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a detailed family-friendly itinerary for ${location} that satisfies all constraints.` }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content returned from AI');
    }

    console.log('AI Response:', content);

    // Extract JSON from the response (might be wrapped in markdown code blocks)
    let itineraryItems;
    try {
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\[[\s\S]*\]/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      itineraryItems = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      throw new Error('Failed to parse itinerary data');
    }

    if (!Array.isArray(itineraryItems)) {
      throw new Error('Invalid itinerary format');
    }

    console.log('Successfully generated itinerary with', itineraryItems.length, 'items');

    return new Response(
      JSON.stringify({ items: itineraryItems }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-itinerary:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
