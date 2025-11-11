const express = require('express');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Weather App Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});



app.get('/api/weather', async (req, res) => {
    const location = req.query.location; 

    if (!location) {
        // If the location parameter is missing, send a 400 error.
        return res.status(400).json({ 
            error: "Location parameter 'q' is missing. Please provide a city, zip, or coordinates." 
        });
    }

    try {
        const apiKey = process.env.WEATHER_API_KEY;
        const days = 6; 
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
            // The 5-day forecast array
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
