import { permanentRedirect } from "next/navigation";

/** EN index slug under /es → the ES canonical. */
export default function FlowersEsRedirect() {
  permanentRedirect("/es/collections/flores");
}
