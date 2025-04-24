# 🧪 Kenility Tech Assessment Project

This project is a full-stack web application composed of a **NestJS backend** and a **Vue frontend**, containerized with Docker and configured for image publishing via GitHub Actions to **AWS Elastic Container Registry (ECR)**.

### Challenge Statement
```
A new company needs to address these requirements:

Create a Node API with Nest.js.
Connect the Node API to MongoDB using nest/mongoose.
Implement JWT as an authentication strategy.

The company needs to store products with a name, SKU, picture (this has to be a file), and price. 
A product can be used to create orders. 
An order has an identifier, client name, total, and product list.

Develop the following endpoints:
  Create a product.
  Request a product.
  Create an order.
  Update an order.
  Get the total sold price in the last month.
  Get the higher amount order
  Bonus: Dockerize MongoDB and the Node API.
```

---

## 📚 Additional Notes

- MongoDB is bundled with the Docker setup for local development.
- The `docker:up` script will automatically build images if they haven't been built already.
- All services run on well-defined ports for easy access:
  - Local development: `4200` (frontend), `3000` (backend)
  - Docker stack: `8080` (frontend), `3000` (backend)

#### 💾 Database Seeding

If the database collections are empty when the backend is run for the first time, it will automatically seed the database with sample data. This includes mock entries for the users, products, and orders collections, ensuring you can immediately start testing the application with meaningful data.

---

## 📁 Project Structure

- **Backend**: NestJS app serving APIs and Swagger documentation
  - `apps/backend`
- **Frontend**: Vue.js single-page application
  - `apps/frontend`
- **CI/CD**: GitHub Actions (`deploy.yml`) for building and publishing Docker images to AWS ECR

---

## 🚀 Getting Started Locally

### 🖥️ Backend

Create an `.env.local` file at `apps/backend/src`

```dotenv
MONGO_URI=<MONGO_DB_URL> // This assumes you have an instance running somewhere
MONGO_USER=<MONGO_DB_USER>
MONGO_PASS=<MONGO_DB_PASS>
MONGO_DATABASE=kenility

JWT_SECRET=3cbe8eb706f7a93feac8ff218282a60eace285a4363ee40cfbaf9cfa2d3aa5a2
JWT_EXPIRES=24h
```

Start the backend service:

```bash
npm run serve:backend
```

- Swagger API Docs: [http://localhost:3000/api](http://localhost:3000/api)

### 🌐 Frontend

Create an `.env` file at `apps/frontend`

```dotenv
VITE_BACKEND_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000/api
```

Start the frontend development server:

```bash
npm run serve:frontend
```

- Frontend App: [http://localhost:4200/](http://localhost:4200/)

---

## 🐳 Dockerized Setup

You can run the full stack locally using Docker, including MongoDB.

### 🔨 Build Docker Images

```bash
npm run docker:build
```

### 📦 Run Docker Stack

```bash
npm run docker:up
```

This command will:

- Build the images if they haven’t already been built
- Spin up the backend, frontend, and a MongoDB container

Once running, the services will be available at:

- **Swagger API Docs**: [http://localhost:3000/api](http://localhost:3000/api)
- **Frontend App**: [http://localhost:8080/](http://localhost:8080/)


#### 💾 Data Persistance

Docker volumes have been mapped to the `storage` folder so the database and file uploads can be persisted if the containers have been stopped and restarted.

---

## ☁️ Deployment to AWS ECR

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` which:

- Builds Docker images for both frontend and backend
- Publishes the images to **Amazon Elastic Container Registry (ECR)**

### 🔧 Prerequisites

To successfully deploy using this workflow, ensure:

- Your AWS credentials are added as **GitHub Actions Secrets**:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `ECR_REPOSITORY_API`
  - `ECR_REPOSITORY_FRONTEND`
- Your repository has permission to push to your AWS ECR registry
- You have set your **ECR repository URIs** correctly in the `deploy.yml` workflow

---

## 🛠️ Scripts Overview

| Script                    | Description                            |
|---------------------------|----------------------------------------|
| `npm run serve:backend`   | Run NestJS backend locally             |
| `npm run serve:frontend`  | Run Vue frontend locally               |
| `npm run docker:build`    | Build Docker images                    |
| `npm run docker:up`       | Start Docker stack (includes MongoDB) |
