import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import WeatherCard from "../components/WeatherCard";
import { useNavigate } from "react-router-dom";
import History from "../components/History";

const getCurrentWeatherEmoji = (conditionText, currentTempC) => {
  const lowerCaseText = conditionText.toLowerCase();
  let emoji = "❓"; // Default

  // Logic based on condition text
  if (lowerCaseText.includes("sunny") || lowerCaseText.includes("clear")) {
    emoji = "☀️";

    // Temperature-based modification for clear/sunny days
    if (currentTempC >= 30) {
      emoji = "😎"; // Hot: Sun with sunglasses
    } else if (currentTempC < 10) {
      emoji = "🥶"; // Cold: Freezing face
    }
  } else if (lowerCaseText.includes("partly cloudy")) {
    emoji = "⛅";
  } else if (
    lowerCaseText.includes("cloudy") ||
    lowerCaseText.includes("overcast")
  ) {
    emoji = "☁️";
  } else if (
    lowerCaseText.includes("rain") ||
    lowerCaseText.includes("drizzle") ||
    lowerCaseText.includes("showers")
  ) {
    emoji = "🌧️";
  } else if (
    lowerCaseText.includes("snow") ||
    lowerCaseText.includes("sleet") ||
    lowerCaseText.includes("blizzard")
  ) {
    emoji = "❄️";
  } else if (
    lowerCaseText.includes("thunder") ||
    lowerCaseText.includes("storm")
  ) {
    emoji = "⛈️";
  }

  return emoji;
};

export default function WeatherDisplay() {
  const [searchParams] = useSearchParams();
  const locationQuery = searchParams.get("q");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Placeholder data for rendering before API response arrives
  const dummyForecast = [
    { day: "Wed", high: 25, low: 18, icon: "☀️" },
    { day: "Thu", high: 22, low: 15, icon: "☁️" },
    { day: "Fri", high: 19, low: 14, icon: "🌧️" },
    { day: "Sat", high: 20, low: 16, icon: "🌤️" },
    { day: "Sun", high: 24, low: 17, icon: "☀️" },
  ];

  const fetchWeatherData = async () => {
    await fetch(`http://localhost:5000/api/weather?location=${locationQuery}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || "Location not found.");
          });
        }
        return res.json();
      })
      .then((data) => {
        setWeatherData(data);
        console.log(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setError(err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!locationQuery) {
      setError("No location provided.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    fetchWeatherData();
  }, [locationQuery]);

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-center grow bg-[#D1E8FF] h-screen text-[#0B1957] text-xl">
        Loading weather data...
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center grow bg-[#D1E8FF] h-screen text-red-700 text-xl">
        Error: {error}
        <button type="button" onClick={() => navigate("/")}>
        Search another location
      </button>
      </main>
    );
  }

  const locationName = weatherData?.location?.name || "Unknown Location";
  const country = weatherData?.location?.country || "Unknown Country";
  const currentTemp = weatherData?.current?.temp_c || "N/A";
  const conditionText = weatherData?.current?.condition?.text || "Clear";
  const currentEmoji = getCurrentWeatherEmoji(conditionText, currentTemp);
  return(
    <main className="flex flex-col items-center justify-center grow bg-[#D1E8FF]">
      {locationName && country && (
        <h1 className="text-4xl font-bold mb-1">
          {locationName}, {country}
        </h1>
      )}

      {/* Weather Icon */}
      {currentEmoji && (
        <div className="text-9xl my-4 text-[#B29414]">
          {currentEmoji || "☀️"}
        </div>
      )}

      {/* Temperature */}
      {currentTemp && (
        <p className="text-8xl font-extrabold">{currentTemp}°C</p>
      )}
      {conditionText && <p className="text-xl mt-2">{conditionText}</p>}

      {/* Detail Stats Grid */}
      <div className="grid grid-cols-3 gap-6 mt-8 p-4 bg-white/50 rounded-xl shadow-lg text-sm text-center max-w-xs">
        <div>
          <p className="font-semibold">Humidity</p>
          <p>{weatherData?.current?.humidity || "N/A"}%</p>
        </div>
        <div>
          <p className="font-semibold">Wind</p>
          <p>{weatherData?.current?.wind_kph || "N/A"} kph</p>
        </div>
        <div>
          <p className="font-semibold">Feels Like</p>
          <p>{weatherData?.current?.feelslike_c || "N/A"}°C</p>
        </div>
      </div>
      <section
        className="w-full max-w-xl mt-8 p-20 rounded-xl bg-[#DBDBDB] shadow-inner"
        style={{ padding: "25px" }}
      >
        <h2 className="text-xl font-bold text-[#0B1957] mb-4 text-center ">
          5-Day Forecast
        </h2>
        {/* Use a grid layout for a clean, modern look */}
        <div className="flex justify-center items-center flex-wrap">
          {weatherData?.forecast?.slice(1, 6).map((dayData, index) => (
            <WeatherCard key={index} dayWeather={dayData} />
          ))}
        </div>
      </section>
      <History locationFilter={locationQuery}/>

      <button type="button" className="back-btn" onClick={() => navigate("/")}>
        Search another location
      </button>
    </main>
  );
}
