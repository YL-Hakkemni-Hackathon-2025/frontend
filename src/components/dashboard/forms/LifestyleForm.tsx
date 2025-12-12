import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'
import { FormSelect } from '@/components/FormSelect'
import { LifestyleCategory } from '@/utils/global.types'

interface LifestyleFormProps {
  isOpen: boolean
  form: { category: string; description: string; frequency: string; startDate: string; notes: string }
  isValid: boolean
  onFormChange: (form: { category: string; description: string; frequency: string; startDate: string; notes: string }) => void
  onClose: () => void
  onSave: () => void
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

export function LifestyleForm({ isOpen, form, isValid, onFormChange, onClose, onSave }: LifestyleFormProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} isValid={isValid}>
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
      </div>
    </BottomSheet>
  )
}
