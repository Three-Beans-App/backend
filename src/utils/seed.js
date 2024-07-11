const { UserModel } = require('../models/UserModel');
const { createJwt, validateJwt } = require('./auth');
const { databaseConnect, databaseClear, databaseClose } = require('./database');


async function seedUsers () {
    let userData = [
        {
            name: "Brett",
            email: "brett@email.com",
            password: "12345",
            birthday: "06/07/1996",
            admin: true
        }
    ];

    console.log("Creating users...")
    let result = await UserModel.create(userData);

    console.log([...result]);
    return [...result];
}


async function seed(){
    await databaseConnect();
    await databaseClear();

    let newUsers = await seedUsers();

    let newJwt = createJwt(newUsers[0]._id);
    console.log("New JWT: " + newJwt);

    validateJwt(newJwt);

    console.log("Seeded data!");
    await databaseClose();
}

seed();