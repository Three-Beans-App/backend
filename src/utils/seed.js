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
                description: "A shot of esspresso with equal parts steamed milk and froth."
            },
            {
                name: "Latte", // 1
                category: coffee._id,
                price: 5.99,
                available: true,
                description: "A shot of esspresso with steamed milk and light froth."
            },
            {
                name: "Flat White", // 2
                category: coffee._id,
                price: 5.99,
                available: true,
                description: "A shot of esspresso with less milk and very light froth"
            },
            {
                name: "Long Black", // 3
                category: coffee._id,
                price: 5.99,
                available: true,
                description: "A double shot of esspresso served with hot water."
            },
            {
                name: "Espresso", // 4
                category: coffee._id,
                price: 3.99,
                available: true,
                description: "Strong and hot shot of espresso"
            },
            {
                name: "English Breakfast", // 5
                category: tea._id,
                price: 4.99,
                available: true,
                description: "A full bodied black tea served with milk and sugar."
            },
            {
                name: "Green Tea", // 6
                category: tea._id,
                price: 4.99,
                available: true,
                description: "Refreshing green tea served with hot water.",
            },
            {
                name: "Earl Grey Tea", // 7
                category: tea.id,
                price: 4.99,
                available: true,
                description: "Black tea flavoured with bergamont served with hot water or milk."
            },
            {
                name: "Chai Latte", // 8
                category: tea.id,
                price: 5.99,
                available: true,
                description: "Blact tea served with milk and spiced with cinnamon, cardamom, cloves, peppercorns and star anise."
            },
            {
                name: "Chocolate Milkshake", // 9
                category: milkshake._id,
                price: 7.99,
                available: true,
            },
            {
                name: "Strawberry Milkshake", // 10
                category: milkshake._id,
                price: 7.99,
                available: true,
            },
            {
                name: "Vanilla Milkshake", // 11
                category: milkshake._id,
                price: 7.99,
                available: true,
            },
            {
                name: "Caramel Milkshake", // 12
                category: milkshake._id,
                price: 7.99,
                available: true
            },
            {
                name: "Brekkie Roll", // 13
                category: food._id,
                price: 11.99,
                available: true,
                description: "Fresh baked brioche roll with fried egg, bacon and a hashbrown"
            },
            {
                name: "Ham & Cheese Toastie", // 14
                category: food._id,
                price: 7.99,
                available: true,
                description: "Ham and cheese served in a thick toasted white bread sandwhich."
            },
            {
                name: "Reuben", // 15
                category: food._id,
                price: 8.99,
                available: true,
                description: "Toasted rye bread with corned beef, swiss cheese, sauerkraut and thousand island dressing."
            },
            {
                name: "Ham & Cheese Croissant", // 16
                category: food._id,
                price: 7.99,
                available: true,
                description: "Toasted croissant with ham and melted cheese inside."
            },
            {
                name: "Croissant", // 17
                category: food._id,
                price: 5.99,
                available: true,
            },
            {
                name: "Almond Croissant", // 18
                category: food._id,
                price: 7.99,
                available: true,
                description: "Fresh baked croissant with a sweet almond filling topped with almonds."
            },
            {
                name: "Blueberry muffin", // 19
                category: food._id,
                price: 6.99,
                available: true,
            },
            {
                name: "Choc-Chip Muffin", // 20 
                category: food._id,
                price: 6.99,
                available: true,
            },
            {
                name: "Banana Bread", // 21
                category: food._id,
                price: 6.99,
                available: true,
            },
            {
                name: "Brownie", // 22
                category: food._id,
                price: 6.99,
                available: true
            },
            {
                name: "Lemon Slice", // 23
                category: food._id,
                price: 6.99,
                available: true
            },
            {
                name: "Carrot Cake", // 24
                category: food._id,
                price: 6.99,
                available: true
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


// async function seedCustomisation() {
//     const customisations = [
//         {
//             category: "milk", // 0
//             name: "Whole",
//             available: 100,
//         },
//         {
//             category: "milk", // 1
//             name: "Skim",
//             available: 100
//         },
//         {
//             category: "milk", // 2
//             name: "Soy",
//             available: 100
//         },
//         {
//             category: "milk", // 3
//             name: "Almond",
//             available: 100
//         },
//         {
//             category: "milk", // 4
//             name: "Oat",
//             available: 100
//         },
//         {
//             category: "sugar", // 0
//             name: "White",
//             available: 100
//         },
//         {
//             category: "sugar", // 1
//             name: "Raw",
//             available: 100
//         },
//         {
//             category: "sugar", // 2
//             name: "Stevia",
//             available: 100
//         },
//         {
//             category: "sugar", // 3
//             name: "Honey",
//             available: 100
//         },
//         {
//             category: "size", // 0
//             name: "Regular",
//             available: 100
//         },
//         {
//             category: "size", // 1
//             name: "Large",
//             available: 100,
//             price: 2.00
//         },
//         {
//             category: "extra", // 0
//             name: "Sugar",
//             available: 100
//         },
//         {
//             category: "extra", // 1
//             name: "Stevia",
//             available: 100
//         },
//         {
//             category: "extra", // 2
//             name: "Honey",
//             available: 100
//         },
//         {
//             category: "extra", // 3
//             name: "Chocolate Dust",
//             available: 100,
//             price: 0.50
//         },
//         {
//             category: "extra", // 4
//             name: "Chocolate",
//             available: 100,
//             price: 1.00
//         },
//         {
//             category: "extra", // 5
//             name: "Cinnamon dust",
//             available: 100,
//             price: 0.50
//         },
//         {
//             category: "extra", // 6
//             name: "Caramel Drizzle",
//             available: 100,
//             price: 0.50
//         },
//         {
//             category: "extra", // 7
//             name: "Caramel",
//             available: 100,
//             price: 1.00
//         },
//         {
//             category: "extra", // 8
//             name: "Whipped Cream",
//             available: 100,
//             price: 1.00
//         }

//     ]

//     console.log("Seeding customisations...");
//     try {
//         let result = await CustomisationModel.insertMany(customisations);
//         console.log([...result]);
//         return [...result];
//     } catch (error) {
//         console.error("Error seeding customisations: " + error);
//     }
// }


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
        // const sizeOptions = await CustomisationModel.find({ category: "size" });
        // const milkOptions = await CustomisationModel.find({ category: "milk" });
        // const sugarOptions = await CustomisationModel.find({ category: "sugar" });
        // const extraOptions = await CustomisationModel.find({ category: "extra" });

        const orderItems1 = [
                {
                itemId: items[0]._id,
                name: items[0].name,
                category: items[0].category,
                quantity: 2,
                price: items[0].price,
                total: items[0].price * 2,
                // customisations: {
                //     size: sizeOptions[1]._id,
                //     milk: milkOptions[0]._id,
                //     sugar: sugarOptions[0]._id,
                //     extras: [extraOptions[3], extraOptions[4]]
                // }               
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
                // customisations: {
                //     size: sizeOptions[0]._id,
                //     milk: null,
                //     sugar: sugarOptions[0]._id
                // }               
            },
            {
                itemId: items[0]._id,
                name: items[0].name,
                category: items[0].category,
                quantity: 1,
                price: items[0].price,
                total: items[0].price,
                // customisations: {
                //     size: sizeOptions[1]._id,
                //     milk: milkOptions[2]._id,
                //     sugar: sugarOptions[1]._id
                // }               
            },
            {
                itemId: items[4]._id,
                name: items[4].name,
                category: items[4].category,
                quantity: 2,
                price: items[4].price,
                total: items[4].price * 2,
                // customisations: {
                //     size: null,
                //     milk: null,
                //     sugar: null
                // }               
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
        // const sizeOptions = await CustomisationModel.find({ category: "size" });
        // const milkOptions = await CustomisationModel.find({ category: "milk" });
        // const sugarOptions = await CustomisationModel.find({ category: "sugar" });
        // const extraOptions = await CustomisationModel.find({ category: "extra" });

        const favouriteItems = [
            {
                itemId: items[1]._id,
                name: items[1].name,
                category: items[1].category,
                price: items[4].price,

                // customisations: {
                //     size: sizeOptions[1],
                //     milk: milkOptions[0],
                //     sugar: sugarOptions[1],
                //     extras: [extraOptions[3], extraOptions[7]]
                // }
            },
            {
                itemId: items[9]._id,
                name: items[9].name,
                category: items[9].category,
                price: items[9].price,
                // customisations: {
                //     size: sizeOptions[1],
                //     milk: milkOptions[3],
                //     extras: [extraOptions[6], extraOptions[8]]
                // }
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
    // let newCustomisations = await seedCustomisation();
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