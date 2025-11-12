import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { CiTrash, CiEdit, CiSquareCheck } from "react-icons/ci";

// Assuming your backend is running on http://localhost:5000
const API_BASE_URL = "http://localhost:5000/api/history";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);

  // Check if the Date object is valid (returns NaN for Invalid Date)
  if (isNaN(date.getTime())) {
    // This will now clearly show "Invalid Date" if the string is malformed
    return "Invalid Date";
  }

  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

// Helper to get average max temp for display
const getAvgTemp = (forecast) => {
  if (!forecast || forecast.length === 0) return "N/A"; // Only use the first 5 days for a representative average
  const relevantForecast = forecast.slice(0, 5);
  const sumOfHighs = relevantForecast.reduce(
    (sum, day) => sum + day.max_temp_c,
    0
  );
  return `${Math.round(sumOfHighs / relevantForecast.length)}°C`;
};

// NEW: Helper to get the weather condition emoji
const getEmoji = (conditionText) => {
  const lowerCaseText = conditionText.toLowerCase();
  if (lowerCaseText.includes("sunny") || lowerCaseText.includes("clear"))
    return "☀️";
  if (lowerCaseText.includes("cloudy") || lowerCaseText.includes("overcast"))
    return "☁️";
  if (
    lowerCaseText.includes("rain") ||
    lowerCaseText.includes("drizzle") ||
    lowerCaseText.includes("showers")
  )
    return "🌧️";
  if (lowerCaseText.includes("snow") || lowerCaseText.includes("sleet"))
    return "❄️";
  if (lowerCaseText.includes("thunder") || lowerCaseText.includes("storm"))
    return "⛈️";
  return "⛅";
};

