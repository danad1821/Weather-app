import React from 'react';
import { CiX, CiCalendar, CiCloud, CiSun, CiDroplet, CiWind } from 'react-icons/ci'; // Added more icons

// Helper function to format the date
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper to filter the saved forecast to the user's requested date range
const filterForecastByDateRange = (forecastArray, start, end) => {
    if (!forecastArray || !start || !end) return [];
    
    const startDate = new Date(start).setHours(0, 0, 0, 0);
    const endDate = new Date(end).setHours(0, 0, 0, 0);

    // Assuming the forecast data structure is { date: 'YYYY-MM-DD', day: { ... } }
    return forecastArray.filter(day => {
        const forecastDate = new Date(day.date).setHours(0, 0, 0, 0);
        return forecastDate >= startDate && forecastDate <= endDate;
    });
};

// Helper to get a relevant icon based on weather condition text
const getWeatherIcon = (conditionText) => {
    const lowerCaseText = conditionText.toLowerCase();
    if (lowerCaseText.includes('sun') || lowerCaseText.includes('clear')) {
        return <CiSun className="text-yellow-500 text-3xl" />;
    } else if (lowerCaseText.includes('cloud') || lowerCaseText.includes('overcast')) {
        return <CiCloud className="text-gray-500 text-3xl" />;
    } else if (lowerCaseText.includes('rain') || lowerCaseText.includes('drizzle')) {
        return <CiDroplet className="text-blue-500 text-3xl" />;
    } else if (lowerCaseText.includes('snow') || lowerCaseText.includes('sleet')) {
        return <span className="text-blue-300 text-3xl">❄️</span>; // Snowflake emoji for snow
    } else if (lowerCaseText.includes('storm') || lowerCaseText.includes('thunder')) {
        return <span className="text-gray-700 text-3xl">⛈️</span>; // Thunderstorm emoji
    }
    return <CiCloud className="text-gray-400 text-3xl" />; // Default icon
};


const ForecastModal = ({ item, onClose }) => {
    if (!item) return null; // Don't render if no item is passed

    // Safely access forecast data and location
    const savedForecast = item.weatherData?.forecast?.forecastday || [];
    const locationName = item.weatherData?.location?.name || item.locationQuery || 'N/A';
    const locationCountry = item.weatherData?.location?.country;

    // Filter the full forecast data to show only the days within the user's saved range
    const dailyForecasts = filterForecastByDateRange(savedForecast, item.startDate, item.endDate);

    return (
        // Modal Overlay: fixed, covers screen, semi-transparent black background, centered content
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            {/* Modal Content: white background, rounded, shadow, specific width/height, scrollable */}
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-3/4 flex flex-col p-6 relative" onClick={(e) => e.stopPropagation()}>
                
                {/* Header Section */}
                <div className="flex justify-between items-start border-b pb-3 mb-3">
                    <h3 className="text-2xl font-bold text-[#0B1957]">
                        Forecast for {locationName} {locationCountry ? `(${locationCountry})` : ''}
                    </h3>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900 transition" aria-label="Close forecast details">
                        <CiX className="text-2xl" />
                    </button>
                </div>
                
                {/* Date Range & Overview */}
                <p className="text-sm text-gray-600 mb-4 flex items-center">
                    <CiCalendar className="mr-2 text-base" />
                    Data saved for: <span className="font-semibold ml-1">{formatDate(item.startDate)} - {formatDate(item.endDate)}</span>
                </p>

                {/* Scrollable Daily Forecasts */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar"> {/* Custom scrollbar class for styling */}
                    {dailyForecasts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {dailyForecasts.map((day, index) => (
                                <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-bold text-[#0B1957]">{formatDate(day.date)}</p>
                                        {getWeatherIcon(day.day.condition.text)}
                                    </div>
                                    <p className="text-sm text-gray-700 font-medium">{day.day.condition.text}</p>
                                    <div className="flex justify-between mt-2 text-sm">
                                        <span className="text-red-600 font-semibold">Max: {Math.round(day.day.maxtemp_c)}°C</span>
                                        <span className="text-blue-600 font-semibold">Min: {Math.round(day.day.mintemp_c)}°C</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <CiDroplet className="mr-1" /> Humidity: {day.day.avghumidity}%
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <CiWind className="mr-1" /> Wind: {day.day.maxwind_kph} kph
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-8 text-gray-500">
                            No detailed forecast data available in this saved record for the specified date range.
                            <br />The original weather API might not have provided data for these specific days.
                        </p>
                    )}
                </div>

                {/* Footer Notes Section (if available) */}
                {item.notes && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                        <h4 className="font-semibold text-[#0B1957] mb-1">Your Notes:</h4>
                        <p className="text-sm italic text-gray-700">{item.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForecastModal;