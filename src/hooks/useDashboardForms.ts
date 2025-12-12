import { useState, useRef } from 'react'

export type FormType = 'medical-condition' | 'medication' | 'allergy' | 'lifestyle' | 'document' | null

export function useDashboardForms() {
  const [activeForm, setActiveForm] = useState<FormType>(null)

  // Medical Condition form
  const [medicalConditionForm, setMedicalConditionForm] = useState({ name: '', diagnosedDate: '', notes: '' })
  const isMedicalConditionValid = medicalConditionForm.name.trim() !== ''

  // Medication form
  const [medicationForm, setMedicationForm] = useState({ name: '', dosage: '', frequency: '', startDate: '', notes: '' })
  const isMedicationValid = medicationForm.name.trim() !== ''

  // Allergy form
  const [allergyForm, setAllergyForm] = useState({ allergen: '', type: '', severity: '', reaction: '', diagnosedDate: '', notes: '' })
  const isAllergyValid = allergyForm.allergen.trim() !== '' && allergyForm.type.trim() !== ''

  // Lifestyle form
  const [lifestyleForm, setLifestyleForm] = useState({ category: '', description: '', frequency: '', startDate: '', notes: '' })
  const isLifestyleValid = lifestyleForm.category.trim() !== '' && lifestyleForm.description.trim() !== ''

  // Document form
  const [documentForm, setDocumentForm] = useState({ documentName: '', documentDate: '', notes: '', file: null as File | null })
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isDocumentValid = documentForm.documentName.trim() !== '' && documentForm.file !== null

  const handleCloseBottomSheet = () => {
    setActiveForm(null)
    setMedicalConditionForm({ name: '', diagnosedDate: '', notes: '' })
    setMedicationForm({ name: '', dosage: '', frequency: '', startDate: '', notes: '' })
    setAllergyForm({ allergen: '', type: '', severity: '', reaction: '', diagnosedDate: '', notes: '' })
    setLifestyleForm({ category: '', description: '', frequency: '', startDate: '', notes: '' })
    setDocumentForm({ documentName: '', documentDate: '', notes: '', file: null })
    setPdfPreviewUrl(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      setDocumentForm({ ...documentForm, file })

      // Create preview URL for PDF
      const fileUrl = URL.createObjectURL(file)
      setPdfPreviewUrl(fileUrl)
    }
  }

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl)
    }
    setDocumentForm({ ...documentForm, file: null })
    setPdfPreviewUrl(null)
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = () => {
    // TODO: Handle save logic based on activeForm type
    console.log('Saving form:', activeForm)
    handleCloseBottomSheet()
  }

  return {
    activeForm,
    setActiveForm,
    medicalConditionForm,
    setMedicalConditionForm,
    isMedicalConditionValid,
    medicationForm,
    setMedicationForm,
    isMedicationValid,
    allergyForm,
    setAllergyForm,
    isAllergyValid,
    lifestyleForm,
    setLifestyleForm,
    isLifestyleValid,
    documentForm,
    setDocumentForm,
    isDocumentValid,
    pdfPreviewUrl,
    setPdfPreviewUrl,
    fileInputRef,
    handleCloseBottomSheet,
    handleFileChange,
    handleRemoveFile,
    handleSave,
  }
}
