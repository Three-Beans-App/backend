const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/server');
const { ItemModel, CategoryModel } = require('../src/models/ItemModel');
const { UserModel } = require('../src/models/UserModel');
const { createJwt } = require('../src/utils/auth');




beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb2", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected to test database");


});

afterAll(async () => {
    await UserModel.deleteMany({});
    await ItemModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await mongoose.connection.close();
    console.log("Disconnected from test database.");
});


describe('Menu Routes', () => {
    let adminToken;
    let userToken;
    let testItem;
    let testCategory;

    beforeEach( async () => {
        await UserModel.deleteMany({});
        await ItemModel.deleteMany({});
        await CategoryModel.deleteMany({});

        const adminUser = new UserModel({
            email: "admin@test.com",
            password: "password",
            name: "Admin User",
            admin: true
        });
        await adminUser.save();
    
        adminToken = createJwt(adminUser);
    
        const user = new UserModel({
            email: "user@test.com",
            password: "password",
            name: "Test User",
            admin: false
        });
        await user.save();
    
        userToken = createJwt(user);
    
        testCategory = new CategoryModel({ name: "Test Category" });
        await testCategory.save();
    
        testItem = new ItemModel({
            name: "Test Item",
            category: testCategory._id,
            price: 5.99,
        });
        await testItem.save();  
    });


    it('should add a new category', async () => {
        const response = await request(app)
            .post("/menu/addCategory")
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: "NewCategory" });
        expect(response.statusCode).toEqual(201);
        expect(response.body.message).toBe("Category added successfully")
    });

    it('should not add a category without admin status', async () => {
        const response = await request(app)
            .post("/menu/addCategory")
            .set('Authorization', `Bearer ${userToken}`)
            .send({ name: "newCategory" });
        expect(response.statusCode).toEqual(403);
        expect(response.body.message).toBe("Access denied! must be an admin.")
    });

    it('should not add a category without a valid token', async () => {
        const response = await request(app)
            .post("/menu/addCategory")
            .set('Authorization', 'Bearer badToken')
            .send({ name: "newCategory" });
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toBe("Invalid token")
    });

    it('should not add a category without an existing token', async () => {
        const response = await request(app)
            .post("/menu/addCategory")
            .send({ name: "newCategory" });
        expect(response.statusCode).toEqual(401);
        expect(response.body.message).toBe("Authentication token is required");
    });

    it('should not add a category with an existing name', async () => {
        const response = await request(app)
            .post("/menu/addCategory")
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: "Test Category" });
        expect(response.statusCode).toEqual(400);
        expect(response.body.message).toBe("A category with this name already exists.")
    });


    it('should add a new item', async () => {
        const response = await request(app)
            .post("/menu/addItem")
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: "New Item",
                category: "Test Category",
                price: 9.99,
                description: "Test description"
            });
        expect(response.statusCode).toEqual(201);
        expect(response.body.message).toBe("Item added successfully.");
    });

    it('should not add an item when no category is found', async () => {
        const response = await request(app)
            .post("/menu/addItem")
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: "New Item",
                category: "False Category",
                price: 100000,
                description: "Test description"
            });
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toBe("Category not found.");
    });

    it('should not add an item with an existing name', async () => {
        const response = await request(app)
            .post("/menu/addItem")
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: "Test Item",
                category: "Test Category",
                price: 99.99,
                description: "Test description"
            });
        expect(response.statusCode).toEqual(400);
        expect(response.body.message).toBe("An item with this name already exists.");
    });


    it('should get all items', async () => {
        const response = await request(app)
            .get("/menu")
        expect(response.statusCode).toEqual(200);
        expect(response.body.result.length).toBe(1);
    });


    it('should get all categories', async () => {
        const response = await request(app)
            .get("/menu/categories")
        expect(response.statusCode).toEqual(200);
        expect(response.body.result.length).toBe(1);
    });


    it('should get item by ID', async () => {
        const response = await request(app)
            .get(`/menu/${testItem._id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.result.name).toBe("Test Item")
    });

    it('should return an error if an item ID is invalid', async () => {
        const response = await request(app)
            .get("/menu/falseId");
        expect(response.statusCode).toEqual(400);
        expect(response.body.message).toBe("Invalid item ID.");
    });

    it('should return an error if no item is found for ID', async () => {
        const falseId = new mongoose.Types.ObjectId();
        const response = await request(app)
            .get(`/menu/${falseId}`);
        expect(response.statusCode).toEqual(404);
        expect(response.body.message).toBe("Item not found.")
    });


    it('should get all items of a specified category', async () => {
        const response = await request(app)
            .get(`/menu/categories/${testCategory._id}`);
        expect(response.statusCode).toEqual(200);
        expect(response.body.result.length).toBe(1);
    });

    it('should return an error if category ID is invalid', async () => {
        const response = await request(app)
            .get("/menu/categories/falseId");
        expect(response.statusCode).toEqual(400);
        expect(response.body.message).toBe("Invalid category ID.");
    });

    



});