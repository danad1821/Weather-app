import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import axios from 'axios'

// require('dotenv').config();
import { ObjectId } from 'mongodb';
import db from "./conn.mjs";



const app = express();

const PORT = process.env.PORT || 5000;
const COLLECTION_NAME = "weather_history";

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Weather App Backend is running!');
});


app.get('/api/weather', async (req, res) => {
    const location = req.query.location; 

    if (!location) {
        return res.status(400).json({ 
            error: "Location parameter 'q' is missing. Please provide a city, zip, or coordinates." 
        });
    }

    try {
        const apiKey = process.env.WEATHER_API_KEY;
        // Fetch 14 days for future flexibility in saving history
        const days = 14; 
        const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${days}&aqi=no`;

        const response = await axios.get(apiUrl);
        const data = response.data;
        
        const processedData = {
            location: {
                name: data.location.name,
                country: data.location.country,
                lat: data.location.lat,
                lon: data.location.lon
            },
            current: {
                temp_c: data.current.temp_c,
                condition: data.current.condition,
                humidity: data.current.humidity,
                wind_kph: data.current.wind_kph,
                feelslike_c: data.current.feelslike_c,
            },
            // The full forecast array (up to 14 days)
            forecast: data.forecast.forecastday.map(day => ({
                date: day.date,
                max_temp_c: day.day.maxtemp_c,
                min_temp_c: day.day.mintemp_c,
                condition: day.day.condition,
            }))
        };

        res.json(processedData);

    } catch (error) {

        if (error.response && error.response.status === 400 && error.response.data.error.code === 1006) {
            return res.status(404).json({ 
                error: `Location not found for "${location}". Please refine your search.` 
            });
        }
        
        console.error("External Weather API Error:", error.message);
        res.status(500).json({ error: "An unexpected error occurred while fetching weather data." });
    }
});


// CREATE: Save a new weather query and its data
app.post('/api/history', async (req, res) => {
    try {
        const { locationQuery, startDate, endDate, weatherData, notes } = req.body;

        if (!locationQuery || !weatherData || !startDate || !endDate) {
            return res.status(400).json({ error: "Missing required fields: locationQuery, startDate, endDate, or weatherData." });
        }

        const newRecord = {
            locationQuery,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            weatherData,
            notes: notes || "", 
            createdAt: new Date(),
        };
        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.insertOne(newRecord);

        // Respond with the newly created document's ID
        res.status(201).json({ 
            _id: result.insertedId, 
            message: "Weather history saved.",
            ...newRecord
        });

    } catch (error) {
        console.error("CREATE Error:", error.message);
        res.status(500).json({ error: "Failed to save weather data to history." });
    }
});

// READ: Fetch all historical weather lookups
app.get('/api/history', async (req, res) => {
    try {
        // The location parameter is now read from the URL query string (e.g., /api/history?location=London)
        const locationFilter = req.query.location; 

        const collection = db.collection(COLLECTION_NAME);
        
        const filter = {};
        
        if (locationFilter) {
            // Use a MongoDB Regular Expression to perform a case-insensitive search
            // for the location string within the 'locationQuery' field.
            filter.locationQuery = { $regex: locationFilter, $options: 'i' };
        }
        
        // Fetch data using the constructed filter and sort by creation date descending
        const history = await collection.find(filter).sort({ createdAt: -1 }).toArray();
        
        res.json(history);
    } catch (error) {
        console.error("READ Error:", error.message);
        res.status(500).json({ error: "Failed to fetch weather history." });
    }
});

// U - UPDATE: Update notes for a specific history item
app.patch('/api/history/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { notes } = req.body; 

        if (notes === undefined) {
            return res.status(400).json({ error: "No 'notes' field provided for update." });
        }

        const collection = db.collection(COLLECTION_NAME);
        
        const result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { notes, updatedAt: new Date() } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "History item not found." });
        }

        res.status(200).json({ message: "History item updated successfully." });

    } catch (error) {
        console.error("UPDATE Error:", error.message);
        // Handle invalid MongoDB ID format error
        if (error.name === 'BSONTypeError') {
            return res.status(400).json({ error: "Invalid ID format." });
        }
        res.status(500).json({ error: "Failed to update weather history item." });
    }
});

// DELETE: Delete a specific history item
app.delete('/api/history/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const collection = db.collection(COLLECTION_NAME);
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "History item not found." });
        }

        res.status(200).json({ message: "History item deleted successfully.", id });

    } catch (error) {
        console.error("DELETE Error:", error.message);
        if (error.name === 'BSONTypeError') {
            return res.status(400).json({ error: "Invalid ID format." });
        }
        res.status(500).json({ error: "Failed to delete weather history item." });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});