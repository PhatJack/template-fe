import React from "react";
import {
  File,
  FileImage,
  FileText,
  FileCode2,
  FileArchive,
  FileVideo,
  FileAudio,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { Tooltip } from "react-tooltip";

interface FileItemProps {
  file: File;
  onRemove?: () => void;
}

const getFileIcon = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase();

  switch (extension) {
    // Images
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "webp":
    case "svg":
      return <FileImage size={18} />;

    // Documents
    case "txt":
    case "md":
    case "doc":
    case "docx":
    case "pdf":
      return <FileText size={18} />;

    // Code
    case "js":
    case "ts":
    case "tsx":
    case "jsx":
    case "json":
    case "html":
    case "css":
      return <FileCode2 size={18} />;

    // Spreadsheet
    case "xls":
    case "xlsx":
    case "csv":
      return <FileSpreadsheet size={18} />;

    // Video
    case "mp4":
    case "mov":
    case "avi":
    case "mkv":
      return <FileVideo size={18} />;

    // Audio
    case "mp3":
    case "wav":
    case "ogg":
      return <FileAudio size={18} />;

    // Archive
    case "zip":
    case "rar":
    case "7z":
      return <FileArchive size={18} />;

    default:
      return <File size={18} />;
  }
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileType = (file: File) => {
  const extension = file.name.split(".").pop()?.toUpperCase();

  return extension || "FILE";
};

const FileItem = ({ file, onRemove }: FileItemProps) => {
  const tooltipId = React.useId();

  return (
    <>
      <div
        data-tooltip-id={tooltipId}
        data-tooltip-content={file.name}
        className="bg-muted-surface border-border-light relative flex max-w-xs min-w-0 items-center gap-3 rounded-2xl border px-3 py-2"
      >
        <div className="text-muted-foreground shrink-0">
          {getFileIcon(file)}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-foreground truncate pr-4 text-sm font-medium">
            {file.name}
          </p>

          <p className="text-muted-foreground text-xs">
            {getFileType(file)} · {formatFileSize(file.size)}
          </p>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            data-tooltip-id={tooltipId}
            data-tooltip-content="Remove file"
            className="bg-soft-background hover:text-error text-muted-foreground absolute top-1 right-1 cursor-pointer rounded-full p-1 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <Tooltip id={tooltipId} />
    </>
  );
};

export default React.memo(FileItem);
