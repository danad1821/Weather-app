import { CiSearch } from "react-icons/ci";
import cloud from "../assets/images/cloud.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function WeatherLookup() {
  const [weatherLocation, setWeatherLocation] = useState("");
  const navigate = useNavigate();

  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success Callback
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          console.log(`Current Location: Lat=${lat}, Lon=${lon}`);
          const locationQuery = `${lat},${lon}`;
          navigate(`/weather?q=${locationQuery}`);
        },
        // Error Callback
        (error) => {
          // Handle cases where the user denies access or an error occurs
          console.error("Error getting location:", error);
          alert("Could not get your location. Please type a city manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleWeatherLookup = () => {
    if (weatherLocation.trim()) {
      const encodedLocation = encodeURIComponent(weatherLocation.trim());
      navigate(`/weather?q=${encodedLocation}`);
      
    } else {
      alert("Please enter a city, country, or zip code.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center grow gap-5 weatherLookup">
      <img src={cloud} alt="Rain cloud and sun" className="w-1/5" />
      <div className="">
        <input
          type="text"
          className="rounded-lg"
          placeholder="Type the desired City or Country"
          value={weatherLocation}
          onChange={(e)=>setWeatherLocation(e.target.value)}
        />
        <button type="button" className="rounded-lg" onClick={handleWeatherLookup}>
          <CiSearch className="" />
        </button>
      </div>
      <button type="button" onClick={handleCurrentLocationClick}>Check Weather in My Location</button>
    </main>
  );
}
