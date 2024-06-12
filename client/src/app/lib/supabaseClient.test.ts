describe("Supabase Client", () => {
  beforeEach(() => {
    jest.resetModules(); // Clears the cache to ensure the environment variables are reset for each test
  });

  const loadSupabaseClient = async () => {
    const supabaseModule = await import("./supabaseClient");
    return supabaseModule.default;
  };

  it("should create a Supabase client with the correct URL and anon key", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL =
      "https://your-supabase-url.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "your-supabase-anon-key";

    const supabase = await loadSupabaseClient();

    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });

  it("should throw an error if Supabase URL or anon key is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    await expect(loadSupabaseClient()).rejects.toThrow(
      "Missing Supabase URL or anon key"
    );
  });
});
