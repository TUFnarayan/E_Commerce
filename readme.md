# E-Commerce_Application

This is a full-stack E-Commerce application built using **React (Vite)** for the frontend and **ASP.NET Core Web API** for the backend.

The project is divided into two main parts:
-EcommerceAPI(Backend)
-frontendEcommmerce(frontend)


## Workflow Overview

### 1. Backend (API Layer)
- The backend is developed using **ASP.NET Core Web API**.
- It handles all business logic, database operations, and exposes RESTful endpoints for the frontend.
- Typical modules include:
  - **Controllers** – Define API routes and handle HTTP requests.
  - **Models** – Represent data structures/entities.
  - **Data** – Includes the database context and configuration.
  - **Migrations** – Manages Entity Framework Core migrations for the database.
  - **Dtos** – Used to transfer data between layers.

# Run the backend:
cd backend
dotnet run
The API will start (by default on port 5000 or 7067, depending on configuration).

2. Frontend (Client Layer)
The frontend is built using React + Vite.

It communicates with the backend API to perform all user operations such as viewing products, managing the cart, and placing orders.

Uses modern hooks, context, and component-based architecture for scalability.

Run the frontend:
bash
Copy code
cd frontend
npm install
npm run dev
The development server will start (usually on http://localhost:5173).

# Communication Between Frontend and Backend
The frontend sends HTTP requests (using fetch or axios) to the backend API endpoints.

Example:

Frontend → GET /api/products → Backend returns product list.

Frontend → POST /api/orders → Backend processes and stores the order.

Make sure both frontend and backend are running simultaneously on their respective ports.

#Environment Setup
Prerequisites
1.Node.js (for frontend)

2..NET SDK (for backend)

A code editor such as Visual Studio Code or Visual Studio





#Future Improvements
1.Add authentication and authorization (JWT)

2.Integrate payment gateway

3.Add admin panel for product and order management

4.Enhance UI with animations and better responsiveness

