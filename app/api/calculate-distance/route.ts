// Driving distance store → customer and local delivery cost (Google Distance
// Matrix + Place Details). Runs on the site's own server; the Maps key never
// reaches the browser.

export const dynamic = "force-dynamic";

const MAX_MILES = 90;

// Amorelia: first 10 miles $30, each extra mile $1.60.
function calculateCost(miles: number): number {
  if (miles <= 0) return 0;
  if (miles <= 10) return 30;
  return Math.round((30 + (miles - 10) * 1.6) * 100) / 100;
}

interface StructuredAddress {
  address1: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

async function fetchPlaceDetails(placeId: string, apiKey: string): Promise<StructuredAddress | null> {
  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", "address_component");
    url.searchParams.set("key", apiKey);

    const data = await fetch(url.toString()).then((r) => r.json());
    if (data.status !== "OK" || !data.result?.address_components) {
      console.error("Place Details error:", data.status);
      return null;
    }

    const components = data.result.address_components as Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    const get = (type: string, useShort = false) => {
      const comp = components.find((c) => c.types.includes(type));
      return comp ? (useShort ? comp.short_name : comp.long_name) : "";
    };

    return {
      address1: [get("street_number"), get("route")].filter(Boolean).join(" "),
      city: get("locality") || get("sublocality") || get("administrative_area_level_2"),
      province: get("administrative_area_level_1", true),
      zip: get("postal_code"),
      country: get("country", true),
    };
  } catch (err) {
    console.error("Place Details fetch error:", err);
    return null;
  }
}

function mapImagePath(origin: string, destination: string): string {
  return `/api/map-image?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
}

export async function POST(req: Request) {
  try {
    const { street, city, zip, fullAddress, placeId } = await req.json();
    const storeAddress = process.env.STORE_ADDRESS || "";

    const destination: string | null =
      fullAddress || (street && city ? `${street}, ${city}, FL ${zip || ""}`.trim() : null);

    if (!destination) {
      return Response.json({ error: "Faltan campos de dirección" }, { status: 400 });
    }
    // Length cap protects the paid Google APIs from oversized input.
    if (destination.length > 300 || (placeId && String(placeId).length > 300)) {
      return Response.json({ error: "Dirección demasiado larga" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "Google Maps API key not configured" }, { status: 500 });
    }

    const url = new URL("https://maps.googleapis.com/maps/api/distancematrix/json");
    url.searchParams.set("origins", storeAddress);
    url.searchParams.set("destinations", destination);
    url.searchParams.set("units", "imperial");
    url.searchParams.set("key", apiKey);

    const [distanceResponse, structuredAddress] = await Promise.all([
      fetch(url.toString()).then((r) => r.json()),
      placeId ? fetchPlaceDetails(placeId, apiKey) : Promise.resolve(null),
    ]);

    if (distanceResponse.status !== "OK") {
      console.error("Distance Matrix API error status:", distanceResponse.status);
      return Response.json({ error: "Servicio no disponible temporalmente" }, { status: 502 });
    }

    const element = distanceResponse.rows?.[0]?.elements?.[0];
    if (!element || element.status !== "OK") {
      return Response.json(
        { error: "No se pudo calcular la distancia. Verifica la dirección.", elementStatus: element?.status },
        { status: 400 },
      );
    }

    const miles = Math.ceil(element.distance.value / 1609.344);
    const mapUrl = mapImagePath(storeAddress, destination);

    if (miles > MAX_MILES) {
      return Response.json({
        error: `La dirección está a ${miles} millas. El máximo de entrega es ${MAX_MILES} millas.`,
        miles,
        tooFar: true,
        structuredAddress: structuredAddress || null,
        destination,
        mapImageUrl: mapUrl,
      });
    }

    return Response.json({
      miles,
      cost: calculateCost(miles),
      duration: element.duration.text,
      destination,
      tooFar: false,
      mapUrl,
      structuredAddress: structuredAddress || null,
    });
  } catch (err) {
    console.error("calculate-distance error:", err);
    return Response.json({ error: "Error procesando la solicitud" }, { status: 500 });
  }
}
