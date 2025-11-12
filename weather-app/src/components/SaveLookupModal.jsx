import React from "react";

// This component expects the following props from WeatherLookup.jsx:
// - isOpen: boolean to show/hide the modal
// - onClose: function to close the modal
// - location: current location text (for initial input value)
// - startDate, endDate: state values for the date inputs
// - onLocationChange, onStartDateChange, onEndDateChange: handlers for date/location changes
// - onSave: the function that handles the API POST request
// - isSaving: boolean for the loading state

export default function SaveLookupModal({
  isOpen,
  onClose,
  location,
  startDate,
  endDate,
  onLocationChange,
  onStartDateChange,
  onEndDateChange,
  onSave,
  isSaving,
}) {
  if (!isOpen) return null;

  return (
    // Modal Overlay (Fills the screen, semi-transparent background)
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Modal Content (The actual pop-up card) */}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative"
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "6px",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className="border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-[#b26414] mb-4  pb-2">
            Plan a Future Lookup
          </h3>
          <button
            className=" text-gray-500 text-2xl hover:text-gray-800"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={onSave} className="flex flex-col gap-4 text-[#b26414]">
          {/* Location Input */}
          <div className="flex flex-col">
            <label
              htmlFor="saveLocation"
              className="text-sm font-semibold mb-1"
            >
              Location to Save:
            </label>
            <input
              id="saveLocation"
              type="text"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B29414]"
              placeholder="e.g., London, UK"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              required
            />
          </div>

          {/* Date Range Inputs */}
          <div className="flex gap-4">
            <div className="flex flex-col flex-1">
              <label htmlFor="startDate" className="text-sm font-semibold mb-1">
                Start Date:
              </label>
              <input
                id="startDate"
                type="date"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B29414]"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col flex-1">
              <label htmlFor="endDate" className="text-sm font-semibold mb-1">
                End Date:
              </label>
              <input
                id="endDate"
                type="date"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B29414]"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 px-4 py-3 bg-[#b26414] text-white rounded-full text-lg font-semibold"
            disabled={isSaving || !location.trim()}
          >
            {isSaving ? "Saving..." : "Save Lookup Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
