import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'
import { AutocompleteInput, MedicalConditionSuggestion } from '@/components/AutocompleteInput'

interface MedicalConditionFormProps {
  isOpen: boolean
  form: { name: string; diagnosedDate: string; notes: string }
  isValid: boolean
  onFormChange: (form: { name: string; diagnosedDate: string; notes: string }) => void
  onClose: () => void
  onSave: () => void
}

export function MedicalConditionForm({ isOpen, form, isValid, onFormChange, onClose, onSave }: MedicalConditionFormProps) {
  const handleSuggestionSelect = (suggestion: MedicalConditionSuggestion) => {
    // Optionally populate notes with description if available
    if (suggestion.description && !form.notes) {
      onFormChange({ ...form, name: suggestion.name, notes: suggestion.description })
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} isValid={isValid}>
      <div className="flex flex-col gap-6">
        <AutocompleteInput
          label="Condition name"
          placeholder="e.g., Eczema"
          value={form.name}
          onChange={(value) => onFormChange({ ...form, name: value })}
          endpoint="medical-conditions"
          onSuggestionSelect={(s) => handleSuggestionSelect(s as MedicalConditionSuggestion)}
        />
        <FormInput
          label="Diagnosed date"
          optional
          type="date"
          value={form.diagnosedDate}
          onChange={(value) => onFormChange({ ...form, diagnosedDate: value })}
        />
        <FormTextArea
          label="Notes"
          optional
          placeholder="Additional context for this condition"
          value={form.notes}
          onChange={(value) => onFormChange({ ...form, notes: value })}
        />
      </div>
    </BottomSheet>
  )
}
