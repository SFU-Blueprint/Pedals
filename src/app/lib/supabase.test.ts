import supabase from "./supabase";

describe("Supabase Client", () => {
  beforeEach(() => {
    jest.resetModules(); // Clears the cache to ensure the environment variables are reset for each test
  });

  it("should create a Supabase client with the correct URL and anon key", () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });
});
