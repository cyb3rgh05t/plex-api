import React, { useState, useEffect, useRef, useMemo } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const AVAILABLE_VARIABLES = [
  { name: "title", description: "Title of the media" },
  { name: "subtitle", description: "Movie or episode title" },
  { name: "progress", description: "Download progress percentage" },
  { name: "type", description: "Activity type" },
  { name: "uuid", description: "Unique identifier" },
];

// Example data for preview
const EXAMPLE_DATA = {
  uuid: "abc123",
  title: "Media download by Username",
  subtitle: "Matrix",
  progress: 45,
  type: "download",
};

const DownloadsFormat = () => {
  const [formats, setFormats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newFormat, setNewFormat] = useState({
    name: "",
    template: "",
  });
  const templateInputRef = useRef(null);

  // Template preview using memoization
  const templatePreview = useMemo(() => {
    if (!newFormat.template) return "";

    let result = newFormat.template;
    Object.entries(EXAMPLE_DATA).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, "g"), value);
    });

    return result;
  }, [newFormat.template]);

  // Load formats
  useEffect(() => {
    const fetchFormats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3006/api/formats");
        const data = await response.json();
        setFormats(data.downloads || []);
      } catch (error) {
        console.error("Failed to load activity formats:", error);
        toast.error("Failed to load formats");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormats();
  }, []);

  const insertVariable = (variableName) => {
    if (templateInputRef.current) {
      const input = templateInputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const currentValue = newFormat.template;
      const newValue =
        currentValue.substring(0, start) +
        `{${variableName}}` +
        currentValue.substring(end);

      setNewFormat({ ...newFormat, template: newValue });

      // Wait for state update and restore cursor position
      setTimeout(() => {
        const newCursorPos = start + variableName.length + 2;
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const handleAddFormat = async () => {
    if (newFormat.name && newFormat.template) {
      const newFormatItem = {
        name: newFormat.name,
        template: newFormat.template,
      };

      try {
        // Get current formats first
        const getResponse = await fetch("http://localhost:3006/api/formats");
        const currentData = await getResponse.json();
        const currentFormats = currentData.downloads || [];

        // Check for duplicate names
        if (
          currentFormats.some((format) => format.name === newFormatItem.name)
        ) {
          toast.error("A format with this name already exists");
          return;
        }

        // Add new format
        const updatedFormats = [...currentFormats, newFormatItem];

        // Save the updated formats
        const saveResponse = await fetch("http://localhost:3006/api/formats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "downloads",
            formats: updatedFormats,
          }),
        });

        if (!saveResponse.ok) {
          throw new Error("Failed to save format");
        }

        // Update local state
        setFormats(updatedFormats);
        toast.success(`Format "${newFormat.name}" created successfully`);

        // Reset form
        setNewFormat({
          name: "",
          template: "",
        });
      } catch (error) {
        console.error("Failed to save format:", error);
        toast.error("Failed to create format");
      }
    }
  };

  const handleDeleteFormat = async (indexToDelete) => {
    if (indexToDelete < 0 || indexToDelete >= formats.length) {
      console.error("Invalid index for deletion");
      return;
    }

    const deletedFormatName = formats[indexToDelete].name;
    const updatedFormats = formats.filter(
      (_, index) => index !== indexToDelete
    );

    try {
      // Save updated formats
      const saveResponse = await fetch("http://localhost:3006/api/formats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "downloads",
          formats: updatedFormats,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save formats");
      }

      // Update local state
      setFormats(updatedFormats);
      toast.success(`Format "${deletedFormatName}" deleted successfully`);
    } catch (error) {
      console.error("Failed to delete format:", error);
      toast.error("Failed to delete format");
    }
  };

  return (
    <div className="space-y-6">
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
          {AVAILABLE_VARIABLES.map((variable) => (
            <button
              key={variable.name}
              onClick={() => insertVariable(variable.name)}
              className="bg-gray-700/50 p-3 rounded text-left hover:bg-gray-700 transition-colors"
            >
              <code className="text-blue-400 font-mono">{`{${variable.name}}`}</code>
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
              placeholder="e.g., Custom Format 1"
            />
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
              placeholder="e.g., {title} - {progress}%"
            />
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
      {formats.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-white mb-4">
            Existing Formats
          </h3>
          <div className="space-y-3">
            {formats.map((format, index) => {
              const previewValue = (() => {
                let result = format.template;
                Object.entries(EXAMPLE_DATA).forEach(([key, value]) => {
                  result = result.replace(new RegExp(`{${key}}`, "g"), value);
                });
                return result;
              })();
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
        </div>
      )}
    </div>
  );
};

export default DownloadsFormat;
