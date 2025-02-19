import React, { useState, useEffect } from "react";
import { useConfig } from "../../context/ConfigContext";
import { logError } from "../../utils/logger";
import MediaModal from "./MediaModal";

const MediaCard = ({ media }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const getThumbnailUrl = (media, apiKey) => {
    let thumbPath;

    switch (media.media_type.toLowerCase()) {
      case "movie":
        thumbPath = media.parent_thumb;
        break;
      case "show":
        thumbPath = media.parent_thumb;
        break;
      case "episode":
        thumbPath = media.grandparent_thumb;
        break;
      case "season":
        thumbPath = media.grandparent_thumb;
        break;
      default:
        thumbPath = media.thumb;
    }

    if (!thumbPath) {
      thumbPath = media.thumb;
    }

    return `http://localhost:3006/api/tautulli/pms_image_proxy?img=${encodeURIComponent(
      thumbPath
    )}&apikey=${apiKey}`;
  };

  const getDisplayTitle = () => {
    switch (media.media_type.toLowerCase()) {
      case "movie":
        return media.title;
      case "episode":
        return media.grandparent_title;
      case "season":
        return media.grandparent_title;
      case "show":
        return media.title;
      default:
        return media.title;
    }
  };

  const getDisplaySubtitle = () => {
    switch (media.media_type.toLowerCase()) {
      case "movie":
        return media.year || "";
      case "episode":
        return `S${String(media.parent_media_index).padStart(
          2,
          "0"
        )}・E${String(media.media_index).padStart(2, "0")}`;
      case "season":
        return `Season ${media.media_index || 1}`;
      case "show":
        return `Season ${media.season || 1}`;
      default:
        return "";
    }
  };

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 group-hover:ring-2 ring-blue-500 transition-all">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
              <svg
                className="animate-spin h-8 w-8 text-gray-500"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
          {!imageError ? (
            <img
              src={getThumbnailUrl(media, media.apiKey)}
              alt={media.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {media.play_count > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
              {media.play_count}
            </div>
          )}
        </div>

        <div className="mt-2 space-y-1">
          <h3 className="text-white text-sm font-medium truncate">
            {getDisplayTitle()}
          </h3>
          <p className="text-gray-400 text-xs">{getDisplaySubtitle()}</p>
        </div>
      </div>

      {showModal && (
        <MediaModal
          media={media}
          onClose={() => setShowModal(false)}
          apiKey={media.apiKey}
        />
      )}
    </>
  );
};

const RecentlyAdded = () => {
  const { config } = useConfig();
  const [sections, setSections] = useState([]);
  const [sectionMedia, setSectionMedia] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch saved sections
  const fetchSections = async () => {
    try {
      const response = await fetch("http://localhost:3006/api/sections");
      const data = await response.json();
      setSections(data.sections);
      return data.sections;
    } catch (error) {
      logError("Failed to fetch sections", error);
      setError("Failed to load sections");
      return [];
    }
  };

  // Fetch recently added media for a specific section
  const fetchSectionRecentlyAdded = async (sectionId) => {
    try {
      const response = await fetch(
        `http://localhost:3006/api/tautulli/api/v2?apikey=${config.tautulliApiKey}&cmd=get_recently_added&section_id=${sectionId}&count=10`
      );
      const data = await response.json();

      if (data?.response?.result === "success") {
        return data.response.data.recently_added || [];
      }
      return [];
    } catch (error) {
      logError(
        `Failed to fetch recently added for section ${sectionId}`,
        error
      );
      return [];
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const savedSections = await fetchSections();
      const sectionMediaResults = {};

      for (const section of savedSections) {
        const media = await fetchSectionRecentlyAdded(section.section_id);
        const transformedMedia = media.map((item) => ({
          ...item,
          apiKey: config.tautulliApiKey,
        }));

        sectionMediaResults[section.section_id] = {
          ...section,
          media: transformedMedia,
        };
      }

      setSectionMedia(sectionMediaResults);
    } catch (error) {
      logError("Failed to refresh media", error);
      setError("Failed to refresh media");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    const loadSectionMedia = async () => {
      setIsLoading(true);
      setError(null);
      await handleRefresh();
      setIsLoading(false);
    };

    if (config.tautulliApiKey) {
      loadSectionMedia();
    }
  }, [config.tautulliApiKey]);

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Recently Added Media
          </h2>
          <div className="mt-2 bg-gray-800 rounded-lg px-4 py-2 inline-block">
            <span className="text-gray-400">Total Sections: </span>
            <span className="text-blue-400 font-semibold">
              {sections.length}
            </span>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`px-4 py-2 rounded-lg bg-blue-600 text-white font-medium 
            hover:bg-blue-700 transition-colors flex items-center gap-2
            ${isRefreshing ? "opacity-90 cursor-not-allowed" : ""}`}
        >
          {isRefreshing && (
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
          {isRefreshing ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="w-full p-4 bg-red-900/20 rounded">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!sections.length && (
        <div className="w-full p-4 bg-gray-800/50 rounded text-center">
          <p className="text-gray-400">
            No sections saved. Please save library sections first.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="aspect-[2/3] bg-gray-800/50 rounded animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(sectionMedia).map(([sectionId, sectionData]) => (
            <div key={sectionId} className="bg-gray-800/20 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <h3 className="text-xl font-semibold text-white">
                  {sectionData.name}
                </h3>
                <span className="px-2 py-1 bg-gray-700/50 rounded text-gray-400 text-sm">
                  ID: {sectionId} •{" "}
                  {sectionData.type.charAt(0).toUpperCase() +
                    sectionData.type.slice(1)}
                </span>
              </div>

              {sectionData.media.length === 0 ? (
                <div className="w-full p-4 bg-gray-800/50 rounded text-center">
                  <p className="text-gray-400">
                    No recently added media in this section
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {sectionData.media.map((media) => (
                    <MediaCard
                      key={`${media.media_type}-${media.rating_key}`}
                      media={media}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyAdded;
