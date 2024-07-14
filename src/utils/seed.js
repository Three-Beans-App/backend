const { UserModel } = require('../models/UserModel');
const { CategoryModel, ItemModel, InventoryModel } = require('../models/ItemModel');
const { createJwt, validateJwt } = require('./auth');
const { databaseConnect, databaseClear, databaseClose } = require('./database');


async function seedUsers() {
    const users = [
        {
            name: "Brett",
            email: "brett@email.com",
            password: "12345",
            birthday: "06/07/1996",
            admin: true
        },
        {
            name: "Sarah",
            email: "sarah@email.com",
            password: "12345",
            birthday: "11/04/1999",
        },
        {
            name: "Tim",
            email: "tim@email.com",
            password: "12345",
            birthday: "24/08/1992"
        }
    ];

    console.log("Seeding users...")
    try {
        let result = await UserModel.insertMany(users);
        console.log([...result]);
        return [...result];
    } catch (error) {
        console.error("Error seeding users:" + error);
    }
}

async function seedCategories() {
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

async function seedItems() {
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

async function seedInventory() {
    const inventory = [
        {
            category: "milk",
            name: "Whole",
            quantity: 100,
        },
        {
            category: "milk",
            name: "Skim",
            quantity: 100
        },
        {
            category: "milk",
            name: "Soy",
            quantity: 100
        },
        {
            category: "milk",
            name: "Almond",
            quantity: 100
        },
        {
            category: "milk",
            name: "Oat",
            quantity: 100
        },
        {
            category: "sugar",
            name: "White",
            quantity: 100
        },
        {
            category: "sugar",
            name: "Raw",
            quantity: 100
        },
        {
            category: "sugar",
            name: "Stevia",
            quantity: 100
        },
        {
            category: "sugar",
            name: "Honey",
            quantity: 100
        },
        {
            category: "size",
            name: "Small",
            quantity: "100"
        },
        {
            category: "size",
            name: "Regular",
            quantity: 100
        },
        {
            category: "size",
            name: "Large",
            quantity: 100
        }
    ]

    console.log("Seeding inventory...");
    try {
        let result = await InventoryModel.insertMany(inventory);
        console.log([...result]);
        return [...result];
    } catch (error) {
        console.error("Error seeding inventory" + error);
    }
}


async function seed(){
    await databaseConnect();
    await databaseClear();
    console.log("Seeding database...")

    let newUsers = await seedUsers();
    let newCategories = await seedCategories();
    let newItems = await seedItems();
    let newInventory = await seedInventory();

    let newJwt = createJwt(newUsers[0]._id);
    console.log("New JWT: " + newJwt);

    validateJwt(newJwt);

    console.log("Data seeded successfully!");
    await databaseClose();
}

seed();