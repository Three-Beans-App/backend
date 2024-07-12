const { UserModel } = require('../models/UserModel');
const { CategoryModel, ItemModel, InventoryModel } = require('../models/ItemModel');
const { createJwt, validateJwt } = require('./auth');
const { databaseConnect, databaseClear, databaseClose } = require('./database');


async function seedUsers () {
    let users = [
        {
            name: "Brett",
            email: "brett@email.com",
            password: "12345",
            birthday: "06/07/1996",
            admin: true
        }
    ];

    console.log("Seeding users...")
    try {
        let result = await UserModel.create(users);
        console.log([...result]);
        return [...result];
    } catch (error) {
        console.error("Error seeding users:" + error);
    }
}

async function seedCategories () {
    const categories = [
        { name: "coffee"},
        { name: "tea" },
        { name: "milkshake" },
        { name: "food" }
    ];

    console.log("Seeding categories...");
    try {
        let result = await CategoryModel.insertMany(categories);
        console.log([...result]);
        return [...result]
    } catch (error) {
        console.error("Error seeding categories:" + error)
    }
}

async function seedItems () {
    try {
        const coffee = await CategoryModel.findOne({ name: "coffee" });
        const tea = await CategoryModel.findOne({ name: "tea"});
        const milkshake = await CategoryModel.findOne({ name: "milkshake" });
        const food = await CategoryModel.findOne({ name: "food" });

        const items = [
            {
                name: "Espresso",
                category: coffee._id,
                price: 3.99,
                quantity: 80,
                description: "Strong and hot shot of espresso"
            },
            {
                name: "Green Tea",
                category: tea._id,
                price: 4.99,
                quantity: 50,
                description: "Refreshing green tea",
            },
            {
                name: "Chocolate Milkshake",
                category: milkshake._id,
                price: 7.99,
                quantity: 50,
                description: "Delicious rich chocolate milkshake"
            },
            {
                name: "Brekkie Roll",
                category: food._id,
                price: 11.99,
                quantity: 25,
                description: "Fresh baked brioche roll with fried egg, bacon and a hashbrown"
            }
        ];

        console.log("Seeding items...");
        let result = await ItemModel.insertMany(items);
        console.log([...result]);
        return [...result];
    } catch (error) {
        console.error("Error seeding items:" + error);
    }
}


async function seed(){
    await databaseConnect();
    await databaseClear();
    console.log("Seeding database...")

    let newUsers = await seedUsers();
    let newCategories = await seedCategories();
    let newItems = await seedItems();

    let newJwt = createJwt(newUsers[0]._id);
    console.log("New JWT: " + newJwt);

    validateJwt(newJwt);

    console.log("Data seeded successfully!");
    await databaseClose();
}

seed();