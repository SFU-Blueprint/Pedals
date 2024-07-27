import { POST } from "./route"; // Adjust the path as needed

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    auth: {
      signOut: jest.fn().mockResolvedValue({ error: null })
    }
  }))
}));

describe("logout API Route", () => {
  it("should return 200 and success message when logout is successful", async () => {
    const response = await POST();

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: "Successfully logged out"
    });
  });
});
