# Futflare

Your ultimate time capsule

## Overview

Futflare is a modern web application designed to serve as your ultimate time capsule. It leverages a variety of technologies to provide a seamless and efficient user experience.
The project is still in development and is not yet ready for production. Feel free to contribute to the project.

## Features

-   User authentication with Auth0
-   State management with React Query
-   Styling with Tailwind CSS
-   Routing with React Router
-   Notifications with Sonner

## Technologies Used

-   **Client**: React, TypeScript, Vite
-   **Server**: Go, Fiber
-   **Database**: MongoDB

## Installation

To get started with the project, follow these steps:

### Client

1. Clone the repository:

    ```sh
    git clone https://github.com/yourusername/futflare.git
    cd futflare/client
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Start the development server:
    ```sh
    npm run dev
    ```

### Server

1. Navigate to the server directory:

    ```sh
    cd futflare/server
    ```

2. Install dependencies:

    ```sh
    go mod tidy
    ```

3. Start the server:
    ```sh
    go run cmd/app/main.go
    ```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.
