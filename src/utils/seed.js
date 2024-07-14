const { UserModel } = require('../models/UserModel');
const { CategoryModel, ItemModel, InventoryModel } = require('../models/ItemModel');
const { createJwt, validateJwt } = require('./auth');
const { databaseConnect, databaseClear, databaseClose } = require('./database');
const { OrderModel } = require('../models/OrderModel');


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
    } catch(error) {
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
    } catch(error) {
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
                name: "Cappuccino",
                category: coffee._id,
                price: 5.99,
                quantity: 80,
            },
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
    } catch(error) {
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


async function calculateTotalPrice(items) {
    return items.reduce((acc, item) => acc + item.total, 0);
}

async function seedOrders(users, items) {
    try {
        const milkOptions = await InventoryModel.find({ category: "milk" });
        const sugarOptions = await InventoryModel.find({ category: "sugar" });
        const sizeOptions = await InventoryModel.find({ category: "size" });

        const orderItems1 = [
                {
                itemId: items[0]._id,
                name: items[0].name,
                category: items[0].category,
                quantity: 2,
                price: items[0].price,
                total: items[0].price * 2,
                customizations: {
                    size: sizeOptions[1]._id,
                    milk: milkOptions[0]._id,
                    sugar: sugarOptions[0]._id
                }               
            }
        ];
        const orderItems2 = [
            {
                itemId: items[1]._id,
                name: items[1].name,
                category: items[1].category,
                quantity: 1,
                price: items[1].price,
                total: items[1].price,
                customizations: {
                    size: sizeOptions[0]._id,
                    milk: null,
                    sugar: sugarOptions[0]._id
                }               
            },
            {
                itemId: items[0]._id,
                name: items[0].name,
                category: items[0].category,
                quantity: 1,
                price: items[0].price,
                total: items[0].price,
                customizations: {
                    size: sizeOptions[2]._id,
                    milk: milkOptions[2]._id,
                    sugar: sugarOptions[1]._id
                }               
            },
            {
                itemId: items[4]._id,
                name: items[4].name,
                category: items[4].category,
                quantity: 2,
                price: items[4].price,
                total: items[4].price * 2,
                customizations: {
                    size: null,
                    milk: null,
                    sugar: null
                }               
            }

        ]



        const orders = [
            {
                user: users[1]._id,
                items: orderItems1,
                totalPrice: await calculateTotalPrice(orderItems1),
                status: "completed"
            },
            {
                user: users[2]._id,
                items: orderItems2,
                totalPrice: await calculateTotalPrice(orderItems2),
                status: "completed"
            }
        ];

        console.log("Seeding orders...");
        let result = await OrderModel.insertMany(orders);
        console.log([...result]);
        return [...result];
    } catch(error) {
        console.error("Error seeding orders:" + error);
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
    let newOrders = await seedOrders(newUsers, newItems);

    console.log("Creating user JWTs...");
    newUsers.forEach(user => {
        let newJwt = createJwt(user._id);
        console.log(`New JWT for ${user.name}:\n ${newJwt}`);
        validateJwt(newJwt);
    }); 

    console.log("Data seeded successfully!");
    await databaseClose();
}

seed();