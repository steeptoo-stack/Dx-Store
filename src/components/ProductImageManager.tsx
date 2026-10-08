import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Trash2, 
  Star, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Image as ImageIcon 
} from 'lucide-react';

interface ProductImageManagerProps {
  images: string[];
  mainImage: string;
  onChange: (images: string[], mainImage: string) => void;
  token?: string | null;
}

export const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  images,
  mainImage,
  onChange,
  token
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxBytes = 5 * 1024 * 1024; // 5 MB

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return 'Please select a JPG, PNG or WEBP image.';
    }
    if (file.size > maxBytes) {
      return 'Image size must be less than 5MB.';
    }
    return null;
  };

  const uploadFileToServer = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const authToken = token || sessionStorage.getItem('dx_admin_token') || localStorage.getItem('dx_admin_token') || '';

          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
              fileName: file.name,
              fileType: file.type,
              fileData: base64Data
            })
          });

          if (!res.ok) {
            // Static hosting fallback (e.g. GitHub Pages without Node backend)
            if (res.status === 404 || res.status === 502 || res.status === 503) {
              resolve(base64Data);
              return;
            }
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error || 'Image upload failed. Please try again.');
          }

          const data = await res.json();
          resolve(data.url);
        } catch (err: any) {
          // If network error (static GitHub Pages), use the base64 data URL directly
          if (reader.result) {
            resolve(reader.result as string);
            return;
          }
          reject(err);
        }
      };
      reader.onerror = () => {
        reject(new Error('Image upload failed. Please try again.'));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorMessage(null);
    setUploading(true);

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const error = validateFile(file);
      if (error) {
        setErrorMessage(error);
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      validFiles.push(file);
    }

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < validFiles.length; i++) {
        setUploadProgress(`Uploading ${i + 1} of ${validFiles.length}...`);
        const url = await uploadFileToServer(validFiles[i]);
        newUrls.push(url);
      }

      const updatedImages = [...images, ...newUrls];
      const updatedMain = mainImage && images.includes(mainImage) 
        ? mainImage 
        : updatedImages[0] || '';

      onChange(updatedImages, updatedMain);
      setUploadProgress(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleReplaceFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || replacingIndex === null) return;

    setErrorMessage(null);
    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
      return;
    }

    setUploading(true);
    setUploadProgress('Replacing image...');

    try {
      const newUrl = await uploadFileToServer(file);
      const oldUrl = images[replacingIndex];

      const updatedImages = [...images];
      updatedImages[replacingIndex] = newUrl;

      const updatedMain = mainImage === oldUrl ? newUrl : mainImage;
      onChange(updatedImages, updatedMain);
    } catch (err: any) {
      setErrorMessage(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(null);
      setReplacingIndex(null);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  const handleSetMain = (url: string) => {
    onChange(images, url);
  };

  const handleRemove = (index: number) => {
    const removedUrl = images[index];
    const updatedImages = images.filter((_, i) => i !== index);

    let updatedMain = mainImage;
    if (mainImage === removedUrl) {
      updatedMain = updatedImages[0] || '';
    }

    onChange(updatedImages, updatedMain);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const updatedImages = [...images];
    const temp = updatedImages[index];
    updatedImages[index] = updatedImages[targetIndex];
    updatedImages[targetIndex] = temp;

    onChange(updatedImages, mainImage);
  };

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <div 
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer group ${
          uploading 
            ? 'border-cyan-500/50 bg-cyan-950/20 pointer-events-none' 
            : 'border-slate-700 hover:border-cyan-500 bg-slate-950/60 hover:bg-slate-950'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFilesSelected}
        />

        <input
          ref={replaceInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleReplaceFileSelected}
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">
              {uploading ? (uploadProgress || 'Uploading images...') : 'Upload Product Images'}
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              JPG, JPEG, PNG or WEBP — Maximum 5MB
            </p>
            <p className="text-[11px] text-cyan-400/80 mt-1">
              Select multiple photos from device or phone camera
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
          <button 
            type="button"
            onClick={() => setErrorMessage(null)} 
            className="text-xs text-red-400 hover:text-white ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Thumbnails Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Product Gallery ({images.length} {images.length === 1 ? 'image' : 'images'})</span>
            <span className="text-[11px] text-cyan-400">Marked image will display as primary photo</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, idx) => {
              const isMain = url === mainImage || (!mainImage && idx === 0);

              return (
                <div 
                  key={idx} 
                  className={`group relative rounded-xl overflow-hidden border bg-slate-950 flex flex-col transition-all ${
                    isMain ? 'border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-950/40' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Image View */}
                  <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                    <img 
                      src={url} 
                      alt={`Product thumbnail ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = './placeholder-security.svg';
                      }}
                    />

                    {/* Main Badge */}
                    {isMain && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                        <Star className="w-3 h-3 fill-slate-950" />
                        <span>MAIN</span>
                      </div>
                    )}

                    {/* Reorder Left/Right in corner */}
                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 rounded-md p-0.5">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'left')}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Left"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'right')}
                        disabled={idx === images.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Right"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-2 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] gap-1">
                    {!isMain ? (
                      <button
                        type="button"
                        onClick={() => handleSetMain(url)}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-semibold text-[10px] transition-colors flex items-center gap-1"
                      >
                        <Star className="w-3 h-3" />
                        <span>Set Main</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-cyan-400 font-bold px-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Primary</span>
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setReplacingIndex(idx);
                          replaceInputRef.current?.click();
                        }}
                        className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                        title="Replace Image"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
