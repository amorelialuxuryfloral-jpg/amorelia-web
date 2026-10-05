// Google Places (New) autocomplete for the delivery-address field. Runs on the
// site's own server so the Maps key never reaches the browser.

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string" || input.length < 3 || input.length > 200) {
      return Response.json({ predictions: [] });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Google Maps API key not configured" }, { status: 500 });
    }

    // Places API (New) — the Amorelia Google Cloud project can't enable the
    // legacy Places API.
    const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": apiKey },
      body: JSON.stringify({
        input,
        includedRegionCodes: ["us"],
        languageCode: "en",
        // Ranking bias only (capped at 50 km by the API); farther addresses still appear.
        locationBias: {
          circle: { center: { latitude: 25.7617, longitude: -80.1918 }, radius: 50000 },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Places API (New) error:", response.status, JSON.stringify(data));
      return Response.json({ error: "Servicio no disponible temporalmente" }, { status: 502 });
    }

    type Prediction = {
      placeId: string;
      text?: { text?: string };
      structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } };
    };
    const predictions = ((data.suggestions || []) as Array<{ placePrediction?: Prediction }>)
      .map((s) => s.placePrediction)
      .filter((p): p is Prediction => Boolean(p))
      .map((p) => ({
        placeId: p.placeId,
        description: p.text?.text || "",
        mainText: p.structuredFormat?.mainText?.text || "",
        secondaryText: p.structuredFormat?.secondaryText?.text || "",
      }));

    return Response.json({ predictions });
  } catch (err) {
    console.error("places-autocomplete error:", err);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}
