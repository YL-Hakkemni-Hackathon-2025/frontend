import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'

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
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} onDelete={onDelete} isValid={isValid} isSaving={isSaving} isDeleting={isDeleting} isEditMode={isEditMode}>
      <div className="flex flex-col gap-6">
        <FormInput
          label="Condition name"
          placeholder="e.g., Eczema"
          value={form.name}
          onChange={(value) => onFormChange({ ...form, name: value })}
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
