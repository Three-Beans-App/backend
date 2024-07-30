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
    });
});