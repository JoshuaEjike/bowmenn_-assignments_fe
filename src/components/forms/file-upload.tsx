import { useCallback, useRef, useState } from "react";
import { UploadCloud, FileText, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/app/lib/cn";
import { Button } from "@/components/ui/button";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  selectedFile?: File | null;
  onClear?: () => void;
  error?: string;
}

export function FileUpload({ onFileSelect, isUploading, uploadProgress = 0, selectedFile, onClear, error }: FileUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setLocalError("Unsupported file type. Use JPG, PNG, WEBP, or PDF.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setLocalError("File is too large. Maximum size is 8MB.");
        return;
      }
      setLocalError(null);
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const previewUrl = selectedFile && selectedFile.type.startsWith("image/") ? URL.createObjectURL(selectedFile) : null;

  if (selectedFile) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-border bg-surface p-3">
        {previewUrl ? (
          <img src={previewUrl} alt="Selected proof of delivery" className="h-14 w-14 shrink-0 rounded-md object-cover" />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          {isUploading && (
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-accent-500 transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
        </div>
        {isUploading ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-muted-foreground" />
        ) : (
          onClear && (
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClear} aria-label="Remove file">
              <X className="h-4 w-4" />
            </Button>
          )
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragActive(false);
          const file = e.dataTransfer.files[0];
          if (file) validateAndSelect(file);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-muted/40 px-6 py-8 text-center transition-colors hover:border-primary-300 hover:bg-primary-50/40",
          isDragActive && "border-primary-400 bg-primary-50",
        )}
      >
        <UploadCloud className="h-6 w-6 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium text-foreground">Drop a file here or click to browse</p>
        <p className="text-xs text-muted-foreground">JPG, PNG, WEBP, or PDF — up to 8MB</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) validateAndSelect(file);
        }}
      />
      {(localError ?? error) && <p className="mt-1.5 text-xs text-danger">{localError ?? error}</p>}
    </div>
  );
}
