import React from "react";

const MediaModal = ({ media, onClose, apiKey }) => {
  if (!media) return null;

  const getBackgroundUrl = () => {
    if (!media.art) return null;
    return `http://localhost:3006/api/tautulli/pms_image_proxy?img=${encodeURIComponent(
      media.art
    )}&apikey=${apiKey}`;
  };

  const formatDuration = (ms) => {
    if (!ms) return "";
    const minutes = Math.floor(ms / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${remainingMinutes}m`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getQualityBadge = () => {
    const resolution = media.stream_video_full_resolution?.toLowerCase() || "";
    if (resolution.includes("4k") || resolution.includes("2160")) return "4K";
    if (resolution.includes("1080")) return "HD";
    if (resolution.includes("720")) return "HD";
    return "SD";
  };

  const getMediaSpecificInfo = () => {
    switch (media.media_type?.toLowerCase()) {
      case "movie":
        return (
          <>
            {media.studio && (
              <div>
                <h3 className="text-gray-400 mb-1">Studio</h3>
                <p className="text-white">{media.studio}</p>
              </div>
            )}
            {media.director && (
              <div>
                <h3 className="text-gray-400 mb-1">Director</h3>
                <p className="text-white">{media.director}</p>
              </div>
            )}
            {media.genres && (
              <div>
                <h3 className="text-gray-400 mb-1">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {media.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-1 bg-gray-800 rounded text-white text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      case "episode":
        return (
          <>
            <div>
              <h3 className="text-gray-400 mb-1">Show</h3>
              <p className="text-white">{media.grandparent_title}</p>
            </div>
            <div>
              <h3 className="text-gray-400 mb-1">Season</h3>
              <p className="text-white">{media.parent_media_index}</p>
            </div>
            <div>
              <h3 className="text-gray-400 mb-1">Episode</h3>
              <p className="text-white">{media.media_index}</p>
            </div>
          </>
        );
      case "show":
        return (
          <>
            {media.network && (
              <div>
                <h3 className="text-gray-400 mb-1">Network</h3>
                <p className="text-white">{media.network}</p>
              </div>
            )}
            {media.season_count && (
              <div>
                <h3 className="text-gray-400 mb-1">Seasons</h3>
                <p className="text-white">{media.season_count}</p>
              </div>
            )}
            {media.episode_count && (
              <div>
                <h3 className="text-gray-400 mb-1">Episodes</h3>
                <p className="text-white">{media.episode_count}</p>
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl mx-auto z-10">
        {/* Background Image */}
        <div className="relative aspect-video rounded-t-lg overflow-hidden">
          {getBackgroundUrl() ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${getBackgroundUrl()})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gray-900" />
          )}

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white">{media.title}</h2>
              <div className="flex items-center flex-wrap gap-4 text-sm text-gray-300">
                {media.year && <span>{media.year}</span>}
                {media.duration && (
                  <span>{formatDuration(media.duration)}</span>
                )}
                {media.rating && (
                  <span className="px-2 py-1 bg-gray-800/50 rounded">
                    {media.rating}
                  </span>
                )}
                {media.content_rating && (
                  <span className="px-2 py-1 border border-gray-500 rounded">
                    {media.content_rating}
                  </span>
                )}
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded font-medium">
                  {getQualityBadge()}
                </span>
                {media.file_size && (
                  <span className="text-gray-400">
                    {formatFileSize(media.file_size)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-900 p-6 rounded-b-lg">
          {media.summary && (
            <p className="text-gray-300 text-lg mb-6">{media.summary}</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            {/* Media Specific Info */}
            {getMediaSpecificInfo()}

            {/* Common Info */}
            <div>
              <h3 className="text-gray-400 mb-1">Added</h3>
              <p className="text-white">{formatDate(media.added_at)}</p>
            </div>
            {media.last_viewed_at && (
              <div>
                <h3 className="text-gray-400 mb-1">Last Viewed</h3>
                <p className="text-white">{formatDate(media.last_viewed_at)}</p>
              </div>
            )}
            {media.file_size && (
              <div>
                <h3 className="text-gray-400 mb-1">File Size</h3>
                <p className="text-white">{formatFileSize(media.file_size)}</p>
              </div>
            )}
            {media.stream_video_full_resolution && (
              <div>
                <h3 className="text-gray-400 mb-1">Quality</h3>
                <p className="text-white">
                  {media.stream_video_full_resolution}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;
