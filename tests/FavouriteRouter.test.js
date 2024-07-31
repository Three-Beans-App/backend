const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../src/server');
const { FavouriteModel } = require('../src/models/FavouriteModel');
const { ItemModel, CategoryModel } = require('../src/models/ItemModel');
const { UserModel } = require('../src/models/UserModel');
const { createJwt } = require('../src/utils/auth');

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb5", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Connected to test database.")
});

afterAll(async () => {
    await FavouriteModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await ItemModel.deleteMany({});
    await UserModel.deleteMany({});
    await mongoose.connection.close();
});


describe('Favourite Router', () => {
    let token;
    let testUser;
    let testCategory;
    let testItem;
    let testItem2;
    let testFavourite;

    beforeEach( async () => {
        await FavouriteModel.deleteMany({});
        await CategoryModel.deleteMany({});
        await ItemModel.deleteMany({});
        await UserModel.deleteMany({});

        testUser = new UserModel({
            name: "Test User",
            email: "user@test.com",
            password: "password"
        });
        await testUser.save();
        token = createJwt(testUser);

        testCategory = new CategoryModel({ name: "Test Category" });
        await testCategory.save();

        testItem = new ItemModel({
            name: "Test Item",
            category: testCategory._id,
            price: 5.99
        });
        await testItem.save();

        testItem2 = new ItemModel({
            name: "Test Item 2",
            category: testCategory._id,
            price: 6.99
        });
        await testItem2.save();

        testFavourite = new FavouriteModel({
            user: testUser._id,
            item: {
                itemId: testItem._id,
                name: testItem.name,
                category: testItem.category,
                price: testItem.price
            }
        });
        await testFavourite.save();
    });


    describe('POST /favourites', () => {
        it('should create a new favourite for a user', async () => {
            const response = await request(app)
                .post("/favourites")
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: testUser._id,
                    itemId: testItem2._id
                });
            expect(response.statusCode).toEqual(201);
            expect(response.body.message).toBe("Favourite added successfully.");
            expect(response.body.favourite).toHaveProperty('_id');
        });

        it('should return an error if no item is found', async () => {
            const falseItem = new mongoose.Types.ObjectId();
            const response = await request(app)
                .post("/favourites")
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: testUser._id,
                    itemId: falseItem
                });
            expect(response.statusCode).toEqual(404);
            expect(response.body.message).toBe("Item not found.")
        });

        it('should not create a favourite which already exists', async () => {
            const response = await request(app)
                .post("/favourites")
                .set('Authorization', `Bearer ${token}`)
                .send({
                    userId: testUser._id,
                    itemId: testItem._id
                });
            expect(response.statusCode).toEqual(400);
            expect(response.body.message).toBe("Item is already in your favourites.")
        })
    });


    describe('GET /favourites/:id', () => {
        it('should get all favourites for a specific user', async () => {
            const response = await request(app)
                .get(`/favourites/${testUser._id}`)
                .set('Authorization', `Bearer ${token}`)
            expect(response.statusCode).toEqual(200);
            expect(response.body.result.length).toBe(1);
            expect(response.body.result[0]._id).toBe(`${testFavourite._id}`);
        })
    });


    describe('PATCH /favourites/:id', () => {
        it('should update an existing favourite', async () => {
            const response = await request(app)
                .patch(`/favourites/${testFavourite._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    itemId: testItem2._id,
                });
            expect(response.statusCode).toEqual(200);
            expect(response.body.message).toBe("Favourite updated successfully.");
            expect(response.body.favourite.item.itemId).toBe(`${testItem2._id}`);
        });

        it('should return an error if no item is found from itemId', async () => {
            const falseItem = new mongoose.Types.ObjectId();
            const response = await request(app)
                .patch(`/favourites/${testFavourite._id}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    itemId: falseItem
                });
            expect(response.statusCode).toEqual(404);
            expect(response.body.message).toBe("Item not found.");
        });
    });
});

