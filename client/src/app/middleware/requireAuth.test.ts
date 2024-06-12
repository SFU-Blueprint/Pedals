import { NextApiRequest, NextApiResponse } from "next";
import supabase from "../lib/supabaseClient";
import requireAuth from "./requireAuth";

jest.mock("../lib/supabaseClient", () => ({
  __esModule: true,
  default: {
    auth: {
      getUser: jest.fn()
    }
  }
}));

describe("requireAuth middleware", () => {
  const mockReq = (headers = {}) => ({ headers }) as unknown as NextApiRequest;
  const mockRes = () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    return res as unknown as NextApiResponse;
  };

  it("should return 401 if no authorization header is present", async () => {
    const handler = jest.fn((req, res) =>
      res.status(200).json({ message: "success" })
    );
    const req = mockReq();
    const res = mockRes();

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: null
    });

    await requireAuth(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("should return 401 if token is invalid", async () => {
    const handler = jest.fn((req, res) =>
      res.status(200).json({ message: "success" })
    );
    const req = mockReq();
    const res = mockRes();

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: null },
      error: "Invalid token"
    });

    await requireAuth(handler)(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("should call handler if token is valid", async () => {
    const handler = jest.fn((req, res) =>
      res.status(200).json({ message: "success" })
    );
    const req = mockReq();
    const res = mockRes();

    (supabase.auth.getUser as jest.Mock).mockResolvedValue({
      data: { user: { id: "user_id" } },
      error: null
    });

    await requireAuth(handler)(req, res);

    expect(handler).toHaveBeenCalledWith(req, res);
  });
});
