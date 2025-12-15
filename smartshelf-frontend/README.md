# 🚀 SmartShelf: AI-Powered Inventory Management System

**SmartShelf** is a secure, role-based platform designed to optimize retail inventory management.  
It uses an **AI-powered forecasting module** to predict demand, automates the purchase order workflow, and provides **real-time sales reporting** and **critical stock alerts**.

---

## 🌟 Key Features

### 🔐 Role-Based Access Control (RBAC)
- Secure authentication and authorization using **JWT (JSON Web Tokens)**.
- Roles: **ADMIN**, **STORE_MANAGER**, and **USER**.

### 📦 Product Management
- Full **CRUD** (Create, Read, Update, Delete) functionality for inventory items.

### 📊 Sales Reporting
- Dynamic, date-filtered **sales data visualization** (Revenue Trend Graph).
- Accurate **Total Revenue** calculation.

### 📁 Data Export
- Export detailed sales reports to **Excel (.xlsx)**.

### 🤖 AI Demand Forecasting
- Predicts future stock needs using historical sales data.
- Provides intelligent **restock suggestions**.

### ⚙️ Automated Restock Workflow
- Manages **Purchase Orders (PO)** through status transitions:
  ```
  PENDING → APPROVED → RECEIVED
  ```
- Automatically updates inventory levels upon receipt.

### 🚨 Critical Stock Alerts
- Real-time dashboard alerts for items below critical thresholds.

---

## 💻 Technology Stack

| Component | Technology | Description |
|------------|-------------|-------------|
| **Backend** | Java 17, Spring Boot 3 | Handles business logic, security (JWT), and REST API endpoints. |
| **Frontend** | React, JavaScript | Built with React Router, Material-UI (MUI) for UI/UX, and Recharts for visualization. |
| **Database** | MySQL / MariaDB | Persistent storage for all entities (Users, Products, Sales, POs, etc.). |
| **Security** | JSON Web Tokens (JWT) | Stateless authentication and token-based authorization. |

---

## 🛠️ Setup and Installation Guide

To run **SmartShelf** locally, you’ll need to set up the **Backend**, **Database**, and **Frontend** separately.

---

### 1️⃣ Database Setup (MySQL)

1. Ensure you have **MySQL** or **MariaDB** running.
2. Create a new database named:
   ```sql
   CREATE DATABASE smartshelf_db;
   ```
3. The Spring Boot application will automatically create all necessary tables (`users`, `products`, `sales`, `purchase_orders`, etc.) via Hibernate/JPA.

---

### 2️⃣ Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd smartshelf-backend/
   ```

2. Configure **application.properties**:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smartshelf_db
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password
   spring.jpa.hibernate.ddl-auto=update
   ```

   *(Optional) Configure JWT secrets if necessary.*

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

   The backend should start on:  
   👉 http://localhost:8080

---

### 3️⃣ Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd smartshelf-frontend/
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

   If you face dependency issues (e.g., with `jspdf-autotable`), try:
   ```bash
   npm install --force
   ```

3. Run the frontend:
   ```bash
   npm start
   ```

   The application will open in your browser at:  
   👉 http://localhost:3000

---

## 🔑 Default Credentials

For initial testing, use the following default users (ensure they are seeded manually or via API):

| Role | Username | Password | Access Level |
|------|-----------|-----------|---------------|
| **ADMIN** | admin | password | Full Control, User Management |
| **MANAGER** | manager | password | Product CRUD, AI, Reports, Restock |
| **USER** | user | password | Shopping / Viewing |

---

