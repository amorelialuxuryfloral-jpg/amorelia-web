/**
 * Supabase client — points at the NEW self-owned project `amorelia`
 * (lkitpdcrgandtaxsjqub), NOT the old Lovable Cloud one. The 9 Edge Functions
 * (places-autocomplete, calculate-distance, calculate-fedex-shipping, …) are
 * deployed there; secrets live in Supabase, never in this repo.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xjbvaedngxkuxkzzczfo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // The storefront has no user auth — avoid touching localStorage on load.
    persistSession: false,
    autoRefreshToken: false,
  },
});
