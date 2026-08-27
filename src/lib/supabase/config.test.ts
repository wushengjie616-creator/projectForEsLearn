import { afterEach, describe, expect, it, vi } from "vitest";

import { getSupabaseConfig, isSupabaseConfigured } from "./config";

describe("server-only Supabase configuration", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("requires the server URL and secret key", () => {
    vi.stubEnv("SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("SUPABASE_SECRET_KEY", "sb_secret_test");

    expect(isSupabaseConfigured()).toBe(true);
    expect(getSupabaseConfig()).toEqual({
      url: "https://project.supabase.co",
      secretKey: "sb_secret_test",
    });
  });

  it("does not treat a browser publishable key as server data access", () => {
    vi.stubEnv("SUPABASE_URL", "");
    vi.stubEnv("SUPABASE_SECRET_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");

    expect(isSupabaseConfigured()).toBe(false);
    expect(getSupabaseConfig()).toBeNull();
  });
});
