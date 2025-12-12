import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'
import closeIcon from '@/assets/close.svg'

interface DocumentFormProps {
  isOpen: boolean
  form: { documentName: string; documentDate: string; notes: string; file: File | null }
  isValid: boolean
  pdfPreviewUrl: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onFormChange: (form: { documentName: string; documentDate: string; notes: string; file: File | null }) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: (e: React.MouseEvent) => void
  onClose: () => void
  onSave: () => void
}

export function DocumentForm({
  isOpen,
  form,
  isValid,
  pdfPreviewUrl,
  fileInputRef,
  onFormChange,
  onFileChange,
  onRemoveFile,
  onClose,
  onSave,
}: DocumentFormProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} isValid={isValid}>
      <div className="flex flex-col gap-6">
        {/* File picker box */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            id="pdf-upload"
            accept=".pdf"
            onChange={onFileChange}
            className="hidden"
          />
          <label
            htmlFor="pdf-upload"
            className="flex items-center justify-center cursor-pointer"
            style={{
              height: '175px',
              width: '100%',
              backgroundColor: '#F0F0F0',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {!form.file ? (
              <p
                style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#5C5C5C',
                }}
              >
                Tap to pick
              </p>
            ) : pdfPreviewUrl ? (
              <iframe
                src={`${pdfPreviewUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                className="pointer-events-none"
                style={{
                  border: 'none',
                  width: '100%',
                  height: '250px',
                  transform: 'scale(0.7)',
                  transformOrigin: 'center center',
                }}
              />
            ) : null}
          </label>
          {form.file && (
            <button
              onClick={onRemoveFile}
              className="absolute top-3 right-3 flex items-center justify-center z-10"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#1C1C1C',
                borderRadius: '50%',
              }}
            >
              <img src={closeIcon} alt="Remove" className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Document name and Date in row */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Document name"
            placeholder="e.g., CBC Report"
            value={form.documentName}
            onChange={(value) => onFormChange({ ...form, documentName: value })}
          />
          <FormInput
            label="Date"
            type="date"
            value={form.documentDate}
            onChange={(value) => onFormChange({ ...form, documentDate: value })}
          />
        </div>

        {/* Notes */}
        <FormTextArea
          label="Notes"
          optional
          placeholder="Additional context for this document"
          value={form.notes}
          onChange={(value) => onFormChange({ ...form, notes: value })}
        />
      </div>
    </BottomSheet>
  )
}
