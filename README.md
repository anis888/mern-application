# MERN Employee Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)  
A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing employees and departments within a company. This project features secure user authentication, role-based access control (employee and manager roles), and a responsive UI built with React Bootstrap.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)

---

## Overview

The **MERN Employee Management System** is designed to streamline employee and department management. Managers can create, edit, and delete departments, assign/remove employees, and view department details in a paginated table. Employees can view their personal and department information. The application ensures that an employee can only belong to one department at a time, with real-time synchronization between departments and user data.

---

## Features

- **User Authentication**: Secure signup and login with JWT-based authentication.
- **Role-Based Access**:
  - **Managers**: CRUD operations for departments, assign/remove employees, pagination for department lists.
  - **Employees**: View personal info and department details.
- **Department Management**:
  - Create/edit departments with fields like name, category, location, and salary.
  - Assign employees via checkboxes, with search functionality.
  - Prevent assigning an employee to multiple departments.
  - Display current department next to assigned employees.
- **Responsive UI**: Built with React Bootstrap for a modern, mobile-friendly design.
- **Scrollable Modals**: Edit department modal with a scrollable body, fixed header/footer.
- **Notifications**: Success/error toasts using `react-toastify`.
- **Database Sync**: Real-time updates between `Department.employeeIds` and `User.departmentId`.

---

## Technologies

- **Frontend**: React.js, React Bootstrap, React Router, Axios, React Icons, React Toastify
- **Backend**: Node.js, Express.js, Mongoose, JWT, Bcrypt
- **Database**: MongoDB
- **Tools**: MongoDB Compass, Postman (for testing), Git

---

## Installation

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- Git

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/anis888/mern_app.git
   cd mern_app
   ```
2. **Install Dependencies**

   ```
   cd server
   npm install
   ```

   ```
   cd ../client
   npm install
   ```

3. **Start the Application**

   ```
   cd server
   node server.js
   ```

   ```
   cd client
   npm start
   ```

4. **Access the Application**
   `http://localhost:3000`
