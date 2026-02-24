'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Loader2, ArrowLeft } from 'lucide-react'
import { RiArrowLeftBoxLine, RiArrowLeftLine, RiStethoscopeLine } from '@remixicon/react'

interface CardiacPageProps {
  onBack?: () => void
}

export default function CardiacPage({ onBack }: CardiacPageProps) {
  const [formData, setFormData] = useState<any>({
    Age: '',
    Gender: '',
    BMI: '',
    BP_Systolic: '',
    BP_Diastolic: '',
    Heart_Rate: '',
    Troponin_T: '',
    CK_MB: '',
    BNP: '',
    Total_Cholesterol: '',
    LDL: '',
    HDL: '',
    Triglycerides: '',
    Fasting_Glucose: '',
    HbA1c: '',
    Creatinine: '',
    BUN: '',
    eGFR: '',
    Sodium: '',
    Potassium: '',
    Calcium: '',
    ALT: '',
    AST: '',
    CRP: '',
    ESR: '',
    Patient_Category: '',
    Cardiac_Risk_Level: '',
  })

  const [errors, setErrors] = useState<any>({})
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: any = {}

    if (!formData.Age || Number(formData.Age) < 1 || Number(formData.Age) > 120) {
      newErrors.Age = 'Age must be between 1 and 120'
    }

    if (!formData.Gender) {
      newErrors.Gender = 'Gender is required'
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch(
        'https://recommendedtest-744384162454.asia-south1.run.app',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            Object.fromEntries(
              Object.entries(formData).map(([k, v]) => [
                k,
                k === 'Gender' || k === 'Patient_Category'
                  ? v
                  : Number(v) || 0,
              ])
            )
          ),
        }
      )

      if (!response.ok) throw new Error('API request failed')

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-9 w-9"
          >
            <RiArrowLeftLine className="h-4 w-4" />
          </Button>
        )}
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-cyan-600">
          <RiStethoscopeLine className="inline-block w-6 h-6 text-cyan-600" />
          Cardiac
        </h2>
      </div>

      {/* Form */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >

            {/* Age */}
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                value={formData.Age}
                onChange={(e) =>
                  handleChange('Age', e.target.value)
                }
              />
              {errors.Age && (
                <p className="text-sm text-red-500">
                  {errors.Age}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                onValueChange={(v) =>
                  handleChange('Gender', v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.Gender && (
                <p className="text-sm text-red-500">
                  {errors.Gender}
                </p>
              )}
            </div>

            {/* Dynamic Numeric Fields */}
            {[
              'BMI',
              'BP_Systolic',
              'BP_Diastolic',
              'Heart_Rate',
              'Total_Cholesterol',
              'LDL',
              'HDL',
              'Triglycerides',
              'Fasting_Glucose',
              'HbA1c',
              'Creatinine',
              'BUN',
              'eGFR',
              'Sodium',
              'Potassium',
              'Calcium',
              'ALT',
              'AST',
              'CRP',
              'ESR',
              'Troponin_T',
              'CK_MB',
              'BNP',
              'Cardiac_Risk_Level',
            ].map((field) => (
              <div key={field} className="space-y-2">
                <Label>{field.replaceAll('_', ' ')}</Label>
                <Input
                  type="number"
                  value={formData[field]}
                  onChange={(e) =>
                    handleChange(field, e.target.value)
                  }
                />
              </div>
            ))}

            {/* Patient Category */}
            <div className="space-y-2">
              <Label>Patient Category</Label>
              <Input
                value={formData.Patient_Category}
                onChange={(e) =>
                  handleChange(
                    'Patient_Category',
                    e.target.value
                  )
                }
              />
            </div>

            {/* Submit */}
            <div className="lg:col-span-3">
              <Button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                disabled={loading}
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading
                  ? 'Analyzing...'
                  : 'Run Cardiac Assessment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Assessment Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap break-words">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}