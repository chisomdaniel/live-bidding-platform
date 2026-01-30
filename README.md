# Live Bidding Platform

A real-time auction application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io. This platform allows users to view active auctions, place bids in real-time, and receive instant updates when outbid or when a new high bid is placed.

## Features

- **Real-time Bidding:** Instant bid updates across all connected clients using Socket.io.
- **Live Dashboard:** Visual cues for winning/outbid states and price flashes.
- **Synced Timer:** Auction countdowns synchronized with the server time.
- **User Authentication:** Secure JWT-based registration and login.
- **RESTful API:** Robust backend API for managing users, items, and authentication.

---

## How to Run

You can run this project in two ways: using Docker (recommended for ease) or running the services independently.

### Method 1: Using Docker (Recommended)

This method builds the frontend, sets up the backend, and spins up a MongoDB database automatically.

1.  **Prerequisites:** Ensure you have Docker and Docker Compose installed.
2.  **Run the application:**
    ```bash
    docker-compose up --build
    ```
3.  **Access the app:**
    - Open your browser to `http://localhost:3000`.
    - The backend and frontend are actively promoted on this port.

### Method 2: Running Services Manually

Use this method for local development if you want to run the frontend and backend separately with hot-reloading.

**Prerequisites:** Node.js installed and a local MongoDB instance running on port `27017` (or update `.env` with your Mongo URL).

#### 1. Start the Backend server

```bash
# Install dependencies
npm install

# Start the server (runs on port 3000)
npm run dev
```

#### 2. Start the Frontend client

Open a new terminal window:

```bash
cd client

# Install dependencies
npm install

# Start the React development server
npm run dev
```

- Access the frontend at `http://localhost:5173`.
- The frontend proxies API requests to the backend at `http://localhost:3000`.

## Environment Variables

The project comes with a `.env` file for the backend and `client/.env` for the frontend configuration.

- **Backend (`.env`):**
  - `PORT`: 3000
  - `MONGODB_URL`: Connection string for MongoDB.
  - `JWT_SECRET`: Secret key for signing tokens.

- **Frontend (`client/.env`):**
  - `VITE_BACKEND_URL`: URL of the backend API (default: `http://localhost:3000`).
