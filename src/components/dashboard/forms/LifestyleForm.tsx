import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'
import { FormSelect } from '@/components/FormSelect'
import { LifestyleCategory } from '@/utils/global.types'

interface LifestyleFormProps {
  isOpen: boolean
  form: { category: string; description: string; frequency: string; startDate: string; notes: string }
  isValid: boolean
  isSaving?: boolean
  isDeleting?: boolean
  isEditMode?: boolean
  onFormChange: (form: { category: string; description: string; frequency: string; startDate: string; notes: string }) => void
  onClose: () => void
  onSave: () => void
  onDelete?: () => void
}

const lifestyleCategoryOptions = [
  { value: LifestyleCategory.SMOKING, label: 'Smoking' },
  { value: LifestyleCategory.ALCOHOL, label: 'Alcohol' },
  { value: LifestyleCategory.EXERCISE, label: 'Exercise' },
  { value: LifestyleCategory.DIET, label: 'Diet' },
  { value: LifestyleCategory.SLEEP, label: 'Sleep' },
  { value: LifestyleCategory.STRESS, label: 'Stress' },
  { value: LifestyleCategory.OTHER, label: 'Other' },
]

export function LifestyleForm({ isOpen, form, isValid, isSaving, isDeleting, isEditMode, onFormChange, onClose, onSave, onDelete }: LifestyleFormProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} isValid={isValid} isSaving={isSaving} isDeleting={isDeleting}>
      <div className="flex flex-col gap-6">
        <FormSelect
          label="Category"
          placeholder="Select category"
          value={form.category}
          onChange={(value) => onFormChange({ ...form, category: value })}
          options={lifestyleCategoryOptions}
        />
        <FormInput
          label="Description"
          placeholder="e.g., Non-smoker"
          value={form.description}
          onChange={(value) => onFormChange({ ...form, description: value })}
        />
        <FormInput
          label="Frequency"
          optional
          placeholder="e.g., Daily, Weekly"
          value={form.frequency}
          onChange={(value) => onFormChange({ ...form, frequency: value })}
        />
        <FormInput
          label="Start date"
          optional
          type="date"
          value={form.startDate}
          onChange={(value) => onFormChange({ ...form, startDate: value })}
        />
        <FormTextArea
          label="Notes"
          optional
          placeholder="Additional context for this lifestyle choice"
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
            {isDeleting ? 'Deleting...' : 'Delete this lifestyle'}
          </button>
        )}
      </div>
    </BottomSheet>
  )
}
