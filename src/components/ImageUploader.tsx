import React from 'react';

interface ImageUploaderProps {
  uploadedFile: File | null;
  filePreview: string | null;
  analyzing: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  handleAnalyzeImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  uploadedFile,
  filePreview,
  analyzing,
  handleFileUpload,
  handleRemoveFile,
  handleAnalyzeImage,
  fileInputRef
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 flex items-center">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Image Upload</h2>
      </div>

      {/* Body */}
      <div className="p-6 space-y-4">
        {!uploadedFile ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-cyan-500 transition-colors cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center gap-4 cursor-pointer"
            >
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <div>
                <p className="text-gray-700 font-medium">
                  Click to upload Image
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  or drag and drop (JPG, PNG, etc.)
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Info */}
            <div className="bg-gray-50 border border-cyan-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-cyan-600 font-medium">Image Loaded</p>
                  <p className="text-gray-600 text-sm">{uploadedFile.name}</p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="text-red-500 hover:text-red-400 transition-colors"
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

            {/* Image Preview */}
            {filePreview && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <img
                  src={filePreview}
                  className="w-full h-96 object-contain rounded-lg"
                  alt="Uploaded medical preview"
                />
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyzeImage}
              disabled={analyzing}
              className="w-full bg-cyan-500 hover:bg-blue-500 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors shadow-md"
            >
              {analyzing ? 'Analyzing...' : 'Analyze Image'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;