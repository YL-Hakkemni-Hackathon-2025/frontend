import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'
import { AutocompleteInput, MedicalConditionSuggestion } from '@/components/AutocompleteInput'

interface MedicalConditionFormProps {
  isOpen: boolean
  form: { name: string; diagnosedDate: string; notes: string }
  isValid: boolean
  isSaving?: boolean
  isDeleting?: boolean
  isEditMode?: boolean
  onFormChange: (form: { name: string; diagnosedDate: string; notes: string }) => void
  onClose: () => void
  onSave: () => void
  onDelete?: () => void
}

export function MedicalConditionForm({ isOpen, form, isValid, isSaving, isDeleting, isEditMode, onFormChange, onClose, onSave, onDelete }: MedicalConditionFormProps) {

  const handleSuggestionSelect = (suggestion: MedicalConditionSuggestion) => {
    // Optionally populate notes with description if available
    if (suggestion.description && !form.notes) {
      onFormChange({ ...form, name: suggestion.name, notes: suggestion.description })
    }
  }
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} isValid={isValid} isSaving={isSaving} isDeleting={isDeleting}>
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

        {isEditMode && onDelete && (
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="w-full flex items-center justify-center gap-2 py-3 text-center"
            style={{
              fontFamily: 'Inter',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '121%',
              letterSpacing: '0%',
              color: isDeleting ? '#A4A4A4' : '#FF0000',
            }}
          >
            {isDeleting && (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {isDeleting ? 'Deleting...' : 'Delete this medical condition'}
          </button>
        )}
      </div>
    </BottomSheet>
  )
}
