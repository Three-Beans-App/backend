# T3A2 - Part B MERN Full-Stack App

## Team Members:

- Esther Faith Dennis
- Brett Russell
- Nicholas Rowe

# Three Beans Cafe website

**Deployed Website Address:** `https://3beanscafe.com`

[Link to live website](https://3beanscafe.com)

# Git repo ( include - frontend, backend, app-documentations)

**Three Beans App Repositories:** [Link to git](https://github.com/orgs/Three-Beans-App/repositories)

**Three Beans App Frontend:** [Link to git](https://github.com/Three-Beans-App/frontend)

**Three Beans App Backend:** [Link to git](https://github.com/Three-Beans-App/backend)

**Three Beans App Documentations:** [Link to git](https://github.com/Three-Beans-App/app-documentations)

# General Documentation

### User Login for Testing - Admin user

Admin Email: 3bc@email.com  
Password: 12345

## Backend Libraries and Frameworks Used
### ExpressJS
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. the key features of Express include:
- **Minimalist Framework** - Express provides only core funtionalities needed to build web applications and APIs, allowing developers to add only the features they need through middleware and plugins.

- **Middleware Support** - Functions that have access to the request object, the response object, and the next middleware function in the application's request-response cycle.

- **Scalability** - Developers can start with a simple application and scale it up by adding more features, modules, or by distributing the application across multiple servers.

- **Integration with Databases** - Express works well with all major databases like MongoDB, MySQL, and PostgreSQL. You can use ODM libraries like Mogoose to interact with the database.

- **RESTful API Development** - Express is commonly used for building RESTful APIs. It makes it easy to define routes, handle different HTTP methods, and structure application logic in a clean and maintainable way.

In our application Express was used to build the server API as well as facilitate interaction with the apps database.


### NodeJS
Node.js is an open-source, cross-platform runtime environment that allows developers to execute JavaScript code on the server side. Node.js extends the capabilities of JavaScript beyond the browser, allowing developers to build salable high-performance applications using JavaScript on the server.  
The features of Node.js include:

- **Event-Driven and Non-Blocking I/O Model** - Node operates on a single-threaded event loop, allowing it to handle many connections without blocking the thread. This makes it efficient for I/O bound tasks, such as reading files from disk, making HTTP requests, or interacting with databases.

- **Asynchronous Programming** - Many operations in Node are asynchronous, meaning they do not block the execution of other code. Node uses callbacks, promises, or async/await to handle the results of asynchronous operations.

- **JavaScript Everywhere** - Node allows developers to use JavaScript for both front-end and back-end development

- **NPM** - Node comes with Node Package Manager, the world's largest package registry. The vast ecosystem of packages available on NPM makes it easier to add functionality to Node applications.

- **Support for JSON** - Node has built in support for JSON, making it easy to parse and generate JSON data, this is useful for building RESTful APIs and working with database data.

In our application Node.js was used as our JavaScript runtime environment as well as for NPM package installation and management.


### MongoDB
MongoDB is an open-source NoSQL database that uses a document-oriented data model. Unlike traditional relational databses, whech use tables with rows and columns to store data, MongoDB stores data in flexible, JSON-like documents called BSON (Binary JSON). This allows for dynamic schemas, enabling developers to store and query data in natural and expressive ways.  
Features of MongoDB include:

- **Flexible Schema** - MongoDB's schema design allows developers to store documents with varying structures in the same collection. MongoDB lets data models evolve as application requirements change,

- **High Performance** - MongoDB is optimised for high read and write throughput. It's design allows for efficient indexing, in-memory data storage, and a flexible data model, contributing to fast wuery execution and high performance.

- **JSON-like Storage** - MongoDB uses BSON for data storage. BSON is a binary representation of JSON-like documents, allowing MogoDB to efficiently store and query documents. BSON supports additional data types, such as dates and binary data, that are not natively supported in JSON.

- **Collections and Documents** - Collections in MongoDB are schema-less, meaning that each document in a collection can have a different structure. This allows for different types of data to be stored in the same collection and helps with the evolution of the data model over time.

In our application MongoDB was used for both our development database as well as the deployed database to store and retrieve the data created by the application.


### mongoose 
Mongoose is an Object Data Mapping (ODM) library for MongoDB and Node.js. It provides a straightforward, schema-based solution to model application data. Mongoose makes it easier to work with MongoDB by allowing developers to define schemas for their collections, enforce data validation, and interact with the database using a structured approach. Mongoose enables developers to define strict schemas, which helps to prevent inconsistencies in data by providing a layer of structure on top of MongoDB's flexible document-oriented nature.

In our application Mongoose was used to interact with our MongoDB database by defining schemas, creating models, and performing CRUD operations on the database.


### bcryptjs
BcryptJS is a pure JavaScript implementation of the bcrypt password hashing algorithm. It is designed to work in environments where native modules cannot be compiled. While Bcryptjs shares the same fundamental principles and API as the native bcrypt library, it does not rely on any native C++ bindings, making it highly portable and easier to install across different platforms. 

In our application BcryptJS was used for password hashing in order to improve user data security.


### cors
the 'cors' package is a middleware that simplifies the process of enabling Cross-Origin Resouirce Sharing (CORS) on a server. It allows developers to configure and manage CORS policies, making it easy to handle cross-origin requests from web browsers securely and efficiently.

In our application cors was used to enable and configure cross-origin resource sharing through the use of cors middleware.


### dotenv
'dotenv' is a Node.js package that enables developers to manage environment variables by storing them in a '.env' file. Environment variables are key-value pairs that can influence the behaviour of an application, such as database strings, API keys, and configuration settings. By using dotenv, developers are able to separate sensitive configuration data from the codebase, making it easier to manage and secure.

In our application, dotenv was used for the storage of environment variables such as the JWT_SECRET_KEY and the DATABASE_URL which store sentive data.


### jsonwebtoken
jsonwebtoken is a package used to create, sign, and verify JSON Web Tokens (JWTs). JWTs are a compact, URL-safe means of representing claims between two parties, and are typically used for authentication and authorisation in web applications. The jsonwebtoken package provides the tools to work with JWTs, making it easy to implement secure token-based authentication. 

In our application, the jsonwebtoken package was used to handle JWTs for authentication and authorisation through the creation of middleware functions to implement a robust authentication system.


### jest
Jest is an open-source testing framework for JavaScript, primarily designed for testing React applications but also suitable for any JavaScript project. Jest provides a complete and powerful testing solution that includes features such as test runners, assertions, mocking, and coverage reporting. Jest is known for it's simplicity, ease of use, and powerful built-in features that make testing efficient and straightforward.

In our application, jest was used for creating and running the applications automated test suites.


### supertest
SuperTest is a JavaSript library used for testing HTTP APIs. It is built on top of the superagent library and is often used in combination with testing frameworks such as jest to perform end-to-end tests on RESTful APIs. SuperTest simplifies the process of making HTTP requests to an expressJs server or any other NodeJs server, and it provides a set of assertions to verify the responses. SuperTest is particularly useful for testing the functionality of a server, ensuring that endpoints works as expected, and validating that they return the correct status codes, headers, and response bodies.

In our application, SuperTest was used to create all the automated tests for server functionality.


### nodemon
Nodemon is a utility for Node.js that automatically restarts a Node.js application whenever it detects changes in the source files. It is particularly useful during development, as it eleiminates the need to manually stop and start the server every time changes are made to the code. Nodemon monitors the directory where the application is running and triggers a restart when it detects any file modifications, such a adding, deleting, or changing a file.

In our application, Nodemon was used for hot reloading during the development process.


## Source Control Flow
To make the development process more organised, we created multiple feature branches with regular commits and pull requests to track progress and delegate tasks:
![github screenshot](./documents/Screenshot%202024-08-09%20225920.png)


## API Endpoints 

### Users
 - POST /users/signup/
 - POST /users/login/
 - GET /users/
 - PATCH /users/update/
 - DELETE /users/delete/

 ### Menu
- POST /menu/create/item/
- POST /menu/create/category/
- GET /menu/items/
- GET /menu/categories/
- GET /menu/item/:id
- GET /menu/category/:id
- PATCH /menu/update/item/:id
- PATCH /menu/update/category/:id
- DELETE /menu/delete/item/:id
- DELETE /menu/delete/category/:id

### Orders
- POST /orders/
- GET /orders/user/:id
- GET /orders/
- GET /orders/status/:status
- GET /orders/active/
- PATCH /orders/status/:id
- DELETE /orders/delete/:id

### Favourites
- POST /favourites/
- GET /favourites/:id
- PATCH /favourites/:id
- DELETE /favourites/:id






