const { UserModel } = require('../models/UserModel');
const { CategoryModel, ItemModel, CustomisationModel } = require('../models/ItemModel');
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
                name: "Cappuccino", // 0
                category: coffee._id,
                price: 5.99,
                quantity: 80,
                description: "A shot of esspresso with equal parts steamed milk and froth."
            },
            {
                name: "Latte", // 1
                category: coffee._id,
                price: 5.99,
                quantity: 80,
                description: "A shot of esspresso with steamed milk and light froth."
            },
            {
                name: "Flat White", // 2
                category: coffee._id,
                price: 5.99,
                quantity: 80,
                description: "A shot of esspresso with less milk and very light froth"
            },
            {
                name: "Long Black", // 3
                category: coffee._id,
                price: 5.99,
                quantity: 80,
                description: "A double shot of esspresso served with hot water."
            },
            {
                name: "Espresso", // 4
                category: coffee._id,
                price: 3.99,
                quantity: 80,
                description: "Strong and hot shot of espresso"
            },
            {
                name: "English Breakfast", // 5
                category: tea._id,
                price: 4.99,
                quantity: 50,
                description: "A full bodied black tea served with milk and sugar."
            },
            {
                name: "Green Tea", // 6
                category: tea._id,
                price: 4.99,
                quantity: 50,
                description: "Refreshing green tea served with hot water.",
            },
            {
                name: "Earl Grey Tea", // 7
                category: tea.id,
                price: 4.99,
                quantity: 50,
                description: "Black tea flavoured with bergamont served with hot water or milk."
            },
            {
                name: "Chai Latte", // 8
                category: tea.id,
                price: 5.99,
                quantity: 50,
                description: "Blact tea served with milk and spiced with cinnamon, cardamom, cloves, peppercorns and star anise."
            },
            {
                name: "Chocolate Milkshake", // 9
                category: milkshake._id,
                price: 7.99,
                quantity: 50,
            },
            {
                name: "Strawberry Milkshake", // 10
                category: milkshake._id,
                price: 7.99,
                quantity: 50,
            },
            {
                name: "Vanilla Milkshake", // 11
                category: milkshake._id,
                price: 7.99,
                quantity: 50,
            },
            {
                name: "Caramel Milkshake", // 12
                category: milkshake._id,
                price: 7.99,
                quantity: 50
            },
            {
                name: "Brekkie Roll", // 13
                category: food._id,
                price: 11.99,
                quantity: 25,
                description: "Fresh baked brioche roll with fried egg, bacon and a hashbrown"
            },
            {
                name: "Ham & Cheese Toastie", // 14
                category: food._id,
                price: 7.99,
                quantity: 25,
                description: "Ham and cheese served in a thick toasted white bread sandwhich."
            },
            {
                name: "Reuben", // 15
                category: food._id,
                price: 8.99,
                quantity: 25,
                description: "Toasted rye bread with corned beef, swiss cheese, sauerkraut and thousand island dressing."
            },
            {
                name: "Ham & Cheese Croissant", // 16
                category: food._id,
                price: 7.99,
                quantity: 25,
                description: "Toasted croissant with ham and melted cheese inside."
            },
            {
                name: "Croissant", // 17
                category: food._id,
                price: 5.99,
                quantity: 25,
            },
            {
                name: "Almond Croissant", // 18
                category: food._id,
                price: 7.99,
                quantity: 25,
                description: "Fresh baked croissant with a sweet almond filling topped with almonds."
            },
            {
                name: "Blueberry muffin", // 19
                category: food._id,
                price: 6.99,
                quantity: 20,
            },
            {
                name: "Choc-Chip Muffin", // 20 
                category: food._id,
                price: 6.99,
                quantity: 20,
            },
            {
                name: "Banana Bread", // 21
                category: food._id,
                price: 6.99,
                quantity: 20,
            },
            {
                name: "Brownie", // 22
                category: food._id,
                price: 6.99,
                quantity: 20
            },
            {
                name: "Lemon Slice", // 23
                category: food._id,
                price: 6.99,
                quantity: 20
            },
            {
                name: "Carrot Cake", // 24
                category: food._id,
                price: 6.99,
                quantity: 20
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


async function seedCustomisation() {
    const customisations = [
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
            name: "Regular",
            quantity: 100
        },
        {
            category: "size",
            name: "Large",
            quantity: 100,
            price: 2.00
        }
    ]

    console.log("Seeding customisations...");
    try {
        let result = await CustomisationModel.insertMany(customisations);
        console.log([...result]);
        return [...result];
    } catch (error) {
        console.error("Error seeding customisations" + error);
    }
}


async function calculateTotalPrice(items) {
    let totalPrice = 0;

    for (let item of items) {
        let itemTotal = item.price * item.quantity;

        if (item.customisations) {
            for (let [key, value] of Object.entries(item.customisations)) {
                if (value) {
                    const customisation = await CustomisationModel.findById(value);
                    if (customisation) {
                        itemTotal += customisation.price * item.quantity;
                    }
                }
            }
        }
        totalPrice += itemTotal;
    }
    return totalPrice;
}

async function seedOrders(users, items) {
    try {
        const milkOptions = await CustomisationModel.find({ category: "milk" });
        const sugarOptions = await CustomisationModel.find({ category: "sugar" });
        const sizeOptions = await CustomisationModel.find({ category: "size" });
        const extraOptions = await CustomisationModel.find({ category: "extra" });

        const orderItems1 = [
                {
                itemId: items[0]._id,
                name: items[0].name,
                category: items[0].category,
                quantity: 2,
                price: items[0].price,
                total: items[0].price * 2,
                customisations: {
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
                customisations: {
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
                customisations: {
                    size: sizeOptions[1]._id,
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
                customisations: {
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
    let newCustomisations = await seedCustomisation();
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