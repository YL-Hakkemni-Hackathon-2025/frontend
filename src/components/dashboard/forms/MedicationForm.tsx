import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'

interface MedicationFormProps {
  isOpen: boolean
  form: { name: string; dosage: string; frequency: string; startDate: string; notes: string }
  isValid: boolean
  onFormChange: (form: { name: string; dosage: string; frequency: string; startDate: string; notes: string }) => void
  onClose: () => void
  onSave: () => void
}

export function MedicationForm({ isOpen, form, isValid, onFormChange, onClose, onSave }: MedicationFormProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} isValid={isValid}>
      <div className="flex flex-col gap-6">
        <FormInput
          label="Medication name"
          placeholder="e.g., Paracetamol"
          value={form.name}
          onChange={(value) => onFormChange({ ...form, name: value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Dosage"
            placeholder="e.g., 500mg"
            value={form.dosage}
            onChange={(value) => onFormChange({ ...form, dosage: value })}
          />
          <FormInput
            label="Frequency"
            placeholder="e.g., Daily"
            value={form.frequency}
            onChange={(value) => onFormChange({ ...form, frequency: value })}
          />
        </div>
        <FormInput
          label="Start date"
          type="date"
          value={form.startDate}
          onChange={(value) => onFormChange({ ...form, startDate: value })}
        />
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
