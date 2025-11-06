# 🧠 SmartShelfX – AI-Based Inventory Forecast & Auto-Restock System

SmartShelfX is a full-stack AI-powered inventory management platform that automates restocking and optimizes inventory levels.  
It uses predictive analytics to forecast demand, prevent stockouts, and improve supply chain efficiency.  
Built with **React (frontend)**, **Spring Boot (backend)**, and **MySQL (database)**.

---

## 🚀 Features Overview

### 🔐 User & Role Management
- Login and registration with roles: **Admin**, **Store Manager**, and **User**
- Secure authentication system with role-based dashboard access  
- Location field included during registration  
- Roles:
  - **Admin** → View system stats, manage users  
  - **Store Manager** → Manage products, view and record sales  
  - **User** → Browse and purchase products  

---

### 🧾 Inventory Management (CRUD Operations)
- Store Manager can **Add / Edit / Delete / View** products  
- Product details include:
  - Product ID, Name, Category, Quantity, Price, Supplier  
- Real-time stock updates reflected across dashboards  

---

### 💰 Sales Management
- Store Manager can record daily or weekly product sales  
- Sales reports can be filtered by date or product  
- Data stored in the database for future AI analysis  

---

### 🛒 User Shopping Dashboard
- Users can view all available products in a **colorful, shopping-style UI**  
- Features **“Add to Cart”** and **“Buy Now”** options  
- Purchases automatically update the **Sales Record Table**  
- Store Manager dashboard reflects new sales instantly  

---

### 🌗 Dark / Light Mode
- Toggle between **Dark** and **Light** themes  
- Smooth transitions and color adjustments for accessibility  
- Theme preference saved locally for user convenience  

---

### 🤖 AI Forecast & Auto-Restock (Upcoming)
- Analyze historical sales data  
- Predict product demand  
- Auto-generate restock suggestions and purchase orders  
- Integration planned with **Python (TensorFlow / Scikit-learn)**  

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Java Spring Boot |
| **Database** | MySQL |
| **Authentication** | JWT-based security |
| **AI Engine (Upcoming)** | Python ML Service |
| **Charts & Reports** | Chart.js / Recharts |

---

## 📊 Dashboards Summary

| Role | Access & Permissions |
|------|-----------------------|
| **Admin** | View all data, manage users, system insights |
| **Store Manager** | Perform CRUD operations, view & record sales |
| **User** | Browse, add to cart, and buy products |

---

## 🌈 UI/UX Highlights
- Clean and colorful interface inspired by modern e-commerce websites  
- Responsive design with grid-based product cards  
- Intuitive navigation between dashboards  
- Professional color palette (teal, blue, gray) for a balanced look  

---

## 📅 Project Roadmap
- [x] Role-based login & dashboards  
- [x] CRUD operations for Store Manager  
- [x] Sales recording and reporting  
- [x] User product shopping feature  
- [x] Dark/Light mode  
- [ ] AI forecasting & auto-restock  
- [ ] Notifications & purchase orders  

---
