import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { useConfig } from "../../context/ConfigContext";
import { Trash2 } from "lucide-react";

// Example data for different media types
const EXAMPLE_DATA = {
  movies: {
    rating_key: "12345",
    title: "Inception",
    year: "2010",
    mediaType: "movie",
    addedAt: "1625097600",
    summary:
      "A thief who steals corporate secrets through the use of dream-sharing technology",
    rating: "8.8",
    contentRating: "PG-13",
    duration: "148 min",
    video_full_resolution: "1080p",
  },
  shows: {
    rating_key: "67890",
    grandparent_title: "Breaking Bad",
    parent_media_index: "5",
    media_index: "2",
    title: "Madrigal",
    year: "2012",
    mediaType: "show",
    addedAt: "1625097600",
    summary: "Walt meets with Gus Fring's former employer",
    rating: "9.5",
    contentRating: "TV-MA",
    duration: "47 min",
    video_full_resolution: "1080p",
  },
  music: {
    rating_key: "54321",
    title: "Bohemian Rhapsody",
    grandparent_title: "Queen",
    parent_title: "A Night at the Opera",
    year: "1975",
    mediaType: "music",
    addedAt: "1625097600",
    summary: "Iconic rock ballad by Queen",
    duration: "5:55",
  },
};

// Available variables for each media type
const AVAILABLE_VARIABLES = {
  movies: [
    { name: "rating_key", description: "Unique identifier for the media" },
    { name: "video_full_resolution", description: "Video quality" },
    { name: "title", description: "Movie title" },
    { name: "year", description: "Year of release" },
    { name: "mediaType", description: "Type of media" },
    {
      name: "addedAt",
      description:
        "Timestamp when media was added (formats: default, short, relative, full, time)",
    },
    { name: "summary", description: "Brief summary of the media" },
    { name: "rating", description: "Media rating" },
    { name: "contentRating", description: "Content rating (PG, R, etc.)" },
    { name: "duration", description: "Runtime" },
  ],
  shows: [
    { name: "rating_key", description: "Unique identifier for the media" },
    { name: "video_full_resolution", description: "Video quality" },
    { name: "grandparent_title", description: "Show name" },
    { name: "parent_media_index", description: "Season number" },
    { name: "media_index", description: "Episode number" },
    { name: "title", description: "Episode title" },
    { name: "year", description: "Year of release" },
    { name: "mediaType", description: "Type of media" },
    {
      name: "addedAt",
      description:
        "Timestamp when media was added (formats: default, short, relative, full, time)",
    },
    { name: "summary", description: "Brief summary of the media" },
    { name: "rating", description: "Media rating" },
    { name: "contentRating", description: "Content rating (PG, R, etc.)" },
    { name: "duration", description: "Runtime" },
  ],
  music: [
    { name: "rating_key", description: "Unique identifier for the media" },
    { name: "title", description: "Track title" },
    { name: "grandparent_title", description: "Artist name" },
    { name: "parent_title", description: "Album name" },
    { name: "year", description: "Year of release" },
    { name: "mediaType", description: "Type of media" },
    {
      name: "addedAt",
      description:
        "Timestamp when media was added (formats: default, short, relative, full, time)",
    },
    { name: "summary", description: "Additional information" },
    { name: "duration", description: "Track duration" },
  ],
};

// Helper function for date formatting
const formatDate = (timestamp, format = "default") => {
  const date = new Date(Number(timestamp) * 1000);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  switch (format) {
    case "short":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "relative":
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 30) return `${diffDays} days ago`;
      return date.toLocaleDateString();
    case "full":
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    case "time":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    default:
      return date.toLocaleDateString();
  }
};

// Helper function for processing templates
const processTemplate = (template, data) => {
  if (!template) return "";

  let result = template;
  const variables = template.match(/\{([^}]+)\}/g) || [];

  variables.forEach((variable) => {
    const match = variable.slice(1, -1).split(":");
    const key = match[0];
    const format = match[1];

    let value = data[key];

    if (key === "addedAt") {
      value = formatDate(value, format);
    }

    // Special handling for show episode formatting
    if (data.mediaType === "show") {
      if (key === "parent_media_index") {
        value = `${String(value).padStart(2, "0")}`;
      }
      if (key === "media_index") {
        value = `${String(value).padStart(2, "0")}`;
      }
    }

    if (value !== undefined) {
      result = result.replace(variable, value);
    }
  });

  return result;
};

