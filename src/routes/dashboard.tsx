import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
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
  const navigate = useNavigate()

  const {
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
    fileInputRef,
    handleCloseBottomSheet,
    handleFileChange,
    handleRemoveFile,
    handleSave,
  } = useDashboardForms()

  const handleLogout = () => {
    // TODO: Clear auth token
    navigate({ to: '/onboarding' })
  }

  // TODO: Replace with actual user data from API/state
  const user: UserFullSummaryDto = {
    id: '1',
    firstName: 'Melissa',
    lastName: 'Doe',
    fullName: 'Melissa Doe',
    governmentId: '123456789',
    dateOfBirth: new Date('1990-01-01'),
    birthPlace: 'Beirut',
    medicalConditions: [
      {
        id: '1',
        userId: '1',
        name: 'Eczema',
        diagnosedDate: new Date('2018-04-12'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: '1',
        name: 'Migraine',
        diagnosedDate: new Date('2018-04-12'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    medications: [
      {
        id: '1',
        userId: '1',
        medicationName: 'Paracetamol (Doliprane)',
        dosageAmount: '500mg',
        frequency: 'AS_NEEDED' as any,
        startDate: new Date('2020-08-05'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    allergies: [
      {
        id: '1',
        userId: '1',
        allergen: 'Peanuts',
        type: 'FOOD' as any,
        diagnosedDate: new Date('2015-03-15'),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    lifestyles: [
      {
        id: '1',
        userId: '1',
        category: 'SMOKING' as any,
        description: 'Non-smoker',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date('2024-01-01'),
      },
    ],
    documents: [
      {
        id: '1',
        userId: '1',
        originalFileName: 'cbc-results.pdf',
        documentName: 'CBC Complete Blood Count',
        documentType: 'LAB_RESULT' as any,
        fileUrl: 'https://example.com/cbc.pdf',
        mimeType: 'application/pdf',
        documentDate: new Date('2025-10-27'),
        notes: 'CBC shows normal white cells and hemoglobin. Slightly low iron markers noted, consistent with mild iron deficiency.',
        isAiProcessed: true,
        isConfirmed: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  }

  const hasHealthData =
    user.medicalConditions.length > 0 ||
    user.medications.length > 0 ||
    user.allergies.length > 0 ||
    user.lifestyles.length > 0 ||
    user.documents.length > 0

  return (
    <div className="min-h-dvh bg-white relative flex flex-col">
      <UserHeader firstName={user.firstName} onMenuClick={() => setIsDrawerOpen(true)} />
      <HealthPassCard hasHealthData={hasHealthData} />

      {hasHealthData && (
        <>
          <SearchBar />
          <HealthDataSections user={user} />
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
