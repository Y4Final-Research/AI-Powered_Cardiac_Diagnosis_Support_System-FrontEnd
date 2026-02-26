'use client'

import { useEffect, useState } from 'react'
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
import { Loader2 } from 'lucide-react'
import { RiArrowLeftLine, RiMicroscopeLine } from '@remixicon/react'

interface FormData {
  Age: string
  Gender: string
  BMI: string
  Chol: string
  TG: string
  HDL: string
  LDL: string
  Cr: string
  BUN: string
}

interface FormErrors {
  [key: string]: string;
}

interface DiabeticPageProps {
  onBack?: () => void
}

export default function DiabeticPage({ onBack }: DiabeticPageProps) {
  const [formData, setFormData] = useState<FormData>({
    Age: '',
    Gender: '',
    BMI: '',
    Chol: '',
    TG: '',
    HDL: '',
    LDL: '',
    Cr: '',
    BUN: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const accessToken = localStorage.getItem('access_token');
        
        if (!userId || !accessToken) {
          setFetchingData(false);
          return;
        }
        
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${baseUrl}/api/diabetic/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            Age: data.Age?.toString() || '',
            Gender: data.Gender || '',
            BMI: data.BMI?.toString() || '',
            Chol: data.Chol?.toString() || '',
            TG: data.TG?.toString() || '',
            HDL: data.HDL?.toString() || '',
            LDL: data.LDL?.toString() || '',
            Cr: data.Cr?.toString() || '',
            BUN: data.BUN?.toString() || ''
          });
        }
      } catch (error) {
        console.error('Error fetching diabetic data:', error);
      } finally {
        setFetchingData(false);
      }
    };
    
    fetchData();
  }, []);


  // Unified handler for Input/Select fields
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.Age || isNaN(Number(formData.Age)) || Number(formData.Age) < 1 || Number(formData.Age) > 120) {
      newErrors.Age = 'Age must be between 1 and 120';
    }
    if (!formData.Gender || (formData.Gender !== 'M' && formData.Gender !== 'F')) {
      newErrors.Gender = 'Gender must be M or F';
    }
    return newErrors;
  };

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
        'https://diabetic1-744384162454.asia-south1.run.app',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Age: Number(formData.Age),
            Gender: formData.Gender,
            BMI: Number(formData.BMI),
            Chol: Number(formData.Chol),
            TG: Number(formData.TG),
            HDL: Number(formData.HDL),
            LDL: Number(formData.LDL),
            Cr: Number(formData.Cr),
            BUN: Number(formData.BUN),
          }),
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
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          className="h-9 w-9"
        >
          <RiArrowLeftLine className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-yellow-600">
          <RiMicroscopeLine className="inline-block w-6 h-6 text-yellow-600" />
          Diabetic
        </h2>
      </div>

      {/* Form Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            {/* Age */}
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                value={formData.Age}
                onChange={(e) => handleChange('Age', e.target.value)}
              />
              {errors.Age && (
                <p className="text-sm text-red-500">{errors.Age}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={formData.Gender}
                onValueChange={(value) => handleChange('Gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.Gender && (
                <p className="text-sm text-red-500">{errors.Gender}</p>
              )}
            </div>

            {/* Dynamic Numeric Fields */}
            {[
              'BMI',
              'Chol',
              'TG',
              'HDL',
              'LDL',
              'Cr',
              'BUN',
            ].map((field) => (
              <div key={field} className="space-y-2">
                <Label>{field}</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={(formData as any)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              </div>
            ))}

            {/* Submit Button */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                disabled={loading}
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading ? 'Analyzing...' : 'Run Assessment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Result Card */}
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