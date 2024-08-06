const { UserModel } = require('../models/UserModel');
const { CategoryModel, ItemModel, CustomisationModel } = require('../models/ItemModel');
const { OrderModel } = require('../models/OrderModel');
const { FavouriteModel } = require('../models/FavouriteModel');
const { createJwt, validateJwt } = require('./auth');
const { databaseConnect, databaseClear, databaseClose } = require('./database');
const bcrypt = require('bcryptjs');



async function seedUsers() {
    const users = [
        {
            name: "3BeansCafe",
            email: "3bc@email.com",
            password: "12345",           
            admin: true
        },
        {
            name: "Esther",
            email: "esther@email.com",
            password: "12345"
        },
        {
            name: "Nicholas",
            email: "nicholas@email.com",
            password: "12345"
        },
        {
            name: "Brett",
            email: "brett@email.com",
            password: "12345",
            birthday: new Date("1996-07-06")
        }
    ];

    console.log("Seeding users...")
    try {
        for (let user of users) {
            user.password = await bcrypt.hash(user.password, 10);
        }
        let result = await UserModel.insertMany(users);
        console.log([...result]);
        return [...result];
    } catch(error) {
        console.error("Error seeding users: " + error);
    }
}


async function seedCategories() {
    const categories = [
        { name: "milkshake" },
        { name: "food" },
        { name: "coffee"},
        { name: "tea" }
    ];

    console.log("Seeding categories...");
    try {
        let result = await CategoryModel.insertMany(categories);
        console.log([...result]);
        return [...result]
    } catch(error) {
        console.error("Error seeding categories: " + error)
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
                available: true,
                description: "A shot of esspresso with equal parts steamed milk and froth.",
                image: "https://images.unsplash.com/photo-1523942839745-7848c839b661?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fG1vY2NhfGVufDB8fDB8fHww"
            },
            {
                name: "Latte", // 1
                category: coffee._id,
                price: 5.99,
                available: true,
                description: "A shot of esspresso with steamed milk and light froth.",
                image: "https://images.unsplash.com/photo-1550247611-e651810312fe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGxhdHRlfGVufDB8fDB8fHww"
            },
            {
                name: "Flat White", // 2
                category: coffee._id,
                price: 5.99,
                available: true,
                description: "A shot of esspresso with less milk and very light froth",
                image: "https://images.unsplash.com/photo-1499961524705-bfd103e65a6d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNhcHB1Y2Npbm98ZW58MHx8MHx8fDA"
            },
            {
                name: "Long Black", // 3
                category: coffee._id,
                price: 5.99,
                available: true,
                description: "A double shot of esspresso served with hot water.",
                image: "https://img.freepik.com/free-photo/black-coffee-cup_1339-1825.jpg?size=626&ext=jpg"
            },
            {
                name: "Espresso", // 4
                category: coffee._id,
                price: 3.99,
                available: true,
                description: "Strong and hot shot of espresso",
                image: "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXNwcmVzc298ZW58MHx8MHx8fDA"
            },
            {
                name: "English Breakfast", // 5
                category: tea._id,
                price: 4.99,
                available: true,
                description: "A full bodied black tea served with milk and sugar.",
                image: "https://plus.unsplash.com/premium_photo-1674406481284-43eba097a291?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVhfGVufDB8fDB8fHww"
            },
            {
                name: "Green Tea", // 6
                category: tea._id,
                price: 4.99,
                available: true,
                description: "Refreshing green tea served with hot water.",
                image: "https://images.unsplash.com/photo-1606377695906-236fdfcef767?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGdyZWVuJTIwdGVhfGVufDB8fDB8fHww"
            },
            {
                name: "Earl Grey Tea", // 7
                category: tea.id,
                price: 4.99,
                available: true,
                description: "Black tea flavoured with bergamont served with hot water or milk.",
                image: "https://images.unsplash.com/photo-1522520605515-22f0c506c369?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZWFybCUyMGdyZXklMjB0ZWF8ZW58MHx8MHx8fDA%3D"
            },
            {
                name: "Chai Latte", // 8
                category: tea.id,
                price: 5.99,
                available: true,
                description: "Blact tea served with milk and spiced with cinnamon, cardamom, cloves, peppercorns and star anise.",
                image: "https://cdn.pixabay.com/photo/2024/04/18/11/56/ai-generated-8704229_1280.png"
            },
            {
                name: "Chocolate Milkshake", // 9
                category: milkshake._id,
                price: 7.99,
                available: true,
                image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fGNob2NvbGF0ZSUyMG1pbGtzaGFrZXxlbnwwfHwwfHx8MA"
            },
            {
                name: "Strawberry Milkshake", // 10
                category: milkshake._id,
                price: 7.99,
                available: true,
                image: "https://images.unsplash.com/photo-1686638745403-d21193f16b2f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fHN0cmF3YmVycnklMjBtaWxrc2hha2V8ZW58MHx8MHx8fDA"
            },
            {
                name: "Vanilla Milkshake", // 11
                category: milkshake._id,
                price: 7.99,
                available: true,
                image: "https://plus.unsplash.com/premium_photo-1695868328902-b8a3b093da74?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fHZhbmlsbGElMjBtaWxrc2hha2V8ZW58MHx8MHx8fDA"
            },
            {
                name: "Caramel Milkshake", // 12
                category: milkshake._id,
                price: 7.99,
                available: true,
                image: "https://plus.unsplash.com/premium_photo-1695035006916-bb85c139c70c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FyYW1lbCUyMG1pbGtzaGFrZXxlbnwwfHwwfHx8MA"
            },
            {
                name: "Brekkie Roll", // 13
                category: food._id,
                price: 11.99,
                available: true,
                description: "Fresh baked brioche roll with fried egg, bacon and a hashbrown",
                image: "https://images.unsplash.com/photo-1559962956-34e40045254f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJyZWFrZmFzdCUyMGJ1cmdlcnxlbnwwfHwwfHx8MA"
            },
            {
                name: "Ham & Cheese Toastie", // 14
                category: food._id,
                price: 7.99,
                available: true,
                description: "Ham and cheese served in a thick toasted white bread sandwich.",
                image: "https://plus.unsplash.com/premium_photo-1694630656689-13d76af27fbc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHRvYXN0aWV8ZW58MHx8MHx8fDA"
            },
            {
                name: "Reuben", // 15
                category: food._id,
                price: 8.99,
                available: true,
                description: "Toasted rye bread with corned beef, swiss cheese, sauerkraut and thousand island dressing.",
                image: "https://images.unsplash.com/photo-1614746526977-fac370353ae8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmV1YmVuJTIwdG9hc3RpZXxlbnwwfHwwfHx8MA"
            },
            {
                name: "Ham & Cheese Croissant", // 16
                category: food._id,
                price: 7.99,
                available: true,
                description: "Toasted croissant with ham and melted cheese inside.",
                image: "https://images.unsplash.com/photo-1695304777030-167556e5ecf3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3JvaXNzYW50JTIwaGFtfGVufDB8fDB8fHww"
            },
            {
                name: "Croissant", // 17
                category: food._id,
                price: 5.99,
                available: true,
                image: "https://images.unsplash.com/photo-1653460895291-d3ff89651ce8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTExfHxjcm9pc3NhbnR8ZW58MHx8MHx8fDA"
            },
            {
                name: "Almond Croissant", // 18
                category: food._id,
                price: 7.99,
                available: true,
                description: "Fresh baked croissant with a sweet almond filling topped with almonds.",
                image: "https://images.unsplash.com/photo-1625425404751-19b16c027511?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWxtb25kJTIwY3JvaXNzYW50fGVufDB8fDB8fHww"
            },
            {
                name: "Blueberry muffin", // 19
                category: food._id,
                price: 6.99,
                available: true,
                image: "https://images.unsplash.com/photo-1722251172903-cc8774501df7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ymx1ZWJlcnJ5JTIwbXVmZmlufGVufDB8fDB8fHww"
            },
            {
                name: "Choc-Chip Muffin", // 20 
                category: food._id,
                price: 6.99,
                available: true,
                image: "https://images.unsplash.com/photo-1616151030755-76f6cd987a06?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fGNob2NvbGF0ZSUyMG11ZmZpbnxlbnwwfHwwfHx8MA"
            },
            {
                name: "Banana Bread", // 21
                category: food._id,
                price: 6.99,
                available: true,
                image: "https://images.unsplash.com/photo-1632931057819-4eefffa8e007?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJhbmFuYSUyMGJyZWFkfGVufDB8fDB8fHww"
            },
            {
                name: "Brownie", // 22
                category: food._id,
                price: 6.99,
                available: true,
                image: "https://img.freepik.com/free-photo/chocolate-brownies_74190-982.jpg?ga=GA1.1.1445193959.1722516795&semt=sph"
            },
            {
                name: "Lemon Slice", // 23
                category: food._id,
                price: 6.99,
                available: true,
                image: "https://plus.unsplash.com/premium_photo-1714942934723-118f2b4dd6dc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fGxlbW9uJTIwY2FrZXxlbnwwfHwwfHx8MA"
            },
            {
                name: "Carrot Cake", // 24
                category: food._id,
                price: 6.99,
                available: true,
                image: "https://images.unsplash.com/photo-1487124504955-e42a39e11aaf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2Fycm90JTIwY2FrZXxlbnwwfHwwfHx8MA"
            }
        ];

        console.log("Seeding items...");
        let result = await ItemModel.insertMany(items);
        console.log([...result]);
        return [...result];
    } catch(error) {
        console.error("Error seeding items: " + error);
    }
}


