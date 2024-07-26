const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/server');
const { ItemModel, CategoryModel } = require('../src/models/ItemModel');
const { UserModel } = require('../src/models/UserModel');
const { createJwt } = require('../src/utils/auth');

let token;
let testItem;

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected to test database");

    const adminUser = new UserModel({
        email: "admin@test.com",
        password: "password",
        name: "Admin User",
        admin: true
    });
    await adminUser.save();

    token = createJwt(adminUser);

    const category = new CategoryModel({ name: "TestCategory" });
    await category.save();

    testItem = new ItemModel({
        name: "Test Item",
        category: category._id,
        price: 5.99,
    });
    await testItem.save();  

});

afterAll(async () => {
    await UserModel.deleteMany({});
    await ItemModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await mongoose.connection.close();
    console.log("Disconnected from test database.");
});


describe('Menu Routes', () => {
    it('should add a new category', async () => {
        const response = await request(app)
            .post("/menu/addCategory")
            .set('Authorization', `Bearer ${token}`)
            .send({ name: "NewCategory" });
        expect(response.statusCode).toEqual(201);
        expect(response.body.message).toBe("Category added successfully")
    });

    it('should add a new item', async () => {
        const response = await request(app)
            .post("/menu/addItem")
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: "TestItem",
                category: "TestCategory",
                price: 9.99,
                description: "Test description"
            });
        expect(response.statusCode).toEqual(201);
        expect(response.body.message).toBe("Item added successfully");
    });

    it('should get all items', async () => {
        const response = await request(app)
            .get("/menu")
        expect(response.statusCode).toEqual(200);
        expect(response.body.result.length).toBeGreaterThan(0);
    });

    it('should get item by ID', async () => {
        const response = await request(app)
            .get(`/menu/${testItem._id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.result.name).toBe("Test Item")
    });
});