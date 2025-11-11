

app.get('/api/weather', async (req, res) => {
    // 1. Get the 'location' query parameter sent from the React frontend.
    // This variable will hold either a city name, zip code, or "lat,lon" string.
    const location = req.query.location; 

    // --- Input Validation (Required by Assessment) ---
    if (!location) {
        // If the location parameter is missing, send a 400 error.
        return res.status(400).json({ 
            error: "Location parameter 'q' is missing. Please provide a city, zip, or coordinates." 
        });
    }

    try {
        const apiKey = process.env.WEATHER_API_KEY;
        const days = 5; // To fulfill the "5-day forecast" requirement

        // 2. Construct the API URL for WeatherAPI.com
        // The 'q' parameter is flexible and accepts all supported inputs (City, Lat/Lon, Zip Code).
        const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=${days}&aqi=no`;

        // 3. Make the external API call using axios
        const response = await axios.get(apiUrl);
        const data = response.data;
        
        // 4. Process and Structure the Data
        // Filter the response to send only the data your frontend needs.
        const processedData = {
            location: {
                name: data.location.name,
                country: data.location.country,
                // Include lat/lon for potential future use (e.g., Maps in Assessment 2)
                lat: data.location.lat,
                lon: data.location.lon
            },
            current: {
                temp_c: data.current.temp_c,
                condition: data.current.condition,
                humidity: data.current.humidity,
                wind_kph: data.current.wind_kph,
                feelslike_c: data.current.feelslike_c,
                // ... add other fields as needed
            },
            // The 5-day forecast array
            forecast: data.forecast.forecastday.map(day => ({
                date: day.date,
                max_temp_c: day.day.maxtemp_c,
                min_temp_c: day.day.mintemp_c,
                condition: day.day.condition,
                // ... add other forecast details
            }))
        };

        // 5. Send the cleaned JSON data back to the React frontend
        res.json(processedData);

    } catch (error) {
        // --- Error Handling (Fulfills Validation Requirement) ---

        // Check for common external API errors (like invalid location)
        if (error.response && error.response.status === 400 && error.response.data.error.code === 1006) {
            // WeatherAPI.com error code 1006 means "No matching location found"
            return res.status(404).json({ 
                error: `Location not found for "${location}". Please refine your search.` 
            });
        }
        
        // Handle other possible server or API key errors
        console.error("External Weather API Error:", error.message);
        res.status(500).json({ error: "An unexpected error occurred while fetching weather data." });
    }
});

// REMEMBER to connect this route to your main Express app if it's in a separate file:
// app.use('/api', weatherRoutes);