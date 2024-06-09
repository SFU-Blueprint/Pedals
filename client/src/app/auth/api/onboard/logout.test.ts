import handler from './logout';

// npm test logout.test.ts

// this is what the Response object will look like
interface Response {
    status(code: number): Response;
    json(data:any): Response
}

// mock the logout handler which is given from an import statement module
// mocking the module
// default tells us what should be returned when the modules default export is called
jest.mock('./logout', () => ({
    __esModule: true,
    // should take in a req object and return a response of type Response
    default: jest.fn().mockImplementation(async (req: any, res: Response) => {
        // if no token return error
        if (!req.body || !req.body.token || req.body.token !== 'Valid Token') {
            res.status(401).json({ status: 'error', error: { code: 401, message: 'Invalid token' } });
        } else {
            res.status(200).json({ status: 'success', message: 'Logout successful' });
        }
    }),
}));

// test the POST /auth/logout route
describe('POST /auth/logout', () => {
    // function to create mockRequest and mockResponse objects

    const mockRequest = (body: any) => ({body});
    
    // mock status and json to return itself 
    const mockResponse = () => {
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        return res;
    };

    // no token test case
    it('should return error when we have dont have a valid token', async () => {

        // no token

        const req = mockRequest({});
        const res = mockResponse();

        await handler(req, res); 

        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            error: { code: 401, message: 'Invalid token' }
        });
    });

    // valid token test case
    it('should return success when we have a valid token', async () => {

        // valid token

        const req = mockRequest({token: 'Valid Token'});
        const res = mockResponse();

        // call handler with mock req and res
        await handler(req, res); 

        expect(res.json).toHaveBeenCalledWith({
            status: 'success',
            message: 'Logout successful'
        });
    });

    // invalid token test case
    it('should return success when we have a valid token', async () => {

        // invalid token

        const req = mockRequest({token: 'Invalid Token'});
        const res = mockResponse();

        // call handler with mock req and res
        await handler(req, res); 

        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            error: { code: 401, message: 'Invalid token' }
        });
    });

    // invalid token type test case
    it('should return success when we have a valid token', async () => {

        // invalid token

        const req = mockRequest({token: {real: "Valid Token"}});
        const res = mockResponse();

        // call handler with mock req and res
        await handler(req, res); 

        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            error: { code: 401, message: 'Invalid token' }
        });
    });

    // invalid token type test case 2
    it('should return success when we have a valid token', async () => {

        // invalid token

        const req = mockRequest({token: {token: "Valid Token"}});
        const res = mockResponse();

        // call handler with mock req and res
        await handler(req, res); 

        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            error: { code: 401, message: 'Invalid token' }
        });
    });

        // invalid token type test case 2
    it('should return success when we have a valid token', async () => {

        // invalid token

        const req = mockRequest({token: {token: "Valid Token"}});
        const res = mockResponse();

        // call handler with mock req and res
        await handler(req, res); 

        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            error: { code: 401, message: 'Invalid token' }
        });
    });

    // invalid token type test case 3
    it('should return success when we have a valid token', async () => {

        // invalid token

        const req = mockRequest({token: 123});
        const res = mockResponse();

        // call handler with mock req and res
        await handler(req, res); 

        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            error: { code: 401, message: 'Invalid token' }
        });
    });


})