const RecentlyAddedFormat = () => {
  const { config } = useConfig();
  const [activeMediaType, setActiveMediaType] = useState("movies");
  const [sections, setSections] = useState([]);
  const [formats, setFormats] = useState([]);
  const [recentMedia, setRecentMedia] = useState([]);
  const [mediaMetadata, setMediaMetadata] = useState({});
  const [newFormat, setNewFormat] = useState({
    name: "",
    template: "",
    type: "movies",
    sectionId: "all",
  });
  const [isLoading, setIsLoading] = useState(false);
  const templateInputRef = useRef(null);

  // Fetch sections
  const fetchSections = async () => {
    try {
      const response = await axios.get("http://localhost:3006/api/sections");
      setSections(response.data.sections);
      return response.data.sections;
    } catch (error) {
      console.error("Failed to fetch sections:", error);
      return [];
    }
  };

  // Fetch recent media with section filtering
  const fetchRecentMedia = async (sections) => {
    setIsLoading(true);
    try {
      const configResponse = await fetch("http://localhost:3006/api/config");
      const config = await configResponse.json();

      const typeMap = {
        movies: "movie",
        shows: "show",
        music: "artist",
      };

      const filteredSections = sections.filter(
        (section) => section.type.toLowerCase() === typeMap[activeMediaType]
      );

      const mediaPromises = filteredSections.map(async (section) => {
        try {
          const response = await axios.get(
            "http://localhost:3006/api/tautulli/api/v2",
            {
              params: {
                apikey: config.tautulliApiKey,
                cmd: "get_recently_added",
                section_id: section.section_id,
                count: 10,
              },
            }
          );

          const mediaItems =
            response.data?.response?.data?.recently_added || [];
          return mediaItems.map((item) => ({
            ...item,
            section_id: section.section_id,
          }));
        } catch (error) {
          console.error(
            `Failed to fetch media for section ${section.section_id}:`,
            error
          );
          return [];
        }
      });

      const allMedia = await Promise.all(mediaPromises);
      const flattenedMedia = allMedia.flat();
      setRecentMedia(flattenedMedia);
      return flattenedMedia;
    } catch (error) {
      console.error("Failed to fetch recent media:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch metadata for media items
  const fetchMediaMetadata = async (media) => {
    setIsLoading(true);
    try {
      const metadataPromises = media.map(async (item) => {
        try {
          const response = await axios.get(
            "http://localhost:3006/api/tautulli/api/v2",
            {
              params: {
                apikey: config.tautulliApiKey,
                cmd: "get_metadata",
                rating_key: item.rating_key,
              },
            }
          );

          return {
            rating_key: item.rating_key,
            video_full_resolution:
              response.data?.response?.data?.media_info?.[0]
                ?.video_full_resolution || "Unknown",
          };
        } catch (error) {
          console.error(
            `Failed to fetch metadata for ${item.rating_key}:`,
            error
          );
          return {
            rating_key: item.rating_key,
            video_full_resolution: "Unknown",
          };
        }
      });

      const metadataResults = await Promise.all(metadataPromises);
      const metadataMap = Object.fromEntries(
        metadataResults.map((item) => [
          item.rating_key,
          item.video_full_resolution,
        ])
      );

      setMediaMetadata(metadataMap);
    } catch (error) {
      console.error("Failed to fetch media metadata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Template preview using memoization
  const templatePreview = useMemo(() => {
    let previewData = { ...EXAMPLE_DATA[activeMediaType] };

    // Find a media item from the selected section or use the first available
    const mediaItem =
      newFormat.sectionId === "all"
        ? recentMedia[0]
        : recentMedia.find((item) => item.section_id === newFormat.sectionId) ||
          recentMedia[0];

    if (mediaItem) {
      previewData.rating_key = mediaItem.rating_key;
      previewData.video_full_resolution =
        mediaMetadata[mediaItem.rating_key] || "Unknown";
    }

    return processTemplate(newFormat.template, previewData);
  }, [
    newFormat.template,
    newFormat.sectionId,
    recentMedia,
    mediaMetadata,
    activeMediaType,
  ]);

  // Insert variable into template
  const insertVariable = (variableName) => {
    if (templateInputRef.current) {
      const input = templateInputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;

      const insertValue =
        variableName === "addedAt"
          ? `{${variableName}:relative}`
          : `{${variableName}}`;

      const currentValue = newFormat.template;
      const newValue =
        currentValue.substring(0, start) +
        insertValue +
        currentValue.substring(end);

      setNewFormat({ ...newFormat, template: newValue });

      // Restore cursor position after update
      setTimeout(() => {
        const newCursorPos = start + insertValue.length;
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  // Update these functions in RecentlyAddedFormat.jsx

  const handleAddFormat = async () => {
    if (newFormat.name && newFormat.template && newFormat.type) {
      const newFormatItem = {
        name: newFormat.name,
        template: newFormat.template,
        type: activeMediaType,
        sectionId: newFormat.sectionId || "all", // Ensure sectionId is set
      };

      try {
        // Get current formats
        const response = await fetch("http://localhost:3006/api/formats");
        const data = await response.json();
        const currentFormats = data.recentlyAdded || [];

        // Check if format with same name exists for the same section
        const existingFormatIndex = currentFormats.findIndex(
          (f) =>
            f.name === newFormatItem.name &&
            f.sectionId === newFormatItem.sectionId
        );

        let updatedFormats;
        if (existingFormatIndex >= 0) {
          // Update existing format
          updatedFormats = [...currentFormats];
          updatedFormats[existingFormatIndex] = newFormatItem;
        } else {
          // Add new format
          updatedFormats = [...currentFormats, newFormatItem];
        }

        // Save formats
        const saveResponse = await fetch("http://localhost:3006/api/formats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "recentlyAdded",
            formats: updatedFormats,
          }),
        });

        if (!saveResponse.ok) {
          throw new Error("Failed to save format");
        }

        // Update local state
        setFormats(updatedFormats);
        toast.success(
          `Format "${newFormat.name}" ${
            existingFormatIndex >= 0 ? "updated" : "created"
          } successfully`
        );

        // Reset form
        setNewFormat({
          name: "",
          template: "",
          type: activeMediaType,
          sectionId: "all",
        });
      } catch (error) {
        console.error("Failed to save format:", error);
        toast.error("Failed to save format");
      }
    }
  };

  const handleDeleteFormat = async (indexToDelete) => {
    if (indexToDelete < 0 || indexToDelete >= formats.length) {
      console.error("Invalid index for deletion");
      return;
    }

    const formatToDelete = formats[indexToDelete];
    const deletedFormatName = formatToDelete.name;

    try {
      // Get current formats
      const response = await fetch("http://localhost:3006/api/formats");
      const data = await response.json();
      const currentFormats = data.recentlyAdded || [];

      // Remove the specific format
      const otherFormats = currentFormats.filter(
        (format) =>
          !(
            format.name === formatToDelete.name &&
            format.type === formatToDelete.type &&
            format.sectionId === formatToDelete.sectionId
          )
      );

      // Save updated formats
      const saveResponse = await fetch("http://localhost:3006/api/formats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "recentlyAdded",
          formats: otherFormats.filter(
            (format) => format.type === activeMediaType
          ),
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save formats");
      }

      // Update local state
      setFormats(formats.filter((_, index) => index !== indexToDelete));
      toast.success(`Format "${deletedFormatName}" deleted successfully`);
    } catch (error) {
      console.error("Failed to delete format:", error);
      toast.error("Failed to delete format");
    }
  };

  // Update the effect that loads formats
  useEffect(() => {
    const fetchFormats = async () => {
      try {
        const response = await fetch("http://localhost:3006/api/formats");
        const data = await response.json();

        // Filter formats to only show current media type
        const formatsForCurrentType = (data.recentlyAdded || []).filter(
          (format) => format.type === activeMediaType
        );

        setFormats(formatsForCurrentType);
      } catch (error) {
        console.error("Failed to load formats:", error);
        toast.error("Failed to load formats");
      }
    };

    fetchFormats();
  }, [activeMediaType]);

  // Save formats when they change
  useEffect(() => {
    const saveFormats = async () => {
      try {
        await fetch("http://localhost:3006/api/formats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "recentlyAdded",
            formats: formats,
          }),
        });
      } catch (error) {
        console.error("Failed to save recently added formats:", error);
      }
    };

    if (formats.length > 0) {
      saveFormats();
    }
  }, [formats]);

  // Load media data when media type changes
  useEffect(() => {
    const loadMediaData = async () => {
      const savedSections = await fetchSections();
      const recentMedia = await fetchRecentMedia(savedSections);
      await fetchMediaMetadata(recentMedia);
    };

    loadMediaData();
  }, [activeMediaType]);

  // Filter sections and formats
  const filteredSections = sections.filter((section) => {
    const typeMap = {
      movies: "movie",
      shows: "show",
      music: "artist",
    };
    return section.type.toLowerCase() === typeMap[activeMediaType];
  });

  const filteredFormats = formats.filter((format) => {
    const matchesType = format.type === activeMediaType;
    const matchesSection =
      format.sectionId === "all" || format.sectionId === newFormat.sectionId;
    return matchesType; // Don't filter by section in the list view
  });

  // Update the data fetching useEffect
  useEffect(() => {
    const fetchFormats = async () => {
      try {
        const response = await fetch("http://localhost:3006/api/formats");
        const data = await response.json();
        // Filter formats by active media type only
        const formatsForCurrentType = (data.recentlyAdded || []).filter(
          (format) => format.type === activeMediaType
        );
        setFormats(formatsForCurrentType);
      } catch (error) {
        console.error("Failed to load recently added formats:", error);
      }
    };

    fetchFormats();
  }, [activeMediaType]);

  return (
    <div className="space-y-6">
      {/* Media Type Tabs */}
      <div className="flex gap-2 mb-4">
        {["movies", "shows", "music"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setActiveMediaType(type);
              setNewFormat((prev) => ({ ...prev, type }));
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeMediaType === type
                ? "bg-gray-700 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700/50"
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="w-full p-4 bg-gray-800/50 rounded text-center">
          <p className="text-gray-400">Loading Formats...</p>
        </div>
      )}

      {/* Available Variables Section */}
      <div>
        <h3 className="text-lg font-medium text-white mb-4">
          Available Variables
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AVAILABLE_VARIABLES[activeMediaType].map((variable) => (
            <button
              key={variable.name}
              onClick={() => insertVariable(variable.name)}
              className="bg-gray-700/50 p-3 rounded text-left hover:bg-gray-700 transition-colors"
            >
              <code className="text-blue-400 font-mono">
                {variable.name === "addedAt"
                  ? "{addedAt:relative}"
                  : `{${variable.name}}`}
              </code>
              <p className="text-gray-400 text-sm mt-1">
                {variable.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Create New Format Section */}
      <div className="bg-gray-700/30 p-4 rounded">
        <h3 className="text-lg font-medium text-white mb-4">
          Create New Format
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Format Name</label>
            <input
              type="text"
              value={newFormat.name}
              onChange={(e) =>
                setNewFormat({ ...newFormat, name: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g., Custom Recently Added Format"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Section</label>
            <select
              value={newFormat.sectionId}
              onChange={(e) =>
                setNewFormat({ ...newFormat, sectionId: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Sections</option>
              {filteredSections.map((section) => (
                <option key={section.section_id} value={section.section_id}>
                  {section.section_name || section.name} (ID:{" "}
                  {section.section_id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              Template (click variables above to add them)
            </label>
            <input
              ref={templateInputRef}
              type="text"
              value={newFormat.template}
              onChange={(e) =>
                setNewFormat({ ...newFormat, template: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
              placeholder={
                activeMediaType === "shows"
                  ? "e.g., {grandparent_title} S{parent_media_index}E{media_index} - {title}"
                  : activeMediaType === "movies"
                  ? "e.g., {title} ({video_full_resolution})"
                  : "e.g., {grandparent_title} - {title}"
              }
            />
            <p className="text-gray-400 text-xs mt-2">
              Tip: Use {`{addedAt:format}`} with formats: default, short,
              relative, full, time
            </p>
          </div>

          {/* Live Preview */}
          {newFormat.template && (
            <div className="bg-gray-800/50 p-3 rounded">
              <label className="block text-gray-300 mb-2">Preview:</label>
              <code className="text-blue-400 font-mono block">
                {templatePreview || "Invalid template"}
              </code>
            </div>
          )}

          <button
            onClick={handleAddFormat}
            disabled={!newFormat.name || !newFormat.template}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Format
          </button>
        </div>
      </div>

      {/* Existing Formats Section */}
      {filteredFormats.map((format, index) => {
        const previewValue = processTemplate(
          format.template,
          EXAMPLE_DATA[activeMediaType]
        );
        return (
          <div
            key={index}
            className="bg-gray-700/30 p-4 rounded flex justify-between items-center"
          >
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-white font-medium">{format.name}</h4>
                <button
                  onClick={() => handleDeleteFormat(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                Section:{" "}
                {format.sectionId === "all"
                  ? "All Sections"
                  : (() => {
                      const section = sections.find(
                        (s) => s.section_id.toString() === format.sectionId
                      );
                      return section
                        ? `${section.name} (ID: ${format.sectionId})`
                        : `Section ID: ${format.sectionId}`;
                    })()}
              </p>
              <code className="text-sm text-gray-400 font-mono block mb-2">
                {format.template}
              </code>
              <div className="text-blue-400 text-sm font-mono">
                {previewValue}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentlyAddedFormat;
