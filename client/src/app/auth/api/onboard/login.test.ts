// login.test.ts
import login from "./login";

// Mock the global fetch function
global.fetch = jest.fn();

describe("login", () => {
  // For making sure that the fetch is cleared before each test
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  // Correct credentials
  it("should login successfully with correct credentials", async () => {
    const mockResponse = {
      data: { user: { id: "123" } },
      message: "Login successful"
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockResponse,
      ok: true,
      status: 200
    });

    const result = await login("test@example.com", "password123");
    expect(result).toEqual(mockResponse);
  });

  // Incorrect credentials
  it("should throw an error if login fails due to incorrect credentials", async () => {
    const mockResponse = {
      message: "Invalid credentials"
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => mockResponse
    });
    expect(() => login("test@example.com", "wrongpassword")).rejects.toThrow(
      "Invalid credentials"
    );
  });

  // Server error
  it("should throw an error if login fails due to server error", async () => {
    const mockResponse = {
      message: "Invalid credentials"
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => mockResponse
    });

    await expect(login("test@example.com", "password123")).rejects.toThrow(
      "Server error"
    );
  });
});
