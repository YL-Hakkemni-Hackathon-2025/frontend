import { useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { apiUrl } from '@/utils/api'

export type FormType = 'medical-condition' | 'medication' | 'allergy' | 'lifestyle' | 'document' | null

export function useDashboardForms(accessToken?: string, onSuccess?: () => void) {
  const [activeForm, setActiveForm] = useState<FormType>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Medical Condition form
  const [medicalConditionForm, setMedicalConditionForm] = useState({ name: '', diagnosedDate: '', notes: '' })
  const isMedicalConditionValid = medicalConditionForm.name.trim() !== ''

  // Medication form
  const [medicationForm, setMedicationForm] = useState({ medicationName: '', dosageAmount: '', frequency: '', startDate: '', endDate: '', notes: '' })
  const isMedicationValid = medicationForm.medicationName.trim() !== ''

  // Allergy form
  const [allergyForm, setAllergyForm] = useState({ allergen: '', type: '', severity: '', reaction: '', diagnosedDate: '', notes: '' })
  const isAllergyValid = allergyForm.allergen.trim() !== '' && allergyForm.type.trim() !== ''

  // Lifestyle form
  const [lifestyleForm, setLifestyleForm] = useState({ category: '', description: '', frequency: '', startDate: '', notes: '' })
  const isLifestyleValid = lifestyleForm.category.trim() !== '' && lifestyleForm.description.trim() !== ''

  // Document form
  const [documentForm, setDocumentForm] = useState({
    documentId: '',
    documentName: '',
    documentType: '',
    documentDate: '',
    notes: '',
    file: null as File | null
  })
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isDocumentValid = documentForm.documentName.trim() !== '' && documentForm.documentId !== ''

  const handleCloseBottomSheet = () => {
    setActiveForm(null)
    setMedicalConditionForm({ name: '', diagnosedDate: '', notes: '' })
    setMedicationForm({ medicationName: '', dosageAmount: '', frequency: '', startDate: '', endDate: '', notes: '' })
    setAllergyForm({ allergen: '', type: '', severity: '', reaction: '', diagnosedDate: '', notes: '' })
    setLifestyleForm({ category: '', description: '', frequency: '', startDate: '', notes: '' })
    setDocumentForm({ documentId: '', documentName: '', documentType: '', documentDate: '', notes: '', file: null })
    setPdfPreviewUrl(null)
    setUploadError(null)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || (file.type !== 'application/pdf' && file.type !== 'image/png')) return
    if (!accessToken) {
      setUploadError('No access token available')
      return
    }

    // Set file immediately (preview will be set after upload)
    setDocumentForm(prev => ({ ...prev, file }))
    setPdfPreviewUrl(null) // Clear any previous preview

    // Start upload
    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(apiUrl('/api/v1/documents/upload'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        const data = result.data

        // Check if document is healthcare related
        if (data.isHealthcareRelated === false || data.rejectionReason) {
          const errorMessage = data.rejectionReason || 'This document does not appear to be healthcare-related.'
          setUploadError(errorMessage)
          toast.error(errorMessage)
          // Reset file on rejection
          setPdfPreviewUrl(null)
          setDocumentForm(prev => ({ ...prev, file: null }))
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          return
        }

        // Populate form with AI suggestions
        const suggestions = data.aiSuggestions || {}

        // Use the fileUrl from API response for preview
        if (data.fileUrl) {
          setPdfPreviewUrl(data.fileUrl)
        }

        setDocumentForm(prev => ({
          ...prev,
          documentId: data.id,
          documentName: suggestions.suggestedName || '',
          documentType: suggestions.suggestedType || '',
          documentDate: suggestions.suggestedDate ? suggestions.suggestedDate.split('T')[0] : '',
          notes: suggestions.suggestedNotes || '',
        }))
      } else {
        setUploadError(result.message || 'Failed to process document. Please try again.')
        toast.error(result.message || 'Failed to process document. Please try again.')
        // Reset file on error
        setPdfPreviewUrl(null)
        setDocumentForm(prev => ({ ...prev, file: null }))
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error)
      setUploadError('An error occurred while uploading. Please try again.')
      toast.error('Failed to upload document. Please try again.')
      // Reset file on error
      setPdfPreviewUrl(null)
      setDocumentForm(prev => ({ ...prev, file: null }))
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl)
    }
    setDocumentForm({ documentId: '', documentName: '', documentType: '', documentDate: '', notes: '', file: null })
    setPdfPreviewUrl(null)
    setUploadError(null)
    // Reset file input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!accessToken) {
      console.error('No access token available')
      return
    }

    setIsSaving(true)

    try {
      let endpoint = ''
      let body: Record<string, unknown> = {}

      switch (activeForm) {
        case 'medical-condition':
          endpoint = '/api/v1/medical-conditions'
          body = {
            name: medicalConditionForm.name,
            diagnosedDate: medicalConditionForm.diagnosedDate || undefined,
            notes: medicalConditionForm.notes || undefined,
          }
          break

        case 'medication':
          endpoint = '/api/v1/medications'
          body = {
            medicationName: medicationForm.medicationName,
            dosageAmount: medicationForm.dosageAmount || undefined,
            frequency: medicationForm.frequency || undefined,
            startDate: medicationForm.startDate || undefined,
            endDate: medicationForm.endDate || undefined,
            notes: medicationForm.notes || undefined,
          }
          break

        case 'allergy':
          endpoint = '/api/v1/allergies'
          body = {
            allergen: allergyForm.allergen,
            type: allergyForm.type,
            severity: allergyForm.severity || undefined,
            reaction: allergyForm.reaction || undefined,
            diagnosedDate: allergyForm.diagnosedDate || undefined,
            notes: allergyForm.notes || undefined,
          }
          break

        case 'lifestyle':
          endpoint = '/api/v1/lifestyles'
          body = {
            category: lifestyleForm.category,
            description: lifestyleForm.description,
            frequency: lifestyleForm.frequency || undefined,
            startDate: lifestyleForm.startDate || undefined,
            notes: lifestyleForm.notes || undefined,
          }
          break

        case 'document': {
          // Confirm the uploaded document
          if (!documentForm.documentId) {
            toast.error('Please upload a document first.')
            setIsSaving(false)
            return
          }

          const confirmBody = {
            documentName: documentForm.documentName,
            documentType: documentForm.documentType || 'other',
            documentDate: documentForm.documentDate || undefined,
            notes: documentForm.notes || undefined,
          }

          // Remove undefined values
          const cleanConfirmBody = Object.fromEntries(
            Object.entries(confirmBody).filter(([_, v]) => v !== undefined && v !== '')
          )

          const confirmResponse = await fetch(apiUrl(`/api/v1/documents/${documentForm.documentId}/confirm`), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(cleanConfirmBody),
          })

          const confirmResult = await confirmResponse.json()

          if (confirmResponse.ok && confirmResult.success) {
            console.log('Successfully confirmed document:', confirmResult.data)
            toast.success('Document saved successfully!')
            handleCloseBottomSheet()
            onSuccess?.()
          } else {
            console.error('Failed to confirm document:', confirmResult)
            toast.error(confirmResult.message || 'Failed to save document. Please try again.')
          }
          setIsSaving(false)
          return
        }

        default:
          return
      }

      // Remove undefined values from body
      const cleanBody = Object.fromEntries(
        Object.entries(body).filter(([_, v]) => v !== undefined && v !== '')
      )

      const response = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(cleanBody),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log('Successfully created:', activeForm, result.data)
        toast.success('Saved successfully!')
        handleCloseBottomSheet()
        onSuccess?.()
      } else {
        console.error('Failed to create:', result)
        toast.error(result.message || 'Failed to save. Please try again.')
      }
    } catch (error) {
      console.error('Error saving:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    activeForm,
    setActiveForm,
    isSaving,
    isUploading,
    uploadError,
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
