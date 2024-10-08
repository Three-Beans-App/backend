const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { createJwt, validateJwt } = require('../src/utils/auth');

dotenv.config();

describe('Auth Utils', () => {
    let user;

    beforeAll(() => {
        user = {
            _id: "669fb799d22cf89ef1ba3307",
            admin: true
        };
    });


    describe('createJwt', () => {
        it('should create a valid JWT for a user', () => {
            const token = createJwt(user);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
        });

        it('should contain the correct payload', () => {
            const token = createJwt(user);
            const decoded = jwt.decode(token);
            expect(decoded.id).toBe(user._id);
            expect(decoded.admin).toBe(user.admin);
        });
    });
});