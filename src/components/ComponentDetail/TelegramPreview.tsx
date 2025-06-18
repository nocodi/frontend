import {
  GridItem,
  KeyboardType,
  formValuesType,
} from "../../types/ComponentDetailForm";
import {
  Send,
  MessageCircle,
  FileText,
  Image,
  CheckCircle,
  XCircle,
  Video,
  Music,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  Download,
  Phone,
  MoreVertical,
  Search,
} from "lucide-react";
import { componentSchemaType } from "./makeFormData";

type TelegramPreviewProps = {
  rows: GridItem[][];
  keyboardType: KeyboardType;
  formValues: formValuesType;
  componentSchema: componentSchemaType;
  componentName: string;
};

export default function TelegramPreview({
  rows,
  keyboardType,
  formValues,
  componentSchema,
  componentName,
}: TelegramPreviewProps) {
  const hasButtons = rows.length > 0 && rows.some((row) => row.length > 0);

  // Helper function to get file type and appropriate icon
  const getFileTypeInfo = (fileName: string) => {
    const ext = fileName.toLowerCase().split(".").pop() || "";

    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) {
      return { type: "image", icon: Image, color: "text-green-400" };
    }
    if (["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"].includes(ext)) {
      return { type: "video", icon: Video, color: "text-red-400" };
    }
    if (["mp3", "wav", "flac", "aac", "ogg", "m4a"].includes(ext)) {
      return { type: "audio", icon: Music, color: "text-purple-400" };
    }
    if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(ext)) {
      return { type: "archive", icon: FileArchive, color: "text-orange-400" };
    }
    if (
      [
        "js",
        "ts",
        "jsx",
        "tsx",
        "html",
        "css",
        "py",
        "java",
        "cpp",
        "c",
        "php",
        "rb",
        "go",
        "rs",
      ].includes(ext)
    ) {
      return { type: "code", icon: FileCode, color: "text-blue-400" };
    }
    if (["xlsx", "xls", "csv", "ods"].includes(ext)) {
      return {
        type: "spreadsheet",
        icon: FileSpreadsheet,
        color: "text-green-400",
      };
    }
    if (["pdf", "doc", "docx", "txt", "rtf", "odt"].includes(ext)) {
      return { type: "document", icon: FileText, color: "text-blue-400" };
    }

    return { type: "other", icon: Download, color: "text-gray-400" };
  };

  const renderFieldValue = (
    _key: string,
    value: unknown,
    schema: { type: string; verbose_name?: string },
  ) => {
    if (!value && value !== false) return null;

    switch (schema.type) {
      case "BooleanField":
        return (
          <div className="flex items-center gap-2 text-sm">
            {value === "true" ?
              <>
                <CheckCircle className="size-4 text-green-400" />
                <span className="font-medium text-green-400">Yes</span>
              </>
            : <>
                <XCircle className="size-4 text-red-400" />
                <span className="font-medium text-red-400">No</span>
              </>
            }
          </div>
        );

      case "FileField":
        if (typeof value === "string") {
          const fileName = value.split("/").pop() || "file";
          const fileInfo = getFileTypeInfo(fileName);
          const IconComponent = fileInfo.icon;

          if (fileInfo.type === "image") {
            return (
              <div className="max-w-xs">
                <img
                  src={value}
                  alt={fileName}
                  className="h-auto w-full rounded-2xl border border-gray-600/50 shadow-sm"
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
              </div>
            );
          } else if (fileInfo.type === "video") {
            return (
              <div className="max-w-xs">
                <video
                  src={value}
                  controls
                  className="h-auto w-full rounded-2xl border border-gray-600/50 shadow-sm"
                  style={{ maxHeight: "250px" }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          } else if (fileInfo.type === "audio") {
            return (
              <div className="max-w-xs">
                <div className="flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                    <IconComponent className="size-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-200">
                      {fileName}
                    </p>
                    <p className="text-xs font-medium text-blue-400">
                      Audio file
                    </p>
                  </div>
                </div>
                <audio
                  src={value}
                  controls
                  className="mt-2 w-full rounded-lg"
                  style={{ height: "35px" }}
                >
                  Your browser does not support the audio tag.
                </audio>
              </div>
            );
          } else {
            return (
              <div className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-600/30 bg-gradient-to-r from-gray-800/50 to-slate-800/50 p-3 transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-700/50 hover:to-slate-700/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-500 to-gray-600 shadow-sm">
                  <IconComponent className="size-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-200">
                    {fileName}
                  </p>
                  <p className="text-xs font-medium text-gray-400">
                    Click to download • {fileInfo.type}
                  </p>
                </div>
              </div>
            );
          }
        } else if (
          typeof value === "object" &&
          value !== null &&
          "name" in value
        ) {
          // Handle File object (when file is uploaded but not yet saved)
          const fileName = (value as { name: string }).name;
          const fileInfo = getFileTypeInfo(fileName);
          const IconComponent = fileInfo.icon;

          if (fileInfo.type === "image" && value instanceof File) {
            const imageUrl = URL.createObjectURL(value);
            return (
              <div className="max-w-xs">
                <img
                  src={imageUrl}
                  alt={fileName}
                  className="h-auto w-full rounded-2xl border border-gray-600/50 shadow-sm"
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
              </div>
            );
          } else if (fileInfo.type === "video" && value instanceof File) {
            const videoUrl = URL.createObjectURL(value);
            return (
              <div className="max-w-xs">
                <video
                  src={videoUrl}
                  controls
                  className="h-auto w-full rounded-2xl border border-gray-600/50 shadow-sm"
                  style={{ maxHeight: "250px" }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          } else if (fileInfo.type === "audio" && value instanceof File) {
            const audioUrl = URL.createObjectURL(value);
            return (
              <div className="max-w-xs">
                <div className="flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm">
                    <IconComponent className="size-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-200">
                      {fileName}
                    </p>
                    <p className="text-xs font-medium text-blue-400">
                      Audio file
                    </p>
                  </div>
                </div>
                <audio
                  src={audioUrl}
                  controls
                  className="mt-2 w-full rounded-lg"
                  style={{ height: "35px" }}
                >
                  Your browser does not support the audio tag.
                </audio>
              </div>
            );
          } else {
            return (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-900/30 to-green-900/30 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm">
                  <IconComponent className="size-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-200">
                    {fileName}
                  </p>
                  <p className="text-xs font-medium text-emerald-400">
                    Ready to upload • {fileInfo.type}
                  </p>
                </div>
              </div>
            );
          }
        }
        return null;

      default:
        return (
          <div className="text-sm leading-relaxed font-normal text-gray-200">
            {typeof value === "string" ?
              value
            : typeof value === "number" ?
              String(value)
            : typeof value === "boolean" ?
              String(value)
            : ""}
          </div>
        );
    }
  };

  const getComponentContent = () => {
    // Fields that should be displayed in Telegram preview
    const displayableFields = [
      "text",
      "caption",
      "message",
      "content",
      "description",
    ];

    const fields = Object.entries(componentSchema)
      .filter(([key, schema]) => {
        const value = formValues[key];
        if (!value && value !== false) return false;

        // Skip internal/technical fields
        const internalFields = [
          "chat_id",
          "user_id",
          "message_id",
          "thread_id",
          "reply_to_message_id",
          "bot_token",
          "webhook_url",
        ];
        if (internalFields.includes(key.toLowerCase())) return false;

        // Include file fields
        if (schema.type === "FileField") return true;

        // Include boolean fields that are user-facing
        if (schema.type === "BooleanField") return true;

        // Include displayable text fields
        if (
          displayableFields.some((field) => key.toLowerCase().includes(field))
        )
          return true;

        // Include other text fields that aren't internal
        if (typeof value === "string" && value.trim() !== "") return true;

        return false;
      })
      .map(([key, schema]) => ({
        key,
        schema,
        value: formValues[key],
        label: schema.verbose_name || key,
      }));

    return fields;
  };

  const componentFields = getComponentContent();

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-gray-700 bg-gray-900 shadow-2xl">
      {/* Telegram Header */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-700 px-4 py-3 text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/5 shadow-lg backdrop-blur-sm">
            <MessageCircle className="size-5 text-white drop-shadow-sm" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm leading-tight font-semibold drop-shadow-sm">
              Bot Preview
            </h4>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-400 shadow-sm"></div>
              <p className="text-xs leading-tight font-medium text-gray-300">
                online
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20">
              <Phone className="size-4 text-white/90" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20">
              <Search className="size-4 text-white/90" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20">
              <MoreVertical className="size-4 text-white/90" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div
        className="via-gray-850 relative flex min-h-[500px] flex-col overflow-hidden bg-gradient-to-b from-gray-800 to-gray-800 p-4"
        style={{
          backgroundImage: `
               radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 50%),
               radial-gradient(circle at 40% 80%, rgba(255,255,255,0.02) 0%, transparent 50%)
             `,
        }}
      >
        {/* Chat Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Bot Message with Component Data */}
        <div className="relative z-10 mb-6 flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-700 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            </div>
          </div>
          <div className="max-w-[85%]">
            <div className="relative rounded-3xl rounded-tl-lg border border-gray-600/50 bg-gray-700 p-4 shadow-lg backdrop-blur-sm">
              {/* Message tail */}
              <div className="absolute top-0 -left-2 h-6 w-6">
                <div className="h-6 w-6 rotate-45 transform rounded-tl-lg border-t border-l border-gray-600/50 bg-gray-700"></div>
              </div>

              {/* Component Title */}
              {componentFields.length > 0 && (
                <div className="mb-4 border-b border-gray-600 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                      <span className="text-xs font-bold text-white">📋</span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-100">
                      {componentName}
                    </h4>
                  </div>
                </div>
              )}

              {/* Component Fields */}
              {componentFields.length > 0 ?
                <div className="space-y-4">
                  {componentFields.map(({ key, schema, value }) => (
                    <div key={key}>{renderFieldValue(key, value, schema)}</div>
                  ))}
                </div>
              : <div className="py-8 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700">
                    <MessageCircle className="size-7 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-400">
                    Fill in the form fields to see them here
                  </p>
                </div>
              }

              {/* Inline Keyboard */}
              {keyboardType === "inline" && hasButtons && (
                <div className="mt-4 border-t border-gray-600 pt-3">
                  <div className="space-y-2">
                    {rows.map((row, rowIndex) => (
                      <div key={rowIndex} className="flex gap-2">
                        {row.map((button) => (
                          <button
                            key={button.id}
                            className="flex-1 rounded-xl border border-blue-500/30 bg-gradient-to-b from-blue-600/20 to-blue-700/20 px-3 py-2.5 text-xs font-medium text-blue-300 shadow-sm transition-all duration-200 hover:from-blue-500/30 hover:to-blue-600/30 hover:shadow-md"
                          >
                            {button.label}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-2 ml-3 flex items-center gap-2">
              <p className="text-xs font-medium text-gray-400">Bot</p>
              <div className="h-1 w-1 rounded-full bg-gray-500"></div>
              <p className="text-xs text-gray-500">just now</p>
              <div className="ml-1 flex gap-1">
                <div className="h-3 w-3 text-blue-400">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-full w-full fill-current"
                  >
                    <path d="M15.854 1.146a.5.5 0 0 1 0 .708l-8 8a.5.5 0 0 1-.708 0l-4-4a.5.5 0 1 1 .708-.708L7 8.293l7.146-7.147a.5.5 0 0 1 .708 0z" />
                    <path d="M10.854 1.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708l3-3a.5.5 0 0 1 .708 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto">
          {/* Input Area */}
          <div className="flex items-center gap-3 rounded-3xl border border-gray-600/50 bg-gray-700 p-3 shadow-lg backdrop-blur-sm">
            <div className="flex flex-1 items-center gap-3">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700 transition-all hover:from-gray-500 hover:to-gray-600">
                <span className="text-lg text-gray-300">😊</span>
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm font-normal text-gray-200 placeholder-gray-400 outline-none"
                readOnly
              />
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-700 transition-all hover:from-gray-500 hover:to-gray-600">
                <span className="text-lg text-gray-300">📎</span>
              </button>
            </div>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg transition-all hover:from-blue-600 hover:to-blue-700">
              <Send className="size-4" />
            </button>
          </div>

          {/* Reply Keyboard */}
          {keyboardType === "reply" && hasButtons && (
            <div className="mt-3 rounded-2xl border border-gray-600/50 bg-gray-700/80 p-3 shadow-lg backdrop-blur-sm">
              <div className="space-y-2">
                {rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex gap-2">
                    {row.map((button) => (
                      <button
                        key={button.id}
                        className="flex-1 rounded-xl border border-gray-500/50 bg-gradient-to-b from-gray-600 to-gray-700 px-4 py-3 text-sm font-medium text-gray-200 shadow-sm transition-all duration-200 hover:from-gray-500 hover:to-gray-600 hover:shadow-md"
                      >
                        {button.label}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
