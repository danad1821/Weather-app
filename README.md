# Dana Dabdoub's Weather App 

This is a full-stack weather application built using **React (Vite)**, **Node.js/Express**, and **MongoDB**. It successfully implements all requirements for Technical Assessment 1 and the mandatory **CRUD** features of Technical Assessment 2.

---

## How to Run? ##

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
cd weather-app\server
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

## What I Did? ##
### 1. Core Functionality (Technical Assessment 1) ###
* Weather Lookup: Implemented a robust search feature in `WeatherLookup.jsx` to find weather data using various inputs (City, Country, ZIP/Postal Code, or Coordinates).
* Geolocation Support: Added a "Check Weather in My Location" button that uses the browser's Geolocation API to fetch weather data based on GPS coordinates.
* 5-Day Forecast: The `WeatherDisplay.jsx` component successfully retrieves and displays the current weather conditions and a 5-day forecast using the external WeatherAPI.
* User Interface: Utilized React and Tailwind CSS to build a responsive, single-page application (SPA) with clear navigation and component separation (`Header.jsx`, `Footer.jsx`, `WeatherCard.jsx`).
* Info Button: Implemented the required Info modal (`Header.jsx`) to display a description of the Product Manager Accelerator program.

### 2. Data Persistence & History (Technical Assessment 2 - CRUD Implemented) ###
All CRUD operations are implemented on the weather_history MongoDB collection, managed by the Express backend (`index.mjs`) and accessed by the frontend (`History.jsx`).

## Notes: ##
* **Environment Variables:** I have committed the .env file containing the MongoDB connection string and the WeatherAPI key for immediate testing and evaluation. I am aware this is not standard security practice and would use a secure vault for production environments.
* **Technologies:** Frontend: React (Vite), React Router, Axios, Tailwind CSS. Backend: Node.js, Express, MongoDB.
