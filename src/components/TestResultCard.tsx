"use client"

import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface TestResultCardProps {
  testResult: string
}

const TestResultCard: React.FC<TestResultCardProps> = ({
  testResult,
}) => {
  return (
    <Card className="shadow-md border border-slate-200">
      
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">
          Diagnostic Result
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
          <p className="text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
            {testResult}
          </p>
        </div>
      </CardContent>

    </Card>
  )
}

export default TestResultCard