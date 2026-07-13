import { permanentRedirect } from "next/navigation";

/**
 * SPA parity: /envio-de-flores was mounted at root but canonicalized to
 * /flower-delivery. The SSR consolidates with a real 301.
 */
export default function EnvioDeFloresRootRedirect() {
  permanentRedirect("/flower-delivery");
}
