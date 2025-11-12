# ☀️ Dana Dabdoub's Weather App 🌧️

This is a full-stack weather application built using **React (Vite)**, **Node.js/Express**, and **MongoDB**. It successfully implements all requirements for Technical Assessment 1 and the mandatory **CRUD** features of Technical Assessment 2.

---

## 🚀 How to Run? ##

This project uses a standard client/server architecture and requires two separate terminal windows to run.

### Prerequisites

* **Node.js** (LTS recommended)
* **npm** (Node Package Manager)
* **MongoDB Instance** (Local or Atlas)

### 1. Installation

First, ensure you install dependencies in both the client (`weather-app`) and server (`server`) directories.

```bash
# In the project root:
cd weather-app && npm install

# Then, navigate into the server folder:
cd server && npm install
```

### 2. Start the Backend (Server)

In your **first terminal**, navigate to the server directory and start the Node.js Express server.
```bash
cd server
node index.mjs
# The server should start on http://localhost:5000 and connect to MongoDB.
```

### 3. Start the Frontend (Client)
In a **second terminal**, navigate back to the root directory (weather-app) and run the development server.
```bash
cd weather-app
npm run dev
```

* Open the localhost link that appears in your terminal (e.g., http://localhost:5173).
* The application should now be fully functional.
