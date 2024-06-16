// src/app/auth/api/register.test.ts

import { createMocks } from "node-mocks-http";
import dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import register from "./register";

// Load environment variables for testing
dotenv.config();

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockResolvedValue({ data: [], error: null })
  }))
}));

describe("/api/register", () => {
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

    await register(req, res);

    expect(res.statusCode).toBe(405);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({ error: "Method not allowed" });
  });

  it("returns 400 if required fields are missing", async () => {
    req.method = "POST";
    req.body = {
      name: "John Doe"
      // Missing dateOfBirth, pronoun, email
    };

    await register(req, res);

    expect(res.statusCode).toBe(400);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({ error: "Missing required fields" });
  });

  it("registers a user successfully", async () => {
    req.method = "POST";
    req.body = {
      name: "John Doe",
      dateOfBirth: "1990-01-01",
      pronoun: "he/him",
      email: "john.doe@example.com"
    };

    await register(req, res);

    expect(res.statusCode).toBe(201);
    // eslint-disable-next-line no-underscore-dangle
    expect(res._getJSONData()).toEqual({
      message: "User registered successfully",
      data: []
    });
  });
});
