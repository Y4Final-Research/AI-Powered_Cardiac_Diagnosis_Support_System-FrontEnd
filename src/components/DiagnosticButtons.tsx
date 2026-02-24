"use client"

import React from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  RiStethoscopeLine,
  RiHeartAddLine,
  RiMicroscopeLine,
} from "@remixicon/react"

interface DiagnosticButtonsProps {
  onSelect: (type: string) => void
}

const DiagnosticButtons: React.FC<DiagnosticButtonsProps> = ({ onSelect }) => {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">

      {/* Cardiac Test */}
      <Card
        onClick={() => onSelect("cardiac")}
        className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-cyan-200 bg-cyan-50"
      >
        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 bg-cyan-100 rounded-full flex items-center justify-center">
            <RiStethoscopeLine className="w-6 h-6 text-cyan-600" />
          </div>
          <span className="text-gray-800 font-semibold text-lg">
            Cardiac Test
          </span>
        </CardContent>
      </Card>

      {/* Heart Test */}
      <Card
        onClick={() => onSelect("heart")}
        className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-pink-200 bg-pink-50"
      >
        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center">
            <RiHeartAddLine className="w-6 h-6 text-pink-600" />
          </div>
          <span className="text-gray-800 font-semibold text-lg">
            Heart Test
          </span>
        </CardContent>
      </Card>

      {/* Diabetic Test */}
      <Card
        onClick={() => onSelect("diabetic")}
        className="cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 border-yellow-200 bg-yellow-50"
      >
        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
            <RiMicroscopeLine className="w-6 h-6 text-yellow-600" />
          </div>
          <span className="text-gray-800 font-semibold text-lg">
            Diabetic Test
          </span>
        </CardContent>
      </Card>
    </div>
  )
}

export default DiagnosticButtons
