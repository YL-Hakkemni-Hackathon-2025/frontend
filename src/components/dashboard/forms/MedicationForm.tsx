import { useState, useRef } from 'react'
import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'
import { FormSelect } from '@/components/FormSelect'
import { MedicationFrequency } from '@/utils/global.types'
import { AutocompleteInput, MedicationSuggestion } from '@/components/AutocompleteInput'
import { useAtomValue } from 'jotai'
import { userAtom } from '@/atoms/user.atom'
import { apiUrl } from '@/utils/api'
import toast from 'react-hot-toast'

interface MedicationFormProps {
  isOpen: boolean
  form: { medicationName: string; dosageAmount: string; frequency: string; startDate: string; endDate: string; notes: string }
  isValid: boolean
  onFormChange: (form: { medicationName: string; dosageAmount: string; frequency: string; startDate: string; endDate: string; notes: string }) => void
  onClose: () => void
  onSave: () => void
}

interface ScanMedicineResponse {
  medicationName?: string
  genericName?: string
  brandName?: string
  dosageAmount?: string
  frequency?: string
  form?: string
  strength?: string
  manufacturer?: string
  activeIngredients?: string[]
  instructions?: string
  warnings?: string[]
  expiryDate?: string
  confidence?: number
  notes?: string
}

const frequencyOptions = [
  { value: MedicationFrequency.ONCE_DAILY, label: 'Once daily' },
  { value: MedicationFrequency.TWICE_DAILY, label: 'Twice daily' },
  { value: MedicationFrequency.THREE_TIMES_DAILY, label: 'Three times daily' },
  { value: MedicationFrequency.FOUR_TIMES_DAILY, label: 'Four times daily' },
  { value: MedicationFrequency.AS_NEEDED, label: 'As needed' },
  { value: MedicationFrequency.WEEKLY, label: 'Weekly' },
  { value: MedicationFrequency.MONTHLY, label: 'Monthly' },
  { value: MedicationFrequency.OTHER, label: 'Other' },
]

// Map API frequency values to our enum values
const mapFrequency = (apiFrequency?: string): string => {
  if (!apiFrequency) return ''
  const frequencyMap: Record<string, string> = {
    'once_daily': MedicationFrequency.ONCE_DAILY,
    'twice_daily': MedicationFrequency.TWICE_DAILY,
    'three_times_daily': MedicationFrequency.THREE_TIMES_DAILY,
    'four_times_daily': MedicationFrequency.FOUR_TIMES_DAILY,
    'as_needed': MedicationFrequency.AS_NEEDED,
    'weekly': MedicationFrequency.WEEKLY,
    'monthly': MedicationFrequency.MONTHLY,
    'other': MedicationFrequency.OTHER,
  }
  return frequencyMap[apiFrequency.toLowerCase()] || ''
}

export function MedicationForm({ isOpen, form, isValid, onFormChange, onClose, onSave }: MedicationFormProps) {
  const [isScanning, setIsScanning] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const authData = useAtomValue(userAtom)

  const handleSuggestionSelect = (suggestion: MedicationSuggestion) => {
    // Auto-fill dosage if available and not already set
    if (suggestion.commonDosages?.length && !form.dosageAmount) {
      onFormChange({
        ...form,
        medicationName: suggestion.name,
        dosageAmount: suggestion.commonDosages[0]
      })
    }
  }

  const handlePhotoCapture = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !authData?.accessToken) return

    setIsScanning(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch(apiUrl('/api/v1/autocomplete/scan-medicine'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authData.accessToken}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to scan medicine')
      }

      const data: ScanMedicineResponse = result.data

      // Build notes from extracted info
      const noteParts: string[] = []
      if (data.brandName && data.genericName && data.brandName !== data.genericName) {
        noteParts.push(`Brand: ${data.brandName}, Generic: ${data.genericName}`)
      }
      if (data.manufacturer) {
        noteParts.push(`Manufacturer: ${data.manufacturer}`)
      }
      if (data.instructions) {
        noteParts.push(`Instructions: ${data.instructions}`)
      }
      if (data.warnings?.length) {
        noteParts.push(`Warnings: ${data.warnings.join(', ')}`)
      }
      if (data.notes) {
        noteParts.push(data.notes)
      }

      // Update form with extracted data
      onFormChange({
        ...form,
        medicationName: data.medicationName || data.brandName || form.medicationName,
        dosageAmount: data.dosageAmount || data.strength || form.dosageAmount,
        frequency: mapFrequency(data.frequency) || form.frequency,
        notes: noteParts.length > 0 ? noteParts.join('. ') : form.notes,
      })

      const confidence = data.confidence ? Math.round(data.confidence * 100) : null
      toast.success(`Medicine scanned successfully${confidence ? ` (${confidence}% confidence)` : ''}`)
    } catch (error) {
      console.error('Failed to scan medicine:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to scan medicine photo')
    } finally {
      setIsScanning(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} isValid={isValid}>
      <div className="flex flex-col gap-6">
        {/* Scan Medicine Photo Button */}
        <button
          type="button"
          onClick={handlePhotoCapture}
          disabled={isScanning}
          className="w-full h-14 border-2 border-dashed border-[#003AAB] rounded-2xl flex items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScanning ? (
            <>
              <div className="w-5 h-5 border-2 border-[#003AAB] border-t-transparent rounded-full animate-spin" />
              <span className="font-semibold text-[#003AAB]">Scanning medicine...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6 text-[#003AAB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-semibold text-[#003AAB]">Take a photo of medicine</span>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <AutocompleteInput
          label="Medication name"
          placeholder="e.g., Paracetamol"
          value={form.medicationName}
          onChange={(value) => onFormChange({ ...form, medicationName: value })}
          endpoint="medications"
          onSuggestionSelect={(s) => handleSuggestionSelect(s as MedicationSuggestion)}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Dosage"
            placeholder="e.g., 500mg"
            value={form.dosageAmount}
            onChange={(value) => onFormChange({ ...form, dosageAmount: value })}
          />
          <FormSelect
            label="Frequency"
            placeholder="Select frequency"
            value={form.frequency}
            onChange={(value) => onFormChange({ ...form, frequency: value })}
            options={frequencyOptions}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Start date"
            type="date"
            value={form.startDate}
            onChange={(value) => onFormChange({ ...form, startDate: value })}
          />
          <FormInput
            label="End date"
            optional
            type="date"
            value={form.endDate}
            onChange={(value) => onFormChange({ ...form, endDate: value })}
          />
        </div>
        <FormTextArea
          label="Notes"
          optional
          placeholder="Additional context for this medication"
          value={form.notes}
          onChange={(value) => onFormChange({ ...form, notes: value })}
        />
      </div>
    </BottomSheet>
  )
}