// NEW: Component for displaying the detailed forecast in a modal
const ForecastModal = ({ isOpen, onClose, forecastData }) => {
  if (!isOpen || !forecastData) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 60 }}>
      <div
        className="modal-content"
        style={{ maxWidth: "600px", padding: "30px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-[#0B1957] mb-4">
          Forecast for {forecastData.location}
        </h3>
        {/* Forecast Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {/* The forecastData.forecast array is now pre-filtered to the saved date range */}
          {forecastData.forecast.map((day, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center"
            >
              <p className="text-md font-semibold text-[#0B1957]">
                {formatDate(day.date)}
              </p>
              <span className="text-3xl my-2">
                {getEmoji(day.condition.text)}
              </span>
              <p className="text-sm italic text-gray-600 mb-2">
                {day.condition.text}
              </p>
              <div className="flex justify-around text-xs mt-2">
                <span className="font-bold text-[#B26414]">
                  High: {Math.round(day.max_temp_c)}°C
                </span>
                <span className="text-[#0B1957]">
                  Low: {Math.round(day.min_temp_c)}°C
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <button
            style={{ color: "white" }}
            onClick={onClose}
            className="px-4 py-2 text-sm text-white bg-[#0B1957] rounded-full hover:bg-[#081546] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function History({ locationFilter }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isToggled, setIsToggled] = useState(false); // State to control visibility // State for the Edit Notes Modal

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newNotes, setNewNotes] = useState(""); // NEW State for the Forecast Modal

  const [isForecastModalOpen, setIsForecastModalOpen] = useState(false);
  const [selectedForecast, setSelectedForecast] = useState(null); // --- READ Operation ---

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true); // 5. RE-INTEGRATED FILTER LOGIC: Use locationFilter to construct the query URL.
      const url = locationFilter
        ? `${API_BASE_URL}?location=${encodeURIComponent(locationFilter)}`
        : API_BASE_URL;

      const response = await axios.get(url); // Sort by createdAt descending to show latest first
      setHistory(
        response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      );
      setError(null);
    } catch (err) {
      console.error("Failed to fetch history:", err);
      setError("Could not load weather history. Check server status.");
    } finally {
      setLoading(false);
    }
  }, [locationFilter]); // ADDED: locationFilter as dependency // Fetch history when component is toggled on or when locationFilter changes

  useEffect(() => {
    if (isToggled) {
      fetchHistory();
    }
  }, [isToggled, fetchHistory]); // NEW: Handlers for the Forecast Modal

  const openForecastModal = (item) => {
    // Ensure there is forecast data before opening
    if (item.weatherData && item.weatherData.forecast) {
      const { startDate, endDate } = item;

      // Convert start and end date strings to Date objects for accurate comparison
      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      // Filter: Only include forecast days between the saved startDate and endDate (inclusive)
      const filteredForecast = item.weatherData.forecast.filter((day) => {
        const forecastDateTime = new Date(day.date); // Convert each forecast day date to a Date object

        // Compare the numeric timestamp of the Date objects
        return (
          forecastDateTime.getTime() >= startDateTime.getTime() &&
          forecastDateTime.getTime() <= endDateTime.getTime()
        );
      });

      // Handle case where filtering results in no days (shouldn't happen with valid data)
      if (filteredForecast.length === 0) {
        alert(
          `No forecast data found between ${formatDate(
            startDate
          )} and ${formatDate(endDate)} for this record.`
        );
        return;
      }

      setSelectedForecast({
        location: item.weatherData.location.name || item.locationQuery,
        // Use the filtered array
        forecast: filteredForecast,
      });
      setIsForecastModalOpen(true);
    } else {
      alert("Forecast data not available for this record.");
    }
  };

  const closeForecastModal = () => {
    setIsForecastModalOpen(false);
    setSelectedForecast(null);
  }; // DELETE

  const handleDelete = async (id) => {
    // ... (rest of handleDelete logic)
    if (!confirmDeletion(id)) return;

    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setHistory((prevHistory) =>
        prevHistory.filter((item) => item._id !== id)
      );
    } catch (err) {
      console.error("Failed to delete history item:", err);
      alert("Failed to delete the record.");
    }
  };

  const confirmDeletion = (id) => {
    return window.confirm("Are you sure you want to delete this history item?");
  }; // UPDATE

  const openEditModal = (item) => {
    setEditingItem(item);
    setNewNotes(item.notes || "");
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setNewNotes("");
  };

  const handleUpdateNotes = async () => {
    if (!editingItem) return;

    try {
      await axios.patch(`${API_BASE_URL}/${editingItem._id}`, {
        notes: newNotes,
      });
      setHistory((prevHistory) =>
        prevHistory.map((item) =>
          item._id === editingItem._id ? { ...item, notes: newNotes } : item
        )
      );
      closeEditModal();
    } catch (err) {
      console.error("Failed to update notes:", err);
      alert("Failed to save notes.");
    }
  };

  return (
    <section className="w-full max-w-5xl mt-8">
      <h2
        className="flex items-center text-xl font-bold text-[#0B1957] mb-4 cursor-pointer p-4 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
        onClick={() => setIsToggled(!isToggled)}
        style={{
          justifyContent: "space-between",
          margin: "0 auto",
          maxWidth: "800px",
          padding: "15px",
          marginTop: "30px",
        }}
      >
        {isToggled ? <CiSquareCheck className="text-3xl mr-2" /> : " "}
        {isToggled ? "Hide Weather History" : "View Weather History"}
      </h2>
      {isToggled && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {loading && <p className="text-center py-4">Loading history...</p>}
          {error && <p className="text-center py-4 text-red-500">{error}</p>}
          {!loading && history.length === 0 && (
            <p className="text-center py-4 text-gray-600">
              No search history has been saved yet.
            </p>
          )}
          {!loading && history.length > 0 && (
            <div style={{ overflowX: "auto" }}>
              <table className="w-full border-collapse">
                <thead>
                  <tr
                    className="bg-[#0B1957] text-white"
                    style={{ color: "white" }}
                  >
                    <th className="p-3 text-left rounded-tl-lg">Location</th>
                    <th className="p-3 text-left">Date Range</th>
                    <th className="p-3 text-left hidden sm:table-cell">
                      Avg. High
                    </th>
                    <th className="p-3 text-left">Notes</th>
                    <th className="p-3 text-center rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr
                      key={item._id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition cursor-pointer`}
                      onClick={() => openForecastModal(item)} // NEW: Click entire row to open forecast
                    >
                      <td className="p-3 text-sm font-medium text-[#B26414]">
                        {item.weatherData?.location?.name || item.locationQuery}
                      </td>
                      <td className="p-3 text-sm">
                        {formatDate(item.startDate)} -{formatDate(item.endDate)}
                      </td>
                      <td className="p-3 text-sm hidden sm:table-cell">
                        {getAvgTemp(item.weatherData?.forecast)}
                      </td>
                      <td
                        className="p-3 text-sm italic max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                        title={item.notes}
                      >
                        {item.notes || <em>No notes added.</em>}
                      </td>
                      <td
                        className="p-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Stop propagation so the action buttons don't trigger the forecast modal */}
                        <button
                          style={{ color: "white" }}
                          className="text-white bg-[#B26414] hover:bg-[#8f4e0c] transition p-2 rounded-full mr-2"
                          onClick={() => openEditModal(item)}
                        >
                          <CiEdit className="text-lg" />
                        </button>
                        <button
                          style={{ color: "white", backgroundColor: "red" }}
                          className="text-white bg-red-600 hover:bg-red-700 transition p-2 rounded-full"
                          onClick={() => handleDelete(item._id)}
                        >
                          <CiTrash className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* NEW: Forecast Details Modal */}
      <ForecastModal
        isOpen={isForecastModalOpen}
        onClose={closeForecastModal}
        forecastData={selectedForecast}
      />
      {/* Edit Notes Modal (Custom Modal UI) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div
            className="modal-content"
            style={{ maxWidth: "400px", padding: "30px" }}
          >
            <h3 className="text-2xl font-bold text-[#0B1957] mb-4">
              Edit Notes
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Editing notes for:
              <span className="font-semibold">
                {editingItem?.weatherData?.location?.name ||
                  editingItem?.locationQuery}
              </span>
            </p>
            <textarea
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-[#B26414] focus:border-[#B26414] transition"
              placeholder="Add or update your notes here..."
            />
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-full hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateNotes}
                style={{ color: "white" }}
                className="flex items-center px-4 py-2 text-sm text-white bg-[#0B1957] rounded-full hover:bg-[#081546] transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
