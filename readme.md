# 🛒 E-Commerce Application

This is a full-stack E-Commerce web application built using React (Vite) for the frontend and ASP.NET Core Web API for the backend.

The project is divided into two main parts:

1.EcommerceAPI → Backend (ASP.NET Core)

2.frontendEcommerce → Frontend (React + Vite)

# ⚙️ Workflow Overview
1. Backend (API Layer)

The backend is developed using ASP.NET Core Web API.
It handles all business logic, database operations, and exposes RESTful endpoints for the frontend.

* Key Components:

1.Controllers – Define API routes and handle HTTP requests.

2.Models – Represent data entities.

3.Data – Includes database context and configuration.

4 Migrations – Manage Entity Framework Core migrations.

5 DTOs – Used for structured data transfer between layers.

*** Run the Backend
cd EcommerceAPI
dotnet run


The API will start (by default on port 5000 or 7067, depending on configuration).

Frontend (Client Layer)

The frontend is built using React + Vite.

It communicates with the backend API to:

1.View products

2.Manage cart

3.Place orders

The frontend uses modern React features such as hooks, context, and component-based architecture for scalability and maintainability.

******Run the Frontend
cd frontendEcommerce
npm install
npm run dev


The development server will start (usually on http://localhost:5173
).

# 🔗 Communication Between Frontend & Backend
Action	Method	Endpoint	Description
Fetch Products	GET	/api/products	Returns a list of all products
Add Order	POST	/api/orders	Creates a new order
Add to Cart	POST	/api/cart	Adds item to the cart
Fetch Cart	GET	/api/cart	Returns items in user’s cart

✅ Make sure both frontend and backend servers are running simultaneously on their respective ports.

# 🧩 Environment Setup
Prerequisites

Node.js → For frontend

.NET SDK → For backend

Visual Studio Code or Visual Studio → For development

# 🚀 Future Improvements

1.Add authentication and authorization (JWT)

2.Integrate payment gateway

3.Build an admin panel for product & order management

4. Enhance UI with animations and better responsiveness
