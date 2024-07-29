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
    });


    describe('verifyJwt', () => {
        it('should call next if token is valid', () => {
            const userId = new mongoose.Types.ObjectId().toString();
            const token = jwt.sign({ id: userId }, process.env.JWT_KEY);
            const request = { headers: { authorization: `Bearer ${token}` } };
            const response = {};
            const next = jest.fn();

            verifyJwt(request, response, next);

            expect(request.userId).toBe(userId);
            expect(next).toHaveBeenCalled();
        });

        it('should return an error if no token is provided', () => {
            const request = { headers: {} };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            verifyJwt(request, response, next);

            expect(response.status).toHaveBeenCalledWith(401);
            expect(response.json).toHaveBeenCalledWith({
                message: "Authentication token is required"
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return an error if the token provided is invalid', () => {
            const request = { headers: { authorization: 'Bearer invalid-token'} };
            const response = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            verifyJwt(request, response, next);

            expect(response.status).toHaveBeenCalledWith(401);
            expect(response.json).toHaveBeenCalledWith({
                message: "Invalid token"
            });
            expect(next).not.toHaveBeenCalled();
        });
    });



});