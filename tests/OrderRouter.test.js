const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/server');
const { OrderModel } = require('../src/models/OrderModel');
const { ItemModel, CategoryModel } = require('../src/models/ItemModel');
const { UserModel } = require('../src/models/UserModel');
const { createJwt } = require('../src/utils/auth');


beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb4", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected to test database.");
});

afterAll(async () => {
    await OrderModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await ItemModel.deleteMany({});
    await UserModel.deleteMany({});
    await mongoose.connection.close();
});


describe('Order Router', () => {
    let adminToken;
    let userToken;
    let testOrder;
    let testCategory;
    let testItem;
    let testUser;
    
    beforeEach( async () => {
        await OrderModel.deleteMany({});
        await CategoryModel.deleteMany({});
        await ItemModel.deleteMany({});
        await UserModel.deleteMany({});

        const adminUser = new UserModel({
            name: "Admin User",
            email: "admin@test.com",
            password: "password",
            admin: true
        });
        await adminUser.save();
        adminToken = createJwt(adminUser);

        testUser = new UserModel({
            name: "Test User",
            email:"user@test.com",
            password: "password"
        });
        await testUser.save();
        userToken = createJwt(testUser);

        testCategory = new CategoryModel({ name: "Test Category" });
        await testCategory.save();

        testItem = new ItemModel({
            name: "Test Item",
            category: testCategory._id,
            price: 5.99
        });
        await testItem.save();

        testOrder = new OrderModel({
            user: testUser._id,
            items: [{
                itemId: testItem._id,
                name: testItem.name,
                category: testItem.category,
                quantity: 1,
                price: testItem.price,
                total: testItem.price
            }],
            totalPrice: testItem.price,
            status: "pending"
        });
        await testOrder.save();
    });


    describe('POST /orders', () => {
        it('should create a new order for a user' , async () => {
            const response = await request(app)
                .post("/orders")
                .send({
                    userId: testUser._id,
                    items: [{
                        itemId: testItem._id,
                        quantity: 2
                    }]
                });
            expect(response.statusCode).toEqual(201);
            expect(response.body.message).toBe("Order placed successfully.");
            expect(response.body.order).toHaveProperty('_id');
        });

        it('should create a new order for a guest user', async () => {
            const response = await request(app)
                .post("/orders")
                .send({
                    guestUser: "Guest User",
                    items: [{
                        itemId: testItem._id,
                        quantity: 2
                    }]
                });
            expect(response.statusCode).toEqual(201);
            expect(response.body.message).toBe("Order placed successfully.");
            expect(response.body.order).toHaveProperty('_id');
        });

        it('should return an error if an item is not found', async () => {
            const invalidItemId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .post("/orders")
                .send({
                    userId: testUser._id,
                    items: [{
                        itemId: invalidItemId,
                        quantity: 1
                    }]
                });
            expect(response.statusCode).toEqual(404);
            expect(response.body.message).toBe(`Item not found: ${invalidItemId}`);
        });

        it('should return an error if user or guest information is not provided', async () => {
            const response = await request(app)
                .post("/orders")
                .send({
                    items: [{
                        itemId: testItem._id,
                        quantity: 3
                    }]
                });
            expect(response.statusCode).toEqual(400);
            expect(response.body.message).toBe("User or guest information is required to place an order.");
        })
    });


    describe('GET /orders', () => {
        it('should get all orders', async () => {
            const response = await request(app)
                .get("/orders")
                .set('Authorization', `Bearer ${adminToken}`);
            expect(response.statusCode).toEqual(200);
            expect(response.body.result).toBeInstanceOf(Array);
            expect(response.body.result.length).toBe(1);
        });
    });


    describe('GET /orders/user/:id', () => {
        it('should get all orders for a specified user', async () => {
            const response = await request(app)
                .get(`/orders/user/${testUser._id}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.statusCode).toEqual(200);
            expect(response.body.result).toBeInstanceOf(Array);
            expect(response.body.result.length).toBe(1);
        });
    });
    
    
    describe('GET /orders/status/:id', () => {
        it('should get all orders from a specified status', async () => {
            const response = await request(app)
                .get("/orders/status/pending")
                .set('Authorization', `Bearer ${adminToken}`);
            expect(response.statusCode).toEqual(200);
            expect(response.body.result).toBeInstanceOf(Array);
            expect(response.body.result.length).toBe(1);
            expect(response.body.result[0].status).toBe("pending");
        });
    });


    describe('GET /orders/active', () => {
        it('should get all active orders', async () => {
            const response = await request(app)
                .get("/orders/active")
                .set('Authorization', `Bearer ${adminToken}`);
            expect(response.statusCode).toEqual(200);
            expect(response.body.result).toBeInstanceOf(Array);
            expect(response.body.result.length).toBe(1);
        });
    });


    describe('PATCH /orders/status/:id', () => {
        it('should update the status of a specfied order', async () => {
            const response = await request(app)
                .patch(`/orders/status/${testOrder._id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    status: "preparing" 
                });
            expect(response.statusCode).toEqual(200);
            expect(response.body.message).toBe("Order status updated successfully.");
            expect(response.body.status).toBe("preparing");
        });
    });
});