// Server-side proxy for Google Static Maps: the browser only ever gets a PNG,
// never the Maps key.

export const dynamic = "force-dynamic";

const MAX_LEN = 250;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const destination = (url.searchParams.get("destination") || "").trim();
    const origin = (url.searchParams.get("origin") || process.env.STORE_ADDRESS || "").trim();

    if (!destination || destination.length > MAX_LEN || origin.length > MAX_LEN) {
      return new Response("Bad Request", { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error("map-image: GOOGLE_MAPS_API_KEY not configured");
      return new Response("Service unavailable", { status: 500 });
    }

    const originEnc = encodeURIComponent(origin);
    const destEnc = encodeURIComponent(destination);
    const googleUrl =
      `https://maps.googleapis.com/maps/api/staticmap` +
      `?size=640x300&scale=2` +
      `&markers=color:0x2a3b24%7Clabel:A%7C${originEnc}` +
      `&markers=color:0x2a3b24%7Clabel:B%7C${destEnc}` +
      `&path=color:0x2a3b24cc%7Cweight:3%7C${originEnc}%7C${destEnc}` +
      `&key=${apiKey}`;

    const res = await fetch(googleUrl);
    if (!res.ok) {
      console.error("map-image: Google returned", res.status);
      return new Response("Map unavailable", { status: 502 });
    }
    return new Response(await res.arrayBuffer(), {
      status: 200,
      headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400" },
    });
  } catch (err) {
    console.error("map-image error:", err);
    return new Response("Internal error", { status: 500 });
  }
}
