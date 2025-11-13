import React from 'react';

const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
};

const getEmoji = (conditionText) => {
    const lowerCaseText = conditionText.toLowerCase();
    if (lowerCaseText.includes('sunny') || lowerCaseText.includes('clear')) {
        return '☀️';
    }
    if (lowerCaseText.includes('cloudy') || lowerCaseText.includes('overcast')) {
        return '☁️';
    }
    if (lowerCaseText.includes('rain') || lowerCaseText.includes('drizzle')) {
        return '🌧️';
    }
    if (lowerCaseText.includes('snow') || lowerCaseText.includes('sleet')) {
        return '❄️';
    }
    if (lowerCaseText.includes('thunder') || lowerCaseText.includes('storm')) {
        return '⛈️';
    }
    
    return '⛅';
};


export default function WeatherCard({ dayWeather }) {
    const formattedDate = formatDate(dayWeather.date);
    const emoji = getEmoji(dayWeather.condition.text);
    const highTemp = Math.round(dayWeather.max_temp_c);
    const lowTemp = Math.round(dayWeather.min_temp_c);

    return (
        <div
            className="flex flex-col items-center justify-between p-4 rounded-lg bg-white shadow-md text-[#0B1957] weather-card"
        >
            <div className="text-center mb-2">
                <p className="font-medium text-sm mb-1">
                    {formattedDate}
                </p>
                <p className="text-xs opacity-70">
                    {dayWeather.condition.text}
                </p>
            </div>

            <span className="text-4xl my-2">{emoji}</span>
            <div className="w-full flex justify-between items-center mt-2">
                <div className="flex flex-col items-start">
                    <span className="text-xs font-light opacity-80">Low</span>
                    <span className="text-lg font-medium">
                        {lowTemp}°C
                    </span>
                </div>
                
                <div className="flex flex-col items-end">
                    <span className="text-xs font-light opacity-80">High</span>
                    <span className="text-lg font-bold text-[#B29414]">
                        {highTemp}°C
                    </span>
                </div>
            </div>
        </div>
    );
}