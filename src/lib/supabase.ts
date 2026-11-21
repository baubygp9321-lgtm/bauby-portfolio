import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Public (anon / publishable) client only. Never put a service-role key in frontend code.
 *
 * If the env vars are missing (e.g. a fresh local clone without .env) the public site still
 * renders with built-in content instead of crashing; the Admin dashboard reports that it is
 * not configured.
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

if (!supabase && import.meta.env.DEV) {
  console.info(
    "[portfolio] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY not set — using built-in content, Admin disabled.",
  );
}

export const CONTENT_TABLE = "portfolio_content";
export const CONTENT_ROW_ID = 1;
export const ASSET_BUCKET = "portfolio-assets";
