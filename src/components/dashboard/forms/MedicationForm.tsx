import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'
import { FormSelect } from '@/components/FormSelect'
import { MedicationFrequency } from '@/utils/global.types'

interface MedicationFormProps {
  isOpen: boolean
  form: { medicationName: string; dosageAmount: string; dosageUnit: string; frequency: string; startDate: string; endDate: string; notes: string }
  isValid: boolean
  isSaving?: boolean
  isDeleting?: boolean
  isEditMode?: boolean
  onFormChange: (form: { medicationName: string; dosageAmount: string; dosageUnit: string; frequency: string; startDate: string; endDate: string; notes: string }) => void
  onClose: () => void
  onSave: () => void
  onDelete?: () => void
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

const dosageUnitOptions = [
  { value: 'mg', label: 'mg' },
  { value: 'g', label: 'g' },
  { value: 'mcg', label: 'mcg' },
  { value: 'ml', label: 'ml' },
  { value: 'units', label: 'units' },
  { value: 'IU', label: 'IU' },
  { value: '%', label: '%' },
]

export function MedicationForm({ isOpen, form, isValid, isSaving, isDeleting, isEditMode, onFormChange, onClose, onSave, onDelete }: MedicationFormProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} onDelete={onDelete} isValid={isValid} isSaving={isSaving} isDeleting={isDeleting} isEditMode={isEditMode}>
      <div className="flex flex-col gap-6">
        <FormInput
          label="Medication name"
          placeholder="e.g., Paracetamol"
          value={form.medicationName}
          onChange={(value) => onFormChange({ ...form, medicationName: value })}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormInput
            label="Dosage"
            placeholder="e.g., 500"
            type="text"
            inputMode="decimal"
            value={form.dosageAmount}
            onChange={(value) => onFormChange({ ...form, dosageAmount: value })}
          />
          <FormSelect
            label="Unit"
            placeholder="Unit"
            value={form.dosageUnit}
            onChange={(value) => onFormChange({ ...form, dosageUnit: value })}
            options={dosageUnitOptions}
          />
          <FormSelect
            label="Frequency"
            placeholder="Frequency"
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
