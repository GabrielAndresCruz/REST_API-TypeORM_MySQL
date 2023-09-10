# Books REST API

This is a RESTful API that allows users to view and manage books, authors, and their information.

## Features

- CRUD operations for Books, Authors and Users.
- Authentication with JWT.
- Validation with Class Validator
- Error handling

## Technologies

- Node.js
- TypeScript
- Express
- MySQL
- TypeORM
- Class Validator
- JWT

## Instalation

1. Clone the repository: `https://github.com/GabrielAndresCruz/REST_API-TypeORM_MySQL.git`
2. Go to the folder repo, and use the `.env.template` for create `.env` file. Declare the necessary variables for the app and for the db.
3. Install dependencies typing `npm install` in the console.

## Running

1. Run the docker container with `docker compose up` in root directory.
2. In another console but in the same directory, run the following command `npm run migration:run`.

This commands will build and run the docker container for the app and the MySQL database. You can access the app at `http://localhost:3000`

Make sure that you have docker installed on your computer before running this commands. If you don't have docker installed, you can download [here](https://www.docker.com/get-started)

## Scripts

- `dev`: Run the server.
- `migration:show`: Shows all the executed migrations.
- `migration:create`: Creates a new migration. You need to provide a name for the migration after the command.
- `migration:run`: Runs all pending migrations.
- `migration:revert`: Reverts the last executed migration.

## API endpoints

### Books

- `GET /books`: Get all books
- `GET /books/:id`: Get an books by ID
- `POST /books`: Create a new book
- `PUT /books/:id`: Update a book by ID
- `DELETE /books/:id`: Delete a book by ID

### Authors

- `GET /authors`: Get all authors
- `GET /authors/:id`: Get an author by ID
- `POST /authors`: Create a new author
- `PUT /authors/:id`: Update an author by ID
- `DELETE /authors/:id`: Delete an author by ID

### Authentication

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login user
- `GET /auth/user`: Verify user logged
- `POST /auth/refresh`: Refresh user token
- `GET /auth/logout`: Logout user
