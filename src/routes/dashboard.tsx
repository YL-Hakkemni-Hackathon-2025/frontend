import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import toast from 'react-hot-toast'
import { UserFullSummaryDto } from '@/dtos/user.dto'
import { HabitDto } from '@/dtos/lifestyle.dto'
import { UserHeader } from '@/components/dashboard/UserHeader'
import { HealthPassCard } from '@/components/dashboard/HealthPassCard'
import { SearchBar } from '@/components/dashboard/SearchBar'
import { SideDrawer } from '@/components/dashboard/SideDrawer'
import { FloatingActionButton } from '@/components/dashboard/FloatingActionButton'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { HealthDataSections } from '@/components/dashboard/HealthDataSections'
import { MedicalConditionForm } from '@/components/dashboard/forms/MedicalConditionForm'
import { MedicationForm } from '@/components/dashboard/forms/MedicationForm'
import { AllergyForm } from '@/components/dashboard/forms/AllergyForm'
import { LifestyleForm } from '@/components/dashboard/forms/LifestyleForm'
import { DocumentForm } from '@/components/dashboard/forms/DocumentForm'
import { useDashboardForms } from '@/hooks/useDashboardForms'
import { userAtom } from '@/atoms/user.atom'
import { apiUrl } from '@/utils/api'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({ to: '/onboarding' })
    }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false)
  const [user, setUser] = useState<UserFullSummaryDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLifestyleSaving, setIsLifestyleSaving] = useState(false)
  const navigate = useNavigate()
  const authData = useAtomValue(userAtom)
  const setAuthData = useSetAtom(userAtom)

  // Function to refresh user data
  const refreshUserData = async () => {
    if (!authData?.accessToken) return

    try {
      const response = await fetch(apiUrl('/api/v1/users/summary'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authData.accessToken}`,
        },
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setUser(result.data)
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  const {
    activeForm,
    setActiveForm,
    isSaving,
    isDeleting,
    editingItemId,
    setEditingItemId,
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
    documentForm,
    setDocumentForm,
    isDocumentValid,
    pdfPreviewUrl,
    fileInputRef,
    handleCloseBottomSheet,
    handleFileChange,
    handleRemoveFile,
    handleSave,
    handleDelete,
  } = useDashboardForms(authData?.accessToken, refreshUserData)

  // Disable scroll when any form, drawer, or FAB menu is open
  useEffect(() => {
    if (activeForm || isDrawerOpen || isFabMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeForm, isDrawerOpen, isFabMenuOpen])

  // Fetch user summary on mount
  useEffect(() => {
    const fetchUserSummary = async () => {
      if (!authData?.accessToken) {
        navigate({ to: '/onboarding' })
        return
      }

      try {
        const response = await fetch(apiUrl('/api/v1/users/summary'), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authData.accessToken}`,
          },
        })

        const result = await response.json()

        if (response.ok && result.success) {
          setUser(result.data)
        } else {
          console.error('Failed to fetch user summary:', result)
          toast.error('Failed to load your health data')
        }
      } catch (error) {
        console.error('Error fetching user summary:', error)
        toast.error('Failed to load your health data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserSummary()
  }, [authData, navigate])

  const handleLogout = () => {
    setAuthData(undefined)
    navigate({ to: '/onboarding' })
  }

  // Click handlers for editing items
  const handleMedicalConditionClick = (id: string) => {
    const condition = user?.medicalConditions.find(c => c.id === id)
    if (condition) {
      setMedicalConditionForm({
        name: condition.name,
        diagnosedDate: condition.diagnosedDate ? new Date(condition.diagnosedDate).toISOString().split('T')[0] : '',
        notes: condition.notes || '',
      })
      setEditingItemId(id)
      setActiveForm('medical-condition')
    }
  }

  const handleMedicationClick = (id: string) => {
    const medication = user?.medications.find(m => m.id === id)
    if (medication) {
      // Parse dosageAmount to separate number and unit
      const dosageStr = medication.dosageAmount || ''
      const match = dosageStr.match(/^(\d+\.?\d*)\s*(.*)$/)
      const dosageAmount = match ? match[1] : dosageStr
      const dosageUnit = match ? match[2] : ''

      setMedicationForm({
        medicationName: medication.medicationName,
        dosageAmount,
        dosageUnit,
        frequency: medication.frequency || '',
        startDate: medication.startDate ? new Date(medication.startDate).toISOString().split('T')[0] : '',
        endDate: medication.endDate ? new Date(medication.endDate).toISOString().split('T')[0] : '',
        notes: medication.notes || '',
      })
      setEditingItemId(id)
      setActiveForm('medication')
    }
  }

  const handleAllergyClick = (id: string) => {
    const allergy = user?.allergies.find(a => a.id === id)
    if (allergy) {
      setAllergyForm({
        allergen: allergy.allergen,
        severity: allergy.severity || '',
        diagnosedDate: allergy.diagnosedDate ? new Date(allergy.diagnosedDate).toISOString().split('T')[0] : '',
        notes: allergy.notes || '',
      })
      setEditingItemId(id)
      setActiveForm('allergy')
    }
  }

  const handleLifestyleClick = () => {
    // Open the lifestyle form - it will be pre-populated with existing habits
    setActiveForm('lifestyle')
  }

  const handleLifestyleSave = async (habits: HabitDto[]) => {
    if (!authData?.accessToken) return

    setIsLifestyleSaving(true)
    try {
      const response = await fetch(apiUrl('/api/v1/lifestyles'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authData.accessToken}`,
        },
        body: JSON.stringify({ habits }),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Lifestyle updated successfully!')
        setActiveForm(null)
        refreshUserData()
      } else {
        console.error('Failed to save lifestyle:', result)
        toast.error(result.message || 'Failed to save lifestyle')
      }
    } catch (error) {
      console.error('Error saving lifestyle:', error)
      toast.error('Failed to save lifestyle')
    } finally {
      setIsLifestyleSaving(false)
    }
  }

  const handleLifestyleClose = () => {
    setActiveForm(null)
  }

  const handleDocumentClick = (id: string) => {
    // Document editing will be handled differently since it requires the file
    // For now, we can just show a message or implement read-only view
    console.log('Document click:', id)
  }

  const hasHealthData = user ? (
    (user.medicalConditions?.length ?? 0) > 0 ||
    (user.medications?.length ?? 0) > 0 ||
    (user.allergies?.length ?? 0) > 0 ||
    (user.lifestyle?.habits?.filter(h => h.frequency !== 'not_set')?.length ?? 0) > 0 ||
    (user.documents?.length ?? 0) > 0
  ) : false

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500">Loading your health data...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-dvh bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-500">Failed to load user data</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-white relative flex flex-col">
      <UserHeader firstName={user.firstName} onMenuClick={() => setIsDrawerOpen(true)} />
      <HealthPassCard hasHealthData={hasHealthData} />

      {hasHealthData && (
        <>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <HealthDataSections
            user={user}
            searchQuery={searchQuery}
            onMedicalConditionClick={handleMedicalConditionClick}
            onMedicationClick={handleMedicationClick}
            onAllergyClick={handleAllergyClick}
            onLifestyleClick={handleLifestyleClick}
            onDocumentClick={handleDocumentClick}
          />
        </>
      )}

      {!hasHealthData && (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState />
        </div>
      )}

      <SideDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} onLogout={handleLogout} />

      <FloatingActionButton
        isMenuOpen={isFabMenuOpen}
        isDrawerOpen={isDrawerOpen}
        onToggleMenu={() => setIsFabMenuOpen(!isFabMenuOpen)}
        onSelectForm={(formType) => setActiveForm(formType)}
      />

      <MedicalConditionForm
        isOpen={activeForm === 'medical-condition'}
        form={medicalConditionForm}
        isValid={isMedicalConditionValid}
        isSaving={isSaving}
        isDeleting={isDeleting}
        isEditMode={!!editingItemId}
        onFormChange={setMedicalConditionForm}
        onClose={handleCloseBottomSheet}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <MedicationForm
        isOpen={activeForm === 'medication'}
        form={medicationForm}
        isValid={isMedicationValid}
        isSaving={isSaving}
        isDeleting={isDeleting}
        isEditMode={!!editingItemId}
        onFormChange={setMedicationForm}
        onClose={handleCloseBottomSheet}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <AllergyForm
        isOpen={activeForm === 'allergy'}
        form={allergyForm}
        isValid={isAllergyValid}
        isSaving={isSaving}
        isDeleting={isDeleting}
        isEditMode={!!editingItemId}
        onFormChange={setAllergyForm}
        onClose={handleCloseBottomSheet}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <LifestyleForm
        isOpen={activeForm === 'lifestyle'}
        initialHabits={user?.lifestyle?.habits}
        isSaving={isLifestyleSaving}
        onSave={handleLifestyleSave}
        onClose={handleLifestyleClose}
      />

      <DocumentForm
        isOpen={activeForm === 'document'}
        form={documentForm}
        isValid={isDocumentValid}
        isSaving={isSaving}
        isDeleting={isDeleting}
        isEditMode={!!editingItemId}
        isUploading={isUploading}
        uploadError={uploadError}
        pdfPreviewUrl={pdfPreviewUrl}
        fileInputRef={fileInputRef}
        onFormChange={setDocumentForm}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
        onClose={handleCloseBottomSheet}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}
