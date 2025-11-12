import { CiSearch } from "react-icons/ci";
import cloud from "../assets/images/cloud.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 1. Import axios for the save operation
import SaveLookupModal from "../components/SaveLookupModal";

const API_BASE_URL = "http://localhost:5000/api/history";

// Helper to get today's date for default start date
const getTodayDate = () => new Date().toISOString().split("T")[0];
// Helper to get a date 5 days from now for default end date
const getDefaultEndDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toISOString().split("T")[0];
};

export default function WeatherLookup() {
  const [weatherLocation, setWeatherLocation] = useState("");
  const [startDate, setStartDate] = useState(getTodayDate());
  const [endDate, setEndDate] = useState(getDefaultEndDate());
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal control state
  const navigate = useNavigate();

  // Existing function to check current weather
  const handleWeatherLookup = () => {
    if (weatherLocation.trim()) {
      const encodedLocation = encodeURIComponent(weatherLocation.trim());
      // Navigates to the WeatherDisplay component to fetch and show real-time data
      navigate(`/weather?q=${encodedLocation}`);
    } else {
      alert("Please enter a city, country, or zip code.");
    }
  };

  // Existing function to get current location weather
  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locationQuery = `${lat},${lon}`;
          navigate(`/weather?q=${locationQuery}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please type a city manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // MODIFIED: This function now fetches the data first, then saves it.
  const handleSaveLookup = async (e) => {
    e.preventDefault();

    const locationToSave = weatherLocation.trim();

    if (!locationToSave) {
      return alert("Please enter a location to save.");
    }
    if (new Date(startDate) > new Date(endDate)) {
      return alert("Start date cannot be after the end date.");
    }

    setIsSaving(true);
    let fetchedWeatherData = null;

    try {
      // --- 1. Fetch Weather Data (using your existing API structure) ---
      // Note: Your current server API /api/weather returns up to 14 days of forecast.
      // We will fetch that full object.
      const weatherResponse = await axios.get(
        `http://localhost:5000/api/weather?location=${locationToSave}`
      );
      fetchedWeatherData = weatherResponse.data;

      // --- 2. Construct Payload and Save to History ---
      const savePayload = {
        locationQuery: locationToSave,
        startDate: startDate, // Use user's input start date
        endDate: endDate, // Use user's input end date
        weatherData: fetchedWeatherData, // CRUCIAL: Send the retrieved data object
        notes: `Saved forecast for ${locationToSave} from ${startDate} to ${endDate}.`,
      };

      await axios.post(`http://localhost:5000/api/history`, savePayload);

      alert(
        `Successfully fetched and saved forecast for ${locationToSave} to History!`
      );

      // Optionally clear the location, but we'll just close the modal for now.
      // setWeatherLocation("");
      setIsModalOpen(false);
    } catch (err) {
      console.error(
        "Error during save operation:",
        err.response ? err.response.data : err.message
      );

      // Handle a common 404 (location not found) error from the weather API
      const errorMessage =
        err.response?.data?.error ||
        "Failed to save data. Check location or server connection.";
      alert(`Save failed: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center grow gap-5 weatherLookup bg-[#D1E8FF] min-h-screen">
      <img src={cloud} alt="Rain cloud and sun" className="w-1/5 mb-8" />
      <div className="flex">
        <input
          type="text"
          className="rounded-l-lg p-3 w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#B29414]"
          placeholder="Type the desired City or Country"
          value={weatherLocation}
          onChange={(e) => setWeatherLocation(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleWeatherLookup();
          }}
        />
        <button
          type="button"
          className="rounded-r-lg bg-[#B29414] text-white p-3 hover:bg-[#8f6d0f] transition"
          onClick={handleWeatherLookup}
          title="Search current weather"
        >
          <CiSearch className="text-xl" />
        </button>
      </div>

      <button
        type="button"
        className="px-6 py-2 bg-[#B29414] text-white rounded-full font-semibold hover:bg-opacity-80 transition"
        onClick={handleCurrentLocationClick}
      >
        Check Weather in My Location
      </button>
      <button
        type="button"
        className="mt-4 text-[#0B1957] text-sm hover:underline"
        onClick={() => setIsModalOpen(true)}
      >
        Save a Future Lookup Request
      </button>
      <SaveLookupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        location={weatherLocation}
        startDate={startDate}
        endDate={endDate}
        onLocationChange={setWeatherLocation}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onSave={handleSaveLookup} // Pass the save function
        isSaving={isSaving}
      />
    </main>
  );
}
