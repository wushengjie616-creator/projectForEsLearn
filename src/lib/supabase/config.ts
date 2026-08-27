export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY,
  );
}

export function getSupabaseConfig() {
  if (!isSupabaseConfigured()) return null;
  return {
    url: process.env.SUPABASE_URL!,
    secretKey: process.env.SUPABASE_SECRET_KEY!,
  };
}
