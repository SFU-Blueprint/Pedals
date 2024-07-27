import { createMocks } from "node-mocks-http";
import { NextApiRequest } from "next/types";
import { POST } from "./route"; // Adjust the path as needed

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis()
  }))
}));

describe("validate-access-code API Route", () => {
  let req: NextApiRequest;

  beforeEach(() => {
    const { req: mockReq } = createMocks();
    req = mockReq as unknown as NextApiRequest;
  });

  it("should return 400 if required fields are missing", async () => {
    req.method = "POST";
    req.headers = { "Content-Type": "application/json" };
    req.body = JSON.stringify({});

    const mockReq = {
      ...req,
      json: async () => ({})
    } as unknown as Request;

    const response = await POST(mockReq);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Missing required field" });
  });
});
