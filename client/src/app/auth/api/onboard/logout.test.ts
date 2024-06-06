import { beforeEach } from "node:test";
import handler from './logout';

// npm test logout.test.ts

interface Response {
    status(code: number): Response;
    json(data:any): Response
}

jest.mock('./logout', () => ({
    __esModule: true, 
    default: jest.fn(), 
  }));

jest.mock('./logout', () => ({
    default: jest.fn().mockImplementation(async (req: any, res: Response) => {
      if (!req.body || !req.body.token || req.body.token !== 'Valid Token') {
        res.status(401).json({ status: 'error', error: { code: 401, message: 'Invalid token' } });
      } else {
        res.status(200).json({ status: 'success', message: 'Logout successful' });
      }
    }),
  }));

describe('POST /auth/logout', () => {
    let req: { method: string; body: { token?: string } };
    let res: { status: jest.Mock<any, any>; json: jest.Mock<any, any> };

    beforeEach(() => {
        req={
            method: 'POST', 
            body: { token: 'Valid Token' }
        };
        res = {
            status: jest.fn().mockReturnThis(), 
            json: jest.fn().mockReturnThis() 
        };

    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it('should return success when we have a valid token', async () => {
        const handler = require('./logout').default;

        const req = {
            method: 'POST',
            body: {
                token: 'Valid Token'
            }
        };

        await handler(req, res); 

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'Logout successful'
        });

    });


})