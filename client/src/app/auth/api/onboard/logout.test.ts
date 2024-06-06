import { beforeEach, mock } from "node:test";
import handler from './logout';

// npm test logout.test.ts

interface Response {
    status(code: number): Response;
    json(data:any): Response
}

jest.mock('./logout', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(async (req: any, res: Response) => {
        if (!req.body || !req.body.token || req.body.token !== 'Valid Token') {
            res.status(401).json({ status: 'error', error: { code: 401, message: 'Invalid token' } });
        } else {
            res.status(200).json({ status: 'success', message: 'Logout successful' });
        }
    }),
}));

describe('POST /auth/logout', () => {
    const mockRequest = () => ({});
    const mockResponse = () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        return res;
    };

    it('should return error when we have dont have a valid token', async () => {

        // no token

        const req = mockRequest();
        const res = mockResponse();

        await handler(req, res); 

        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            error: { code: 401, message: 'Invalid token' }
        });
    });


})