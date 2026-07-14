import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string" || input.length < 3 || input.length > 200) {
      return new Response(
        JSON.stringify({ predictions: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Google Maps API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Places API (New) — Autocomplete. The Amorelia Google Cloud project is
    // new, so the legacy Places API can't be enabled; we use the (New) endpoint.
    // Requires "Places API (New)" enabled + allowed on the API key.
    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify({
        input,
        includedRegionCodes: ["us"],
        // Miami bias so local addresses rank first. Places API (New) caps the
        // bias radius at 50,000 m (it's only a ranking bias, not a hard filter —
        // addresses beyond it still appear, just lower).
        locationBias: {
          circle: {
            center: { latitude: 25.7617, longitude: -80.1918 },
            radius: 50000,
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Places API (New) error:", response.status, JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "Servicio no disponible temporalmente" }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map the (New) response shape → the SAME shape the frontend already expects.
    const predictions = (data.suggestions || [])
      .map((s: any) => s.placePrediction)
      .filter(Boolean)
      .map((p: any) => ({
        placeId: p.placeId,
        description: p.text?.text || "",
        mainText: p.structuredFormat?.mainText?.text || "",
        secondaryText: p.structuredFormat?.secondaryText?.text || "",
      }));

    return new Response(
      JSON.stringify({ predictions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error("places-autocomplete error:", err);
    return new Response(
      JSON.stringify({ error: "Error interno" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
