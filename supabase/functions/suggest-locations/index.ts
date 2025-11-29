import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latitude, longitude, cityName, locationQuery, activityType, families = [], tripDate } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context about the location
    const locationContext = locationQuery
      ? locationQuery
      : cityName 
      ? `near ${cityName} (coordinates: ${latitude}, ${longitude})`
      : `at coordinates ${latitude}, ${longitude}`;

    // Build family context
    let familyContext = "";
    if (families.length > 0) {
      const totalMembers = families.reduce((sum: number, f: any) => sum + (f.members?.length || 0), 0);
      const kids = families.flatMap((f: any) => f.members?.filter((m: any) => m.type === "kid") || []);
      const ages = kids.filter((k: any) => k.age).map((k: any) => k.age);
      const youngestAge = ages.length > 0 ? Math.min(...ages) : null;
      const nappers = kids.filter((k: any) => k.napTime).length;
      
      const dietaryRestrictions = [...new Set(
        families.flatMap((f: any) => f.dietary || []).filter((d: string) => d !== "None")
      )];

      familyContext = `
The group includes ${families.length} ${families.length === 1 ? "family" : "families"} with ${totalMembers} total members.
${youngestAge ? `Youngest child is ${youngestAge} years old.` : ""}
${nappers > 0 ? `${nappers} child${nappers > 1 ? "ren" : ""} need${nappers === 1 ? "s" : ""} nap time accommodations.` : ""}
${dietaryRestrictions.length > 0 ? `Dietary considerations: ${dietaryRestrictions.join(", ")}.` : ""}`;
    }

    // Build activity type context
    const activityTypeContext = activityType 
      ? `Focus primarily on ${activityType.split('_').join(' ')} options. ` 
      : '';

    const systemPrompt = `You are a family travel expert specializing in multi-family trips with young children. 
Your task is to suggest family-friendly destinations that are:
- Safe and accessible for families with toddlers and young children
- Have facilities for nap time and quiet spaces
- Not overly commercialized or tourist-trap-heavy
- Educational or entertaining for mixed age groups
- Have nearby dining options with diverse menus
- Age-appropriate for the youngest child in the group
- Accessible and practical for large groups

${activityTypeContext}

Return EXACTLY 5 suggestions as a JSON array. Each suggestion must have:
- name: The destination name (real, specific places only)
- description: A compelling 1-2 sentence description focusing on why it's perfect for this family group
- type: One of "theme_park", "zoo_aquarium", "museum", "nature_park", "beach", "playground", or "cultural_site"
- estimatedDistance: Approximate distance in miles from the user's location (e.g., "2.5 miles", "15 miles")

Format your response as valid JSON only, no other text.`;

    const userPrompt = `Suggest 5 family-friendly destinations ${locationContext} for a trip on ${tripDate}.${familyContext}

Prioritize places that:
1. Match the age range of the children
2. Have good facilities (restrooms, nursing areas, quiet zones)
3. Are known for being family-friendly with diverse dining nearby
4. Offer a mix of educational and fun experiences`;


    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let suggestions;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        suggestions = JSON.parse(content);
      }
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid response format from AI");
    }

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});