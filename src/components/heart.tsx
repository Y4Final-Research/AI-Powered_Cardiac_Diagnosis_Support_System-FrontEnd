'use client'

import { useState, useEffect } from 'react'
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
import { RiArrowLeftLine, RiHeartAddLine } from '@remixicon/react'

interface FormData {
  age: string
  sex: string
  cp: string
  trestbps: string
  chol: string
  fbs: string
  restecg: string
  thalach: string
  exang: string
  oldpeak: string
  slope: string
  ca: string
  thal: string
}

interface FormErrors {
  [key: string]: string;
}

interface HeartPageProps {
  onBack?: () => void
}

export default function HeartPage({ onBack }: HeartPageProps) {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    sex: '',
    cp: '',
    trestbps: '',
    chol: '',
    fbs: '',
    restecg: '',
    thalach: '',
    exang: '',
    oldpeak: '',
    slope: '',
    ca: '',
    thal: '',
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
        const response = await fetch(`${baseUrl}/api/heart/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setFormData({
            age: data.age?.toString() || '',
            sex: data.sex?.toString() || '',
            cp: data.cp?.toString() || '',
            trestbps: data.trestbps?.toString() || '',
            chol: data.chol?.toString() || '',
            fbs: data.fbs?.toString() || '',
            restecg: data.restecg?.toString() || '',
            thalach: data.thalach?.toString() || '',
            exang: data.exang?.toString() || '',
            oldpeak: data.oldpeak?.toString() || '',
            slope: data.slope?.toString() || '',
            ca: data.ca?.toString() || '',
            thal: data.thal?.toString() || ''
          });
        }
      } catch (error) {
        console.error('Error fetching heart data:', error);
      } finally {
        setFetchingData(false);
      }
    };
    
    fetchData();
  }, []);


  // Unified handler for Input fields
  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    }
    if (!formData.sex || (formData.sex !== '0' && formData.sex !== '1')) {
      newErrors.sex = 'Sex must be 0 (Female) or 1 (Male)';
    }
    // Only add keys with string values (never undefined)
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('https://headrtdiseases01-744384162454.asia-south1.run.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: Number(formData.age),
          sex: Number(formData.sex),
          cp: Number(formData.cp),
          trestbps: Number(formData.trestbps),
          chol: Number(formData.chol),
          fbs: Number(formData.fbs),
          restecg: Number(formData.restecg),
          thalach: Number(formData.thalach),
          exang: Number(formData.exang),
          oldpeak: Number(formData.oldpeak),
          slope: Number(formData.slope),
          ca: Number(formData.ca),
          thal: Number(formData.thal)
        })
      });
      
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error('Error:', error);
      setResult({ error: `Failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">

        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="h-9 w-9"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </Button>

        <h2 className="text-2xl font-semibold flex items-center gap-2 text-pink-600">
          <RiHeartAddLine className="inline-block w-6 h-6 text-pink-600" />
          Heart
        </h2>
      </div>

      {/* Form Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Patient Cardiac Parameters</CardTitle>
        </CardHeader>

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
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age}</p>
              )}
            </div>

            {/* Sex */}
            <div className="space-y-2">
              <Label>Sex</Label>
              <Select value={formData.sex} onValueChange={(v) => handleInputChange('sex', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Female</SelectItem>
                  <SelectItem value="1">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Chest Pain */}
            <div className="space-y-2">
              <Label>Chest Pain Type</Label>
              <Select value={formData.cp} onValueChange={(v) => handleInputChange('cp', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Typical angina</SelectItem>
                  <SelectItem value="1">Atypical angina</SelectItem>
                  <SelectItem value="2">Non-anginal pain</SelectItem>
                  <SelectItem value="3">Asymptomatic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic Numeric Inputs */}
            {[
              'trestbps',
              'chol',
              'thalach',
              'oldpeak',
              'ca',
            ].map((field) => (
              <div key={field} className="space-y-2">
                <Label>{field}</Label>
                <Input
                  type="number"
                  value={(formData as any)[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
              </div>
            ))}

            {/* Submit */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
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