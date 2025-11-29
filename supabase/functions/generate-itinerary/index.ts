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
    const { location, families, noGiftShop, youngestAge, startDate, endDate, durationDays, nestConfig, mealPreferences } = await req.json();
    
    console.log('Generating itinerary for:', { location, families, noGiftShop, youngestAge, startDate, endDate, durationDays, nestConfig, mealPreferences });

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

    const ageConstraint = youngestAge !== undefined
      ? `AGE-APPROPRIATE FILTERING: The youngest family member is ${youngestAge} years old. ALL activities and recommendations MUST be appropriate and safe for age ${youngestAge}+. Filter out activities with age restrictions above ${youngestAge}. Prioritize family-friendly activities that engage this age group. Consider attention spans, physical capabilities, and safety requirements for age ${youngestAge}.`
      : 'No specific age constraints provided - assume general family-friendly activities suitable for all ages.';

    const nestConstraint = nestConfig?.sharedAddress || nestConfig?.perFamilyAddresses
      ? `THE NEST ANCHOR: Home base is at "${nestConfig.sharedAddress || 'per-family addresses'}". 
     
CRITICAL NAP LOCATION RULE:
- ALL naps MUST occur at the Nest (home base) by default
- Naps are NOT optional - schedule must accommodate returning to nest for nap times
- ${nestConfig.allowCarNaps 
    ? 'CAR NAPS ALLOWED: Only if the drive is 2+ hours long. Mark these with "isCarNap": true and ensure travelTime shows at least "2 hr" duration. Do NOT allow car naps for shorter drives.'
    : 'CAR NAPS DISABLED: ALL naps must be at the Nest. Plan the schedule to return home for nap times.'}
- Include realistic travel times with 20% buffer for families
- Plan morning activities → Return to Nest for nap → Afternoon activities`
      : 'No home base specified - include rest/quiet time periods for young children.';

    const mealConstraint = mealPreferences
      ? `MEAL PLANNING:
- ${mealPreferences.mealCount} sit-down meals per day
- Lunch around: ${mealPreferences.preferredLunchTime}
${mealPreferences.preferredDinnerTime ? `- Dinner around: ${mealPreferences.preferredDinnerTime}` : ''}
- Budget level: ${mealPreferences.budgetLevel}
- Pack lunch: ${mealPreferences.packLunch ? 'Yes - suggest picnic spots instead of restaurants' : 'No - find restaurants'}
- Kid menu required: ${mealPreferences.kidMenuRequired}
- Highchairs needed: ${mealPreferences.highchairRequired}
- Quick service OK: ${mealPreferences.quickServiceOk}

DIETARY FIT RANKING PROTOCOL (CRITICAL):
For EVERY restaurant suggestion, you MUST calculate a Dietary Fit Score (0-100%):

Scoring factors:
1. Menu Coverage (30 points): How many items accommodate restrictions
2. Restriction Match (30 points): Direct accommodation vs modifications needed
3. Cross-Contamination (20 points): Dedicated prep areas, separate fryers
4. Staff Awareness (10 points): Kitchen trained on allergies/restrictions
5. Modification Flexibility (10 points): Willingness to customize dishes

Per-Restriction Rating (1-5 stars each):
Rate each dietary restriction individually with specific notes.

Grade Scale:
- A+ (95-100%): Perfect accommodation, verified safe
- A (90-94%): Excellent options, minimal risk
- B+ (85-89%): Good options, some caution needed
- B (80-84%): Adequate with modifications
- C (70-79%): Limited options, verify with staff
- D (60-69%): Risky, not recommended
- F (<60%): Cannot accommodate safely

ONLY suggest restaurants with 70%+ fit score. Flag any below 80% with warnings.

Output format for meals:
{
  "type": "meal",
  "mealDetails": {
    "mealType": "lunch|dinner|breakfast|snack",
    "restaurantName": "Name",
    "cuisine": "Type",
    "estimatedCost": "$|$$|$$$",
    "waitTime": "15-20 min",
    "menuLink": "https://...",
    "reservationLink": "https://...",
    "dietaryFit": {
      "overallScore": 92,
      "grade": "A",
      "perRestriction": [
        {"restriction": "Gluten Free", "stars": 5, "note": "Dedicated GF menu"},
        {"restriction": "Halal", "stars": 4, "note": "Halal chicken available"}
      ],
      "warnings": ["Shared fryer for fries - inform staff about allergies"]
    },
    "kidMenu": true,
    "highchairs": true,
    "changingTable": true,
    "outdoorSeating": false,
    "quickService": false
  }
}`
      : 'Standard meal planning - include 2-3 meal breaks.';

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
3. ${ageConstraint}
4. ${nestConstraint}
5. ${mealConstraint}
6. PACING CALCULATIONS: Buffer all walking times by 20% to account for toddlers and elderly family members. Never assume standard adult walking pace.
7. ${giftShopMode}