async function calculateTotalPrice(items) {
    let totalPrice = 0;

    for (let item of items) {
        let itemQuantity = item.quantity || 1;
        let itemTotal = item.price * itemQuantity;

        if (item.customisations) {
            for (let [key, value] of Object.entries(item.customisations)) {
                if (Array.isArray(value)) {
                    for (let extra of value) {
                        const customisation = await CustomisationModel.findById(extra);
                        if (customisation) {
                            itemTotal += customisation.price * itemQuantity;
                        }
                    }                    
                } else if (value) {
                    const customisation = await CustomisationModel.findById(value);
                    if (customisation) {
                        itemTotal += customisation.price * itemQuantity;
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
        const orderItems1 = [
                {
                itemId: items[0]._id,
                name: items[0].name,
                category: items[0].category,
                quantity: 2,
                price: items[0].price,
                total: items[0].price * 2,             
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
            },
            {
                itemId: items[0]._id,
                name: items[0].name,
                category: items[0].category,
                quantity: 1,
                price: items[0].price,
                total: items[0].price,              
            },
            {
                itemId: items[4]._id,
                name: items[4].name,
                category: items[4].category,
                quantity: 2,
                price: items[4].price,
                total: items[4].price * 2,            
            }

        ];



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
        console.error("Error seeding orders: " + error);
    }
}


async function seedFavourites(users, items) {
    try {
        const favouriteItems = [
            {
                itemId: items[1]._id,
                name: items[1].name,
                category: items[1].category,
                price: items[4].price,
            },
            {
                itemId: items[9]._id,
                name: items[9].name,
                category: items[9].category,
                price: items[9].price,
            }
        ];

        const favourites = [
            {
                user: users[1]._id,
                item: favouriteItems[0],
                totalPrice: await calculateTotalPrice([favouriteItems[0]])
            },
            {
                user: users[2]._id,
                item: favouriteItems[1],
                totalPrice: await calculateTotalPrice([favouriteItems[1]])
            }
        ];

        console.log("Seeding favourites...");
        let result = await FavouriteModel.insertMany(favourites);
        console.log([...result]);
        return[...result];
    } catch(error) {
        console.error("Error seeding favourites: " + error);
    }
}


async function seed(){
    await databaseConnect();
    await databaseClear();
    console.log("Seeding database...")

    let newUsers = await seedUsers();
    let newCategories = await seedCategories();
    let newItems = await seedItems();
    let newOrders = await seedOrders(newUsers, newItems);
    let newFavourites = await seedFavourites(newUsers, newItems);

    console.log("Creating user JWTs...");
    newUsers.forEach(user => {
        let newJwt = createJwt(user);
        console.log(`New JWT for ${user.name}:\n ${newJwt}`);
        validateJwt(newJwt);
    }); 

    console.log("Data seeded successfully!");
    await databaseClose();
}

seed();