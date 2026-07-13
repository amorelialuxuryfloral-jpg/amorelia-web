import { permanentRedirect } from "next/navigation";

/** SPA parity: /es/flower-delivery canonicalized to /es/envio-de-flores → real 301. */
export default function FlowerDeliveryEsRedirect() {
  permanentRedirect("/es/envio-de-flores");
}
