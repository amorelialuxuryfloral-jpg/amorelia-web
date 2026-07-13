import { permanentRedirect } from "next/navigation";

/** EN index slug under /es → the ES canonical. */
export default function OccasionsEsRedirect() {
  permanentRedirect("/es/collections/ocasiones");
}
