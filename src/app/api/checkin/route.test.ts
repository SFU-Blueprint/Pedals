import { createMocks } from "node-mocks-http";
import { NextApiRequest } from "next/types";
import POST from "./route";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest
      .fn()
      .mockResolvedValue({ data: { sid: "user_id" }, error: null }),
    update: jest.fn().mockResolvedValue({ data: [], error: null })
  }))
}));

describe("Check-in API Route", () => {
  let req: NextApiRequest;

  beforeEach(() => {
    const { req: mockReq } = createMocks();
    req = mockReq as unknown as NextApiRequest;
  });

  it("should return 400 if email or shiftId is missing", async () => {
    const mockReq = {
      ...req,
      json: async () => ({})
    } as unknown as Request;

    const response = await POST(mockReq);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Email and Shift ID are required"
    });
  });
});
