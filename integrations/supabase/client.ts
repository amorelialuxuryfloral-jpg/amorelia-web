/**
 * Supabase client — points at the self-owned project `amorelia`
 * (ref xjbvaedngxkuxkzzczfo). The Edge Functions (places-autocomplete,
 * calculate-distance, calculate-fedex-shipping, map-image) are deployed there;
 * secrets live in Supabase, never in this repo. The anon (publishable) key is
 * public-safe — it ships in the browser bundle — so it doubles as the fallback.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xjbvaedngxkuxkzzczfo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqYnZhZWRuZ3hrdXhrenpjemZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5NTA3NDgsImV4cCI6MjA5OTUyNjc0OH0.nVWmfMXBZqiWM2G-_EVva4XzRoMGtTg5uFT_ckjBPU4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // The storefront has no user auth — avoid touching localStorage on load.
    persistSession: false,
    autoRefreshToken: false,
  },
});
