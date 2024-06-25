import { createMocks } from 'node-mocks-http';
import { NextApiRequest } from 'next/types';
import GET from './route';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { sid: 'user_id' }, error: null }),
    update: jest.fn().mockResolvedValue({ data: [], error: null }),
  })),
}));

describe('login API Route', () => {
  let req: NextApiRequest;

  beforeEach(() => {
    const { req: mockReq } = createMocks();
    req = mockReq as unknown as NextApiRequest;
  });

  it('should return 400 if userId is missing', async () => {
    req.url = 'http://localhost/api/login'; // ambiguous URL
    const mockReq = {
      ...req,
      json: async () => ({}),
    } as unknown as Request;

    const response = await GET(mockReq);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'User ID is required' });
  });

  it('should return 200 and user data if userId is provided', async () => {
    const userId = 'user_id';
    req.url = `http://localhost/api/login?userId=${userId}`;

    const mockReq = {
      ...req,
      json: async () => ({}),
    } as unknown as Request;

    const response = await GET(mockReq);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ user: { sid: userId } });
  });
});
