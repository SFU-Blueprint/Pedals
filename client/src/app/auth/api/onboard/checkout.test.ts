import { createMocks } from "node-mocks-http";
import { NextApiRequest, NextApiResponse } from "next/types";
import checkout from "./checkout";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => {
    // from: jest.fn().mockReturnThis(),
    // insert: jest.fn().mockResolvedValue({
    // 	data: [],
    // 	error: null
    // })
  })
}));

describe("/api/checkout", () => {
  let req: NextApiRequest;
  // eslint-disable-next-line no-underscore-dangle
  let res: NextApiResponse & { _getJSONData: () => any };

  beforeEach(() => {
    const { req: mockReq, res: mockRes } = createMocks();

    req = mockReq as unknown as NextApiRequest;
    // eslint-disable-next-line no-underscore-dangle
    res = mockRes as unknown as NextApiResponse & { _getJSONData: () => any };
  });

  it("returns 405 if method is not POST", async () => {
    req.method = "GET";
    await checkout(req, res);
    //
    expect(res.statusCode).toBe(405);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      error: "Method not allowed"
    });
  });

  it("returns 400 if required fields are missing", async () => {
    req.method = "POST";
    req.body = {
      name: "John Doe"
      // Missing, email
    };

    await checkout(req, res);

    expect(res.statusCode).toBe(400);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({ error: "Email is required" });
  });
});
