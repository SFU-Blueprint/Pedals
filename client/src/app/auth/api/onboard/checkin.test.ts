import { createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next/types";
import checkin from "./checkin";

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

describe("/api/checkin", () => {
  let req: NextApiRequest;
  let res: NextApiResponse & { _getJSONData: () => any };

  beforeEach(() => {
    const { req: mockReq, res: mockRes } = createMocks();

    req = mockReq as unknown as NextApiRequest;
    res = mockRes as unknown as NextApiResponse & { _getJSONData: () => any };
  });

  it("returns 405 if method is not POST", async () => {
    req.method = "GET";
    await checkin(req, res);

    expect(res.statusCode).toBe(405);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      error: "Method not allowed"
    });
  });

  it("returns 400 if required fields are missing", async () => {
    req.method = "POST";
    req.body = {
      email: "john.doe@example.com"
      // Missing shift_id
    };

    await checkin(req, res);

    expect(res.statusCode).toBe(400);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      error: "Email and Shift ID are required"
    });
  });

  // Add more tests as necessary to cover other scenarios
});
