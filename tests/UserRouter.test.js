const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { app } = require('../src/server');
const { UserModel } = require('../src/models/UserModel');
const { createJwt } = require('../src/utils/auth');


beforeAll(async () => {
    // Connect to a test database
    await mongoose.connect("mongodb://localhost:27017/testdb", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log('Connected to test database');
});

afterAll(async () => {
    // Clear database and close connection
    await UserModel.deleteMany({});
    await mongoose.connection.close();
    console.log('Disconnected from test database');
});


describe('User Routes', () => {
    let token;
    let user;

    beforeEach(async () => {
        // Clear database before each test
        await UserModel.deleteMany({});
        user = new UserModel({
            email: "test@email.com",
            password: "password",
            name: "Test User",
            birthday: new Date('1985-05-12')
        });
        await user.save();  
        token = createJwt(user);
    });
    


    describe("GET /users", () => {
        it('should return all users', async () => {
            const response = await request(app)
                .get("/users");
            expect(response.statusCode).toEqual(200);
            expect(response.body.result.length).toBe(1);
            expect(response.body.result[0].email).toBe("test@email.com");
        });
    });


    describe("POST /users/signup", () => {
        it('should create a new user', async () => {
            const response = await request(app)
                .post("/users/signup")
                .send({
                    email: "newuser@email.com",
                    password: "password",
                    name: "New Test User",
                    birthday: "1975-04-11"
                });
            expect(response.statusCode).toEqual(201);
            expect(response.body.message).toBe("Thank you for signing up to Three Beans New Test User!");
            expect(response.body.token).toBeDefined();
        });

        it('should not create a user with an existing email', async () => {
            const response = await request(app)
                .post("/users/signup")
                .send({
                    email: "test@email.com",
                    password: "password",
                    name: "Another User",
                    birthday: "2000-01-01"
                });
            expect(response.statusCode).toEqual(400);
            expect(response.body.message).toBe("A profile with this email already exists.");
        });
    });


    describe("POST /users/login", () => {
        it('should login with an existing user', async () => {
            const response = await request(app)
                .post("/users/login")
                .send({
                    email: "test@email.com",
                    password: "password"
                });
            expect(response.statusCode).toEqual(200);
            expect(response.body.message).toBe(`Test User has logged in successfully!`)
            expect(response.body.token).toBeDefined();
        });

        it('should not login with an incorrect password', async () => {
            const response = await request(app)
                .post("/users/login")
                .send({
                    email: "test@email.com",
                    password: "12345"
                });
            expect(response.statusCode).toEqual(401);
            expect(response.body.message).toBe("Your password is incorrect, please double check and try again.");
        });

        it('should not login with a non-existing email', async () => {
            const response = await request(app)
                .post("/users/login")
                .send({
                    email: "random@email.com",
                    password: "password"
                });
            expect(response.statusCode).toEqual(404);
            expect(response.body.message).toBe("Email not found.");
        });
    });


    describe("PATCH /users/update", () => {
        it('should update user profile data', async () => {
            const response = await request(app)
                .patch("/users/update")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    name: "Updated User",
                    email: "updated@email.com"
                });
            expect(response.statusCode).toEqual(200);
            expect(response.body.message).toBe("Profile updated successfully!");
            expect(response.body.token).toBeDefined();
        });

        it('should not update to an existing email', async () => {
            const hashedPassword = await bcrypt.hash('password', 10);
            await new UserModel({
                email: "existing@email.com",
                password: hashedPassword,
                name: "Existing User",
                birthday: new Date('2000-01-01')
            }).save();

            const response = await request(app)
                .patch("/users/update")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    email: "existing@email.com"
                });
            expect(response.statusCode).toEqual(400);
            expect(response.body.message).toBe("This email is already in use.");
        });
    });


    describe("DELETE /users/delete", () => {
        it('should delete a user profile', async () => {
            const response = await request(app)
                .delete("/users/delete")
                .set("Authorization", `Bearer ${token}`);
            expect(response.statusCode).toEqual(200);
            expect(response.body.message).toBe(`User Test User deleted successfully.`)
        });

        it('should not let an unauthorised user delete a profile', async () => {
            const response = await request(app)
                .delete("/users/delete")
                .set("Authorization", `Bearer invalidToken`);
            expect(response.statusCode).toEqual(401);
            expect(response.body.message).toBe("Invalid token");
        });

        it('should return a 404 for a non-existing user profile', async () => {
            const nonExistingUserToken = createJwt(new mongoose.Types.ObjectId());
            const response = await request(app)
                .delete("/users/delete")
                .set("Authorization", `Bearer ${nonExistingUserToken}`);
            expect(response.statusCode).toEqual(404)
            expect(response.body.message).toBe("User not found.")
        });
    });
});