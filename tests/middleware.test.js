const { validateObjectId, verifyJwt, verifyAdmin } = require('../src/utils/middleware');
const { UserModel } = require('../src/models/UserModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

describe('Middleware', () => {

    describe('validateObjectId', () => {
        it('should call next if ID is valid', () => {
            const request = { 
                params: { 
                    id: new mongoose.Types.ObjectId().toString() 
                }
            };
            const response = {};
            const next = jest.fn();

            validateObjectId(request, response, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return an error if ID is invalid', () => {
            const request = {
                params: {
                    id: 'invalidId'
                }
            };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            validateObjectId(request, response, next);

            expect(response.status).toHaveBeenCalledWith(400);
            expect(response.json).toHaveBeenCalledWith({
                message: "Invalid ID."
            });
            expect(next).not.toHaveBeenCalled();
        });
    })
});