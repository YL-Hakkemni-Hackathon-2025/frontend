import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'
import { FormSelect } from '@/components/FormSelect'
import { AllergyType, AllergySeverity } from '@/dtos/allergy.dto'

interface AllergyFormProps {
  isOpen: boolean
  form: { allergen: string; type: string; severity: string; reaction: string; diagnosedDate: string; notes: string }
  isValid: boolean
  onFormChange: (form: { allergen: string; type: string; severity: string; reaction: string; diagnosedDate: string; notes: string }) => void
  onClose: () => void
  onSave: () => void
}

const allergyTypeOptions = [
  { value: AllergyType.DRUG, label: 'Drug' },
  { value: AllergyType.FOOD, label: 'Food' },
  { value: AllergyType.ENVIRONMENTAL, label: 'Environmental' },
  { value: AllergyType.INSECT, label: 'Insect' },
  { value: AllergyType.LATEX, label: 'Latex' },
  { value: AllergyType.OTHER, label: 'Other' },
]

const allergySeverityOptions = [
  { value: AllergySeverity.MILD, label: 'Mild' },
  { value: AllergySeverity.MODERATE, label: 'Moderate' },
  { value: AllergySeverity.SEVERE, label: 'Severe' },
  { value: AllergySeverity.LIFE_THREATENING, label: 'Life-threatening' },
]

export function AllergyForm({ isOpen, form, isValid, onFormChange, onClose, onSave }: AllergyFormProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} isValid={isValid}>
      <div className="flex flex-col gap-6">
        <FormInput
          label="Allergen"
          placeholder="e.g., Peanuts"
          value={form.allergen}
          onChange={(value) => onFormChange({ ...form, allergen: value })}
        />
        <FormSelect
          label="Type"
          placeholder="Select type"
          value={form.type}
          onChange={(value) => onFormChange({ ...form, type: value })}
          options={allergyTypeOptions}
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
          label="Reaction"
          optional
          placeholder="e.g., Hives, difficulty breathing"
          value={form.reaction}
          onChange={(value) => onFormChange({ ...form, reaction: value })}
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
