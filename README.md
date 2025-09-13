<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Title

My first backend project on [Nest js](https://github.com/nestjs/nest).

## Description

This project is a backend application built with NestJS and MongoDB. It provides an authorization system and transactions management.

The src folder contains several subfolders and TypeScript files that implement the main features of the project.

### 1. Auth folder

* Contains all files related to user authentication and authorization:

* dto/ – Data Transfer Objects for requests like login, registration, and token validation.

* interceptors/ – Custom interceptors, for example, to handle responses or errors.

* interfaces/ – TypeScript interfaces describing the shape of user data, DTOs, or token payloads.

* schemas/ – Mongoose schemas defining the User model and its fields.

* auth.controller.ts – Handles all authentication endpoints (e.g., login, registration, token check).

* auth.module.ts – The NestJS module that bundles the auth services, controller, and providers.

* auth.service.ts – Contains the business logic for authentication, including JWT token generation, verification, and user management.

### 2. Transactions folder

* Contains all files related to transactions management:

* dto/ – DTOs for creating or updating transactions with validation rules.

* interfaces/ – TypeScript interfaces describing transactions and created transaction objects.

* schemas/ – Mongoose schema defining the Transaction model.

* transactions.controller.ts – Handles HTTP endpoints for transactions (create, update, delete, fetch).

* transactions.module.ts – NestJS module that bundles the transactions service, controller, and schemas.

* transactions.service.ts – Contains the business logic for creating, updating, and retrieving transactions. Handles user ownership verification.transactions folder

* Contains all files related to transactions management:

* dto/ – DTOs for creating or updating transactions with validation rules.

* interfaces/ – TypeScript interfaces describing transactions and created transaction objects.

* schemas/ – Mongoose schema defining the Transaction model.

* transactions.controller.ts – Handles HTTP endpoints for transactions (create, update, delete, fetch).

* transactions.module.ts – NestJS module that bundles the transactions service, controller, and schemas.

* transactions.service.ts – Contains the business logic for creating, updating, and retrieving transactions. Handles user ownership verification.

### 3. Global folder

* Contains global guards or providers used across the application.

* For example, the token guard checks the validity of JWT tokens and protects routes from unauthorized access.

### 4. Other files in src

* utils/ – Utility functions used across modules (like helpers or validators).

* app.module.ts – The root NestJS module importing all feature modules (auth, transactions, global).

* main.ts – The entry point of the application, initializes the NestJS server.

## Technologies

This project includes technologies such as

    1. .env file       - safety
    2. JWT token       - Secure token
    3. MongoDB         - database
    4. Mongoose        - ODM
    5. Class-validator - validation

## How to start?
To start project first of all you need to set up node modules

```bash
$ npm install
```
Or you can also type
```
$ npm i
```

Then you need to type last command

```bash
$ npm start --watch
```
And here you are, you have turned on the project