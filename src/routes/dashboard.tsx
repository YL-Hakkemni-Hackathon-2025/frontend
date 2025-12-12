import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { UserFullSummaryDto } from '@/dtos/user.dto'
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
  const navigate = useNavigate()
  const authData = useAtomValue(userAtom)
  const setAuthData = useSetAtom(userAtom)

  // Function to refresh user data
  const refreshUserData = async () => {
    if (!authData?.accessToken) return

    try {
      const response = await fetch('/api/v1/users/summary', {
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
    fileInputRef,
    handleCloseBottomSheet,
    handleFileChange,
    handleRemoveFile,
    handleSave,
  } = useDashboardForms(authData?.accessToken, refreshUserData)

  // Fetch user summary on mount
  useEffect(() => {
    const fetchUserSummary = async () => {
      if (!authData?.accessToken) {
        navigate({ to: '/onboarding' })
        return
      }

      try {
        const response = await fetch('/api/v1/users/summary', {
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
        }
      } catch (error) {
        console.error('Error fetching user summary:', error)
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

  const hasHealthData = user ? (
    (user.medicalConditions?.length ?? 0) > 0 ||
    (user.medications?.length ?? 0) > 0 ||
    (user.allergies?.length ?? 0) > 0 ||
    (user.lifestyles?.length ?? 0) > 0 ||
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
          <HealthDataSections user={user} searchQuery={searchQuery} />
        </>
      )}

      {!hasHealthData && <EmptyState />}

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
        onFormChange={setMedicalConditionForm}
        onClose={handleCloseBottomSheet}
        onSave={handleSave}
      />

      <MedicationForm
        isOpen={activeForm === 'medication'}
        form={medicationForm}
        isValid={isMedicationValid}
        onFormChange={setMedicationForm}
        onClose={handleCloseBottomSheet}
        onSave={handleSave}
      />

      <AllergyForm
        isOpen={activeForm === 'allergy'}
        form={allergyForm}
        isValid={isAllergyValid}
        onFormChange={setAllergyForm}
        onClose={handleCloseBottomSheet}
        onSave={handleSave}
      />

      <LifestyleForm
        isOpen={activeForm === 'lifestyle'}
        form={lifestyleForm}
        isValid={isLifestyleValid}
        onFormChange={setLifestyleForm}
        onClose={handleCloseBottomSheet}
        onSave={handleSave}
      />

      <DocumentForm
        isOpen={activeForm === 'document'}
        form={documentForm}
        isValid={isDocumentValid}
        isUploading={isUploading}
        uploadError={uploadError}
        pdfPreviewUrl={pdfPreviewUrl}
        fileInputRef={fileInputRef}
        onFormChange={setDocumentForm}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
        onClose={handleCloseBottomSheet}
        onSave={handleSave}
      />
    </div>
  )
}
