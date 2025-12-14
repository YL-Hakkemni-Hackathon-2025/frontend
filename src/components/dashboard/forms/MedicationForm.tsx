import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'
import { FormSelect } from '@/components/FormSelect'
import { MedicationFrequency } from '@/utils/global.types'
import { AutocompleteInput, MedicationSuggestion } from '@/components/AutocompleteInput'

interface MedicationFormProps {
  isOpen: boolean
  form: { medicationName: string; dosageAmount: string; frequency: string; startDate: string; endDate: string; notes: string }
  isValid: boolean
  onFormChange: (form: { medicationName: string; dosageAmount: string; frequency: string; startDate: string; endDate: string; notes: string }) => void
  onClose: () => void
  onSave: () => void
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

export function MedicationForm({ isOpen, form, isValid, onFormChange, onClose, onSave }: MedicationFormProps) {
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

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} isValid={isValid}>
      <div className="flex flex-col gap-6">
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
