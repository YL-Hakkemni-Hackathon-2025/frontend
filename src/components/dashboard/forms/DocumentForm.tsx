import { BottomSheet } from '@/components/BottomSheet'
import { FormInput } from '@/components/FormInput'
import { FormTextArea } from '@/components/FormTextArea'
import { FormSelect } from '@/components/FormSelect'
import { DocumentType } from '@/utils/global.types'
import closeIcon from '@/assets/close.svg'

interface DocumentFormProps {
  isOpen: boolean
  form: { documentId: string; documentName: string; documentType: string; documentDate: string; notes: string; file: File | null }
  isValid: boolean
  isUploading: boolean
  uploadError: string | null
  pdfPreviewUrl: string | null
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onFormChange: (form: { documentId: string; documentName: string; documentType: string; documentDate: string; notes: string; file: File | null }) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveFile: (e: React.MouseEvent) => void
  onClose: () => void
  onSave: () => void
}

const documentTypeOptions = [
  { value: DocumentType.LAB_REPORT, label: 'Lab Report' },
  { value: DocumentType.MRI_SCAN, label: 'MRI Scan' },
  { value: DocumentType.CT_SCAN, label: 'CT Scan' },
  { value: DocumentType.X_RAY, label: 'X-Ray' },
  { value: DocumentType.PRESCRIPTION, label: 'Prescription' },
  { value: DocumentType.MEDICAL_REPORT, label: 'Medical Report' },
  { value: DocumentType.VACCINATION_RECORD, label: 'Vaccination Record' },
  { value: DocumentType.OTHER, label: 'Other' },
]

export function DocumentForm({
  isOpen,
  form,
  isValid,
  isUploading,
  uploadError,
  pdfPreviewUrl,
  fileInputRef,
  onFormChange,
  onFileChange,
  onRemoveFile,
  onClose,
  onSave,
}: DocumentFormProps) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} onSave={onSave} isValid={isValid && !isUploading}>
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
            disabled={isUploading}
          />
          <label
            htmlFor="pdf-upload"
            className={`flex items-center justify-center ${isUploading ? 'cursor-wait' : 'cursor-pointer'}`}
            style={{
              height: '175px',
              width: '100%',
              backgroundColor: '#F0F0F0',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <p
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#5C5C5C',
                  }}
                >
                  Processing document...
                </p>
              </div>
            ) : !form.file ? (
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
            ) : (
              <div className="flex flex-col items-center gap-3">
                <svg
                  className="w-12 h-12 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zm-3 9h4v2h-4v-2zm0 3h4v2h-4v-2zm-2-3h1v5H8v-5z"/>
                </svg>
                <p
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#1C1C1C',
                    textAlign: 'center',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                  }}
                >
                  {form.file.name}
                </p>
                <p
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#5C5C5C',
                  }}
                >
                  {(form.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}
          </label>
          {form.file && !isUploading && (
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

        {/* Upload error message */}
        {uploadError && (
          <p className="text-red-500 text-sm text-center">{uploadError}</p>
        )}

        {/* Document name and Date in row */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Document name"
            placeholder="e.g., CBC Report"
            value={form.documentName}
            onChange={(value) => onFormChange({ ...form, documentName: value })}
            disabled={isUploading}
          />
          <FormInput
            label="Date"
            type="date"
            value={form.documentDate}
            onChange={(value) => onFormChange({ ...form, documentDate: value })}
            disabled={isUploading}
          />
        </div>

        {/* Document type */}
        <FormSelect
          label="Document type"
          placeholder="Select type"
          value={form.documentType}
          onChange={(value) => onFormChange({ ...form, documentType: value })}
          options={documentTypeOptions}
          disabled={isUploading}
        />

        {/* Notes */}
        <FormTextArea
          label="Notes"
          optional
          placeholder="Additional context for this document"
          value={form.notes}
          onChange={(value) => onFormChange({ ...form, notes: value })}
          disabled={isUploading}
        />
      </div>
    </BottomSheet>
  )
}
