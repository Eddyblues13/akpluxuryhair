import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ImageUp, Link2, Loader2, Trash2, UploadCloud } from "lucide-react";
import { ACCEPT_ATTR, optimizedUrl, uploadImage } from "../../lib/cloudinary";

/**
 * Drops a file straight into Cloudinary and hands back the delivery URL.
 * A URL field stays available underneath so images hosted elsewhere — or
 * pasted from an existing Cloudinary library — still work.
 */
export default function ImageUploader({ value, onChange, disabled }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const handleFile = async (file) => {
    if (!file || uploading) return;

    setUploading(true);
    setProgress(0);

    try {
      const { url } = await uploadImage(file, { onProgress: setProgress });
      onChange(url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      setProgress(0);
      // Lets the same file be re-picked after a failure.
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="flex flex-wrap items-center gap-4 border border-cream/10 bg-ink/40 p-3">
          <img
            src={optimizedUrl(value, { width: 200 })}
            alt="Product preview"
            className="h-24 w-20 shrink-0 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-cream/50">{value}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={disabled || uploading}
                onClick={() => inputRef.current?.click()}
                className="inline-flex items-center gap-2 border border-cream/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-cream/60 transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
              >
                <ImageUp size={13} /> Replace
              </button>
              <button
                type="button"
                disabled={disabled || uploading}
                onClick={() => onChange("")}
                className="inline-flex items-center gap-2 border border-cream/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-cream/60 transition-colors hover:border-red-400/60 hover:text-red-400 disabled:opacity-40"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex w-full flex-col items-center justify-center gap-3 border border-dashed px-5 py-10 text-center transition-colors ${
            dragging ? "border-gold bg-gold/5" : "border-cream/20 hover:border-gold/60"
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {uploading ? (
            <Loader2 size={22} className="animate-spin text-gold" />
          ) : (
            <UploadCloud size={22} strokeWidth={1.5} className="text-gold" />
          )}
          <span className="text-xs uppercase tracking-[0.2em] text-cream/60">
            {uploading ? `Uploading ${progress}%` : "Drop an image or browse"}
          </span>
          <span className="text-[11px] text-cream/30">JPEG, PNG, WebP or AVIF · up to 10MB</span>
        </button>
      )}

      {uploading && (
        <div className="h-1 w-full overflow-hidden bg-cream/10">
          <div
            className="h-full bg-gold transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {showUrl ? (
        <input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/…"
          disabled={disabled}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowUrl(true)}
          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-cream/40 transition-colors hover:text-gold"
        >
          <Link2 size={12} /> Paste a URL instead
        </button>
      )}
    </div>
  );
}
