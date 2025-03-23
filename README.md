# Futflare

Your ultimate time capsule

![image](/assets/images/futflare.png)

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

<p align="center">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white" alt="Go">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white" alt="Auth0">
</p>

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
