import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useConfig } from "../../context/ConfigContext";
import { logError } from "../../utils/logger";
import { FaFilm, FaTv, FaMusic, FaBook } from "react-icons/fa";
import toast from "react-hot-toast";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const LibraryTypeIcon = ({ type }) => {
  switch (type.toLowerCase()) {
    case "movie":
      return <FaFilm className="text-blue-400" />;
    case "show":
      return <FaTv className="text-green-400" />;
    case "artist":
      return <FaMusic className="text-purple-400" />;
    default:
      return <FaBook className="text-yellow-400" />;
  }
};

const LibraryCard = ({ library, isSelected, onToggleSelect }) => {
  return (
    <div
      className={`bg-gray-800/50 p-4 rounded-lg flex items-center justify-between transition-colors
      ${isSelected ? "ring-2 ring-blue-500/50" : ""}`}
    >
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(library.section_id)}
          className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800"
        />
        <div className="p-3 bg-gray-700/50 rounded-lg">
          <LibraryTypeIcon type={library.section_type} />
        </div>
        <div>
          <h3 className="text-white font-medium">{library.section_name}</h3>
          <p className="text-gray-400 text-sm">
            Type: {capitalizeFirstLetter(library.section_type)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className="bg-gray-700/50 px-3 py-1 rounded">
          <span className="text-gray-400 text-sm">Items: </span>
          <span className="text-blue-400 font-medium">{library.count}</span>
        </div>
        <p className="text-gray-500 text-xs mt-1">ID: {library.section_id}</p>
      </div>
    </div>
  );
};

const Libraries = () => {
  const { config } = useConfig();
  const [selectedLibraries, setSelectedLibraries] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);

  // Fetch saved sections on component mount
  useEffect(() => {
    const fetchSavedSections = async () => {
      try {
        const response = await fetch("http://localhost:3006/api/sections");
        const data = await response.json();

        if (data.sections && data.sections.length) {
          const savedSectionIds = new Set(
            data.sections.map((section) => section.section_id)
          );
          setSelectedLibraries(savedSectionIds);
        }
      } catch (error) {
        console.error("Failed to fetch saved sections:", error);
      }
    };

    fetchSavedSections();
  }, []);

  const toggleLibrary = (sectionId) => {
    setSelectedLibraries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const toggleAll = (libraries) => {
    if (selectedLibraries.size === libraries.length) {
      setSelectedLibraries(new Set());
    } else {
      setSelectedLibraries(new Set(libraries.map((lib) => lib.section_id)));
    }
  };

  const {
    data: libraries,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery(
    ["libraries"],
    async () => {
      try {
        const response = await fetch("http://localhost:3006/api/libraries");
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    },
    {
      enabled: !!config.tautulliApiKey,
    }
  );

  const handleSaveSections = async () => {
    if (selectedLibraries.size === 0) return;

    setIsSaving(true);
    const selectedData = libraries
      .filter((lib) => selectedLibraries.has(lib.section_id))
      .map((lib) => ({
        section_id: lib.section_id,
        type: lib.section_type,
        name: lib.section_name,
      }));

    try {
      const response = await fetch("http://localhost:3006/api/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedData),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${responseText}`
        );
      }

      toast.success(`Successfully saved ${selectedData.length} sections`);
    } catch (error) {
      toast.error(`Failed to save sections: ${error.message}`);
      console.error("Detailed save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Plex Libraries</h2>
          <div className="mt-2 bg-gray-800 rounded-lg px-4 py-2 inline-block">
            <span className="text-gray-400">Total Libraries: </span>
            <span className="text-blue-400 font-semibold">
              {Array.isArray(libraries) ? libraries.length : 0}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {Array.isArray(libraries) && libraries.length > 0 && (
            <button
              onClick={() => toggleAll(libraries)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {selectedLibraries.size === libraries.length
                ? "Deselect All"
                : "Select All"}
            </button>
          )}
          <button
            onClick={handleSaveSections}
            disabled={selectedLibraries.size === 0 || isSaving}
            className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium 
              hover:bg-blue-700 transition-colors flex items-center gap-2
              ${
                selectedLibraries.size === 0 || isSaving
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
          >
            {isSaving ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {isSaving ? "Saving..." : "Save Selection"}
          </button>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium 
              hover:bg-blue-700 transition-colors flex items-center gap-2
              ${isFetching ? "opacity-90 cursor-not-allowed" : ""}`}
          >
            {isFetching && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isFetching ? "Refreshing" : "Refresh"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-gray-800/50 p-4 rounded-lg animate-pulse flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 bg-gray-700 rounded" />
                <div className="w-12 h-12 bg-gray-700 rounded-lg" />
                <div>
                  <div className="h-5 bg-gray-700 rounded w-32 mb-2" />
                  <div className="h-4 bg-gray-700 rounded w-24" />
                </div>
              </div>
              <div className="w-20 h-8 bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="w-full p-4 bg-red-900/20 rounded">
          <p className="text-red-400">
            Error loading libraries: {error.message}
          </p>
        </div>
      ) : !libraries?.length ? (
        <div className="w-full p-4 bg-gray-800/50 rounded text-center">
          <p className="text-gray-400">No libraries found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {libraries.map((library) => (
            <LibraryCard
              key={library.section_id}
              library={library}
              isSelected={selectedLibraries.has(library.section_id)}
              onToggleSelect={toggleLibrary}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Libraries;
