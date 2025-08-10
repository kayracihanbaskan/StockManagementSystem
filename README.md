# 📦 Stock Management System

A modern, full-stack stock management application built with **Spring Boot** and **React**. This system provides comprehensive inventory management capabilities with a clean, responsive user interface.

## 🚀 Features

### Backend (Spring Boot)
- **RESTful API** with full CRUD operations
- **JPA/Hibernate** for database operations
- **H2 Database** for development (easily switchable to PostgreSQL/MySQL)
- **Data Validation** with Bean Validation
- **Automatic Data Seeding** with sample data
- **Cascade Delete** operations for data integrity
- **Error Handling** with meaningful error messages
- **Data Cleanup Utilities** for development

### Frontend (React + Vite)
- **Modern React** with functional components and hooks
- **React Router** for navigation
- **Axios** for API communication
- **React Hot Toast** for notifications
- **Responsive Design** with modern CSS
- **Real-time Updates** after CRUD operations

### Core Entities
- **Categories** - Product categorization
- **Products** - Product information with pricing and SKU
- **Inventory** - Stock levels and minimum stock alerts

## 🛠️ Tech Stack

### Backend
- **Java 17+**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **Spring Web**
- **Spring Validation**
- **H2 Database** (Development)
- **Maven** for dependency management

### Frontend
- **React 18**
- **Vite** for build tooling
- **React Router DOM**
- **Axios** for HTTP requests
- **CSS3** with modern styling

## 📋 Prerequisites

- **Java 17** or higher
- **Node.js 16** or higher
- **Maven 3.6** or higher
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd JavaProject
```

### 2. Backend Setup
```bash
cd stock-management
mvn clean install
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`

### 3. Frontend Setup
```bash
cd stock-management-ui
npm install
npm run dev
```

**Happy Coding! 🚀**
