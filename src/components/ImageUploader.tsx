"use client"

import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RiEmpathizeLine, RiFlashlightLine, RiUpload2Line } from "@remixicon/react"



interface ImageUploaderProps {
  uploadedFile: File | null
  filePreview: string | null
  analyzing: boolean
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveFile: () => void
  handleAnalyzeImage: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  uploadedFile,
  filePreview,
  analyzing,
  handleFileUpload,
  handleRemoveFile,
  handleAnalyzeImage,
  fileInputRef,
}) => {
  return (
    <Card className="shadow-md border border-slate-200 rounded-2xl">

      {/* Header */}
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg">
          <RiEmpathizeLine size={22} />
          Upload Lab Report
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {!uploadedFile ? (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 text-center hover:border-cyan-500 transition-colors cursor-pointer">

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
              <RiUpload2Line size={56} className="text-slate-400" />

              <div>
                <p className="font-medium text-slate-700">
                  Click to upload image
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  JPG, PNG, or medical scan files
                </p>
              </div>
            </label>
          </div>
        ) : (
          <div className="space-y-5">

            {/* File Info */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-4">

              <div className="flex items-center gap-3">
                <RiUpload2Line className="text-green-500" size={20} />
                <div>
                  <p className="font-medium text-slate-800">
                    Image Loaded
                  </p>
                  <p className="text-sm text-slate-500">
                    {uploadedFile.name}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
              >
                ✕
              </Button>
            </div>

            <Separator />

            {/* Preview */}
            {filePreview && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <img
                  src={filePreview}
                  alt="Uploaded preview"
                  className="w-full h-96 object-contain rounded-md"
                />
              </div>
            )}

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyzeImage}
              disabled={analyzing}
              className="w-full text-base font-semibold flex items-center justify-center gap-2"
              size="lg"
            >
              <RiFlashlightLine size={18} />
              {analyzing ? "Analyzing..." : "Analyze Image"}
            </Button>

          </div>
        )}

      </CardContent>
    </Card>
  )
}

export default ImageUploader
