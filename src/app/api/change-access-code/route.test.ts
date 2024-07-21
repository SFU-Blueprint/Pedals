import { createMocks } from "node-mocks-http";
import { NextApiRequest } from "next/types";
import POST from "./route";

jest.mock("@/lib/supabase", () => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    update: jest.fn()
}));

describe("Code Change API Route", () => {
    let req: NextApiRequest;

    beforeEach(() => {
        const { req: mockReq } = createMocks();
        req = mockReq as unknown as NextApiRequest;
    });

    it("should return 400 if currCode or newCode is missing", async () => {
        const mockReq = {
            ...req,
            json: async () => ({})
        } as unknown as Request;

        const response = await POST(mockReq);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
            error: "Current and New Code are required"
        });
    });

    it("should return 400 if currCode and newCode are the same", async () => {
        const mockReq = {
            ...req,
            json: async () => ({ currCode: "sameCode", newCode: "sameCode" })
        } as unknown as Request;

        const response = await POST(mockReq);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
            error: "Current and New Code cannot be the same"
        });
    });

    it("should return 400 if newCode does not meet length and character requirements", async () => {
        const mockReq = {
            ...req,
            json: async () => ({ currCode: "currCode123", newCode: "short" })
        } as unknown as Request;

        const response = await POST(mockReq);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({
            error: "New Code must be between 8 and 15 characters long, and contain at least one letter and one number"
        });
    });
});
