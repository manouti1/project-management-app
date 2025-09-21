# Project Management Tool - Backend

This is the backend for a simple project management tool, built with Node.js, Express.js, and Sequelize.

## Features

- User Authentication (Register, Login)
- Project Management (CRUD operations)
- Task Management (CRUD operations)
- JWT-based Authentication
- Project Authorization (only creator can edit/delete projects)

## Technologies Used

- Node.js
- Express.js
- Sequelize (ORM for SQLite database)
- SQLite (development database)
- JSON Web Token (JWT) for authentication
- bcrypt for password hashing
- express-validator for request validation
- cors for handling Cross-Origin Resource Sharing
- dotenv for environment variable management

## Setup

### Prerequisites

- Node.js (LTS version recommended)
- npm or Yarn

### Installation

1.  Clone the repository (if not already done).
2.  Navigate to the `backend` directory:
    ```bash
    cd path/to/your/project-management-tool/backend
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or yarn install
    ```

### Environment Variables

Create a `.env` file in the root of the `backend` directory with the following content:

```
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
```

-   `JWT_SECRET`: A strong, random string used for signing JWT tokens. You can generate one using `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
-   `PORT`: The port on which the server will run (default is 3000).

### Database Setup

This project uses Sequelize for database management. The development database is SQLite.

1.  Run database migrations to create tables:
    ```bash
    npx sequelize-cli db:migrate
    ```
2.  (Optional) Seed the database with demo data:
    ```bash
    npx sequelize-cli db:seed:all
    ```

## Running the Application

To start the backend server:

```bash
npm start
# or node src/index.js
```

The server will run on the port specified in your `.env` file (default: `http://localhost:3000`).

## API Endpoints

The API endpoints are documented in the Postman collection. You can import the `postman/generated_collection.json` file into Postman to easily interact with the API.

### Authentication

-   **Register:** `POST /api/auth/register`
    -   Body: `{ "username": "string", "email": "string", "password": "string" }`
-   **Login:** `POST /api/auth/login`
    -   Body: `{ "email": "string", "password": "string" }`
    -   Returns a JWT token upon successful login.

### Projects

-   **Create Project:** `POST /api/projects` (Requires authentication)
    -   Body: `{ "name": "string", "description": "string" }`
-   **Get All Projects:** `GET /api/projects` (Requires authentication)
-   **Get Project by ID:** `GET /api/projects/:id` (Requires authentication)
-   **Update Project:** `PUT /api/projects/:id` (Requires authentication, only creator)
    -   Body: `{ "name": "string", "description": "string" }`
-   **Delete Project:** `DELETE /api/projects/:id` (Requires authentication, only creator)

### Tasks

-   **Create Task:** `POST /api/tasks` (Requires authentication)
    -   Body: `{ "name": "string", "description": "string", "projectId": "integer" }`
-   **Get All Tasks:** `GET /api/tasks` (Requires authentication)
-   **Get Task by ID:** `GET /api/tasks/:id` (Requires authentication)
-   **Update Task:** `PUT /api/tasks/:id` (Requires authentication)
    -   Body: `{ "name": "string", "description": "string", "status": "string" }`
-   **Delete Task:** `DELETE /api/tasks/:id` (Requires authentication)

## Authentication Flow

1.  **Register** a new user or **Login** with existing credentials.
2.  The login endpoint will return a **JSON Web Token (JWT)**.
3.  Include this JWT in the `Authorization` header of subsequent requests to protected routes, in the format `Bearer <your_jwt_token>`.

## Authorization

-   **Project Ownership:** Only the user who created a specific project can update or delete that project. Attempts by other users will result in a `403 Forbidden` error.

## Postman Collection

A Postman collection (`postman/generated_collection.json`) has been generated to help you test the API endpoints. Import this file into Postman.

## Future Enhancements

-   User roles and permissions.
-   More robust error handling and logging.
-   Integration with a frontend application.
-   Additional task fields (due date, priority).
-   Filtering, sorting, and more advanced pagination for projects and tasks.