TRAVEL TIME CALCULATIONS:
- Include travel time between activities (walk/drive/stroller)
- Add "travelTime", "travelMode", "travelFromPrevious" fields to each item
- Mark items that return to nest with "returnsToNest": true
- If car naps allowed, mark long drives as "isCarNap": true

FAMILY CONTEXT:
${families.map((f: any, i: number) => `
Family ${i + 1}: "${f.name}"
Members: ${f.members?.map((m: any) => `${m.name} (${m.type}, age ${m.age || 'unknown'})`).join(', ') || 'No members listed'}
Dietary: ${f.dietary?.join(', ') || 'None'}
`).join('\n')}

OPTIMAL TIMING RESEARCH (CRITICAL):
Research and apply location-specific best visiting times:

ZOO/WILDLIFE PARKS:
- Morning (9-11 AM): Animals most active, cooler temps
- Avoid mid-day heat when animals hide/sleep
- Big cats and primates: Active in early morning
- Nocturnal houses: Anytime (controlled lighting)

THEME PARKS (Disney, Universal, etc.):
- Rope drop (opening): Shortest lines for popular rides
- 11 AM - 3 PM: Peak crowds, schedule meals/shows
- Evening (5-9 PM): Cooler, lines shorten, parades/fireworks
- Popular rides: First thing AM or last hour before close

MUSEUMS/INDOOR ATTRACTIONS:
- Opening time: Least crowded
- Weekday mornings: Quietest
- Save for hot afternoon hours or rainy weather
- Interactive exhibits: Earlier before kid energy drops

BEACHES/OUTDOOR:
- Mid-morning (9-11 AM): Before peak UV/heat
- Late afternoon (4-6 PM): Golden hour, cooler
- Avoid 12-3 PM: Peak sun exposure danger

RESTAURANTS:
- Lunch: 11:30 AM (beat rush) or 1:30 PM (after rush)
- Dinner: 5 PM (early bird) or 7:30 PM (after rush)
- Popular spots: Reservation essential

AQUARIUMS:
- Feeding times: Check schedule for active viewing
- Morning: Clearer tanks before stirred up
- Weekdays: Significantly less crowded

BOTANICAL GARDENS/NATURE:
- Early morning: Best photos, cooler, flowers freshest
- Avoid mid-day heat for walking

EXTERNAL CONNECTIVITY REQUIREMENT:
Every activity and dining suggestion MUST include actionable external links:
- Activities: Direct links to official websites, ticket pages, or booking systems
- Dining: Links to menus and reservation systems
Use search query format: [Location] + [Activity/Restaurant Name]

OUTPUT FORMAT (JSON):
Return a JSON array with 10-15 itinerary items PER DAY including:
- 4-6 activities/attractions per day
- 2-3 meal breaks
- Nap/rest periods as needed
- Travel transitions between locations

For a ${durationDays}-day trip, generate approximately ${durationDays * 12} total items.

Each item should have this structure:
{
  "time": "9:00 AM",
  "title": "Activity Name",
  "description": "Detailed description with practical tips for families",
  "type": "activity|meal|nap|travel",
  "link": "https://actual-link-to-activity-or-menu",
  "timingReason": "Explain why this time slot is optimal for this specific activity based on research above",
  "constraints": ["Relevant tags like 'Stroller-friendly', 'GF available', 'Nap anchor', 'Low energy']",
  "travelTime": "15 min",
  "travelMode": "walk|drive|stroller",
  "travelFromPrevious": true,
  "returnsToNest": false,
  "isCarNap": false,
  "mealDetails": { ... }, // Only for type: "meal"
  "day": 1 // Day number (1-indexed)
}

MULTI-DAY TRIP STRUCTURE:
This is a ${durationDays}-day trip from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}.

DAILY ACTIVITY MINIMUM:
- Morning block (9 AM - 12 PM): 2-3 activities at optimal times
- Afternoon block (2 PM - 5 PM): 2-3 activities
- Evening block (5 PM - 8 PM): 1-2 activities (if applicable)

Generate a FULL itinerary for ALL ${durationDays} days with ${durationDays * 12} total items:
- Day 1: Fresh energy - hit major attractions at their optimal visiting times
${durationDays > 1 ? `- Days 2-${durationDays - 1}: Vary pace, mix high/low energy activities` : ''}
${durationDays > 2 ? `- Final day: Lighter morning, allow travel buffer` : ''}

Research ${location} specifically to identify:
1. Must-see attractions and their best visiting windows
2. Hidden gems that families often miss
3. Logical geographic clustering to minimize travel
4. Time-specific events (feeding times, shows, parades)

Generate the complete ${durationDays}-day itinerary for ${location}.`;

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
        max_tokens: 4000,
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
