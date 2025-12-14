import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'
import { FormSelect } from '@/components/FormSelect'
import { AllergySeverity } from '@/dtos/allergy.dto'
import { AutocompleteInput, AllergySuggestion } from '@/components/AutocompleteInput'

interface AllergyFormProps {
  isOpen: boolean
  form: { allergen: string; severity: string; diagnosedDate: string; notes: string }
  isValid: boolean
  onFormChange: (form: { allergen: string; severity: string; diagnosedDate: string; notes: string }) => void
  isSaving?: boolean
  isDeleting?: boolean
  isEditMode?: boolean
  onClose: () => void
  onSave: () => void
  onDelete?: () => void
}

const allergySeverityOptions = [
  { value: AllergySeverity.MILD, label: 'Mild' },
  { value: AllergySeverity.MODERATE, label: 'Moderate' },
  { value: AllergySeverity.SEVERE, label: 'Severe' },
  { value: AllergySeverity.LIFE_THREATENING, label: 'Life-threatening' },
]

export function AllergyForm({ isOpen, form, isValid, isSaving, isDeleting, isEditMode, onFormChange, onClose, onSave, onDelete }: AllergyFormProps) {

   const handleSuggestionSelect = (suggestion: AllergySuggestion) => {
    // Auto-fill notes with common reactions if available
    const updates: Partial<typeof form> = { allergen: suggestion.name }

    if (suggestion.commonReactions?.length && !form.notes) {
      updates.notes = `Common reactions: ${suggestion.commonReactions.join(', ')}`
    }

    onFormChange({ ...form, ...updates })
  }
    
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} onDelete={onDelete} isValid={isValid} isSaving={isSaving} isDeleting={isDeleting} isEditMode={isEditMode}>
      <div className="flex flex-col gap-6">
        <AutocompleteInput
          label="Allergen"
          placeholder="e.g., Peanuts"
          value={form.allergen}
          onChange={(value) => onFormChange({ ...form, allergen: value })}
          endpoint="allergies"
          onSuggestionSelect={(s) => handleSuggestionSelect(s as AllergySuggestion)}
        />
        <FormSelect
          label="Severity"
          optional
          placeholder="Select severity"
          value={form.severity}
          onChange={(value) => onFormChange({ ...form, severity: value })}
          options={allergySeverityOptions}
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
          placeholder="Additional context for this allergy"
          value={form.notes}
          onChange={(value) => onFormChange({ ...form, notes: value })}
        />
      </div>
    </BottomSheet>
  )
}
