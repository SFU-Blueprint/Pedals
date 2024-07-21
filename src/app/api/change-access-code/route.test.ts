import { createMocks } from "node-mocks-http";
import { NextApiRequest } from "next/types";
import POST from "./route";

jest.mock("@supabase/supabase-js", () => ({
    createClient: jest.fn(() => ({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        update: jest.fn().mockResolvedValue({ data: [], error: null })
    }))
}));

describe("change-access-code API route", () => {
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

    it("should return 400 if new code and current code are the identical", async () => {
        req.method = "POST";
        req.headers = { "Content-Type": "application/json" };
        req.body = JSON.stringify({ newCode: "1234Abcd", currentCode: "1234Abcd" });

        const mockReq = {
            ...req,
            json: async () => ({ newCode: "1234Abcd", currentCode: "1234Abcd" })
        } as unknown as Request;

        const response = await POST(mockReq);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "New code must be different from the current code" });
    });

    it("should return 400 if new code does not meet requirements", async () => {
        req.method = "POST";
        req.headers = { "Content-Type": "application/json" };
        req.body = JSON.stringify({ newCode: "123", currentCode: "1234Abcd" });

        const mockReq = {
            ...req,
            json: async () => ({ newCode: "123", currentCode: "1234Abcd" })
        } as unknown as Request;

        const response = await POST(mockReq);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: "New code must be between 8 and 15 characters long, and contain at least one letter and one number" });
    });

})
