# Environment vars
This project uses the following environment variables:

| Name                          | Description                                                           |
| ----------------------------- | ------------------------------------|
|DB_NAME           | name for db ( for example 'books')
|COOKIE_KEY           | any name for cookie secret


create new file in the root ( .env.developmment and put variables inside)



# Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version v14.5.0



# Getting started
- Clone the repository
```
git clone  project url
```
- Install dependencies
```
cd <project_name>
npm install
```
- Build and run the project
```
npm start    or  npm run start:dev
```
  Navigate to `http://localhost:3000`

- API Document endpoints
  swagger Endpoint : http://localhost:3000/api

 *Note for Swagger UI and Swagger Editor users: Cookie authentication is currently not supported for "try it out" requests due to browser security restrictions.*


## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| **dist**                 | Contains the distributable (or output) from your TypeScript build.  |
| **node_modules**         | Contains all  npm dependencies                                                            |
| **src**                  | Contains  source code that will be compiled to the dist dir                               |
| **src/interceptors**           | All interceptors
| **src/guards**           | All the guards in the app  |
| **src**/main.ts         | Entry point to nest app app                                                               |
| package.json             | Contains npm dependencies as well as [build scripts](#what-if-a-library-isnt-on-definitelytyped)   | tsconfig.json            | Config settings for compiling source code only written in TypeScript
| tslint.json              | Config settings for TSLint code style checking                                                |


### Running the build
All the different build steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build and runs node on dist/index.js. Can be invoked with `npm start`                  |
| `build:dev`                   | Full build. Runs ALL build tasks with all watch tasks        |
| `dev`                   | Runs full build before starting all watch tasks. Can be invoked with `npm dev`                                         |
| `test`                    | Runs build and run tests using mocha        |
| `lint`                    | Runs TSLint on project files       |


### Running unit tests using NPM Scripts
````
npm run test
````


### Running E2E tests using NPM Scripts
````
npm run test:e2e
````
