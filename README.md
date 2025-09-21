# Project Management Tool

This is a full-stack project management tool with a Node.js backend and a Vue.js frontend.

## Table of Contents

- [Project Management Tool](#project-management-tool)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
  - [Usage](#usage)
  - [API Documentation](#api-documentation)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

This project aims to provide a comprehensive tool for managing projects, tasks, and users. It's designed to be intuitive and efficient for individuals and teams.

## Features

- User authentication and authorization
- Project creation and management
- Task creation, assignment, and tracking
- User-friendly interface

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (LTS version recommended)
- npm or Yarn
- Git

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up your environment variables. Create a `.env` file in the `backend` directory based on `.env.example` (if available) or the required variables.
4.  Run database migrations:
    ```bash
    npx sequelize db:migrate
    ```
5.  (Optional) Seed the database with initial data:
    ```bash
    npx sequelize db:seed:all
    ```
6.  Start the backend server:
    ```bash
    npm start
    ```
    The backend server will typically run on `http://localhost:3000`.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm run dev
    ```
    The frontend application will typically run on `http://localhost:5173`.

## Usage

Once both the backend and frontend servers are running, open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`). You can then register a new user, log in, and start managing your projects and tasks.

## API Documentation

(To be added: Details on API endpoints, request/response formats, and authentication.)

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.
