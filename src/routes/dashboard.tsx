import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import menuIcon from '@/assets/dashboard/menu.svg'
import addIcon from '@/assets/dashboard/add.svg'
import qrCodeIcon from '@/assets/dashboard/qr-code.svg'
import heartIcon from '@/assets/dashboard/heart.svg'
import medicationIcon from '@/assets/dashboard/medication.svg'
import allergyIcon from '@/assets/dashboard/allergy.svg'
import lifestyleIcon from '@/assets/dashboard/lifestyle.svg'
import documentIcon from '@/assets/dashboard/document.svg'
import documentsIcon from '@/assets/dashboard/documents.svg'
import searchIcon from '@/assets/search (1).svg'
import MedicalConditionIcon from '@/assets/MedicalConditionIcon.svg'
import MedicationIcon from '@/assets/MedicationIcon.svg'
import LifeStyleIcon from '@/assets/LifeStyleIcon.svg'
import AllergyIcon from '@/assets/AllergyIcon.svg'
import { UserFullSummaryDto } from '@/dtos/user.dto'
import { MedicalInfoSection } from '@/components/MedicalInfoSection'
import { DocumentSection } from '@/components/DocumentSection'
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

  const handleLogout = () => {
    // TODO: Clear auth token
    navigate({ to: '/onboarding' })
  }

  const fabMenuItems = [
    { label: 'Medical condition', icon: heartIcon, action: () => console.log('Medical condition') },
    { label: 'Medication', icon: medicationIcon, action: () => console.log('Medication') },
    { label: 'Allergy', icon: allergyIcon, action: () => console.log('Allergy') },
    { label: 'Lifestyle', icon: lifestyleIcon, action: () => console.log('Lifestyle') },
    { label: 'Document', icon: documentIcon, action: () => console.log('Document') },
  ]

  return (
    <div className="min-h-[100dvh] bg-white relative flex flex-col">
      {/* Upside down gradient div - takes up 1/3 of screen */}
      <div className="h-[33vh] bg-gradient-to-b from-[#003AAB] to-[#001745] rounded-b-[40px]">
        {/* Top navigation row */}
        <div className="flex items-center justify-between px-4 pt-12">
          {/* Menu button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-12 h-12 bg-[#011A4B] rounded-full flex items-center justify-center shadow-[0_0_30px_0_#385DA41A]"
          >
            <img alt="menu" src={menuIcon} className="w-6 h-6" />
          </button>

          {/* Find a doctor button */}
          <button className="h-12 px-5 bg-[#011A4B] rounded-full flex items-center justify-center shadow-[0_0_30px_0_#385DA41A]">
            <p className="text-white font-black text-sm">Find a doctor</p>
          </button>
        </div>

        {/* Welcome text section */}
        <div className="flex flex-col items-center justify-center mt-8 px-6">
          <h1 className="text-white font-black text-3xl text-center">Welcome {user.firstName}</h1>
          <p className="text-white font-bold text-sm text-center mt-2">
            This is your private medical space. Nothing is shared without your approval.
          </p>
        </div>
      </div>

      {/* HealthPass card - positioned to overlap the gradient div */}
      <div className="px-4 -mt-16">
        <div className="bg-white rounded-xl px-6 py-4 shadow-lg border border-gray-100 flex flex-row items-center justify-between gap-6">
          <img src={qrCodeIcon} alt={"qrCodImage"}/>
          <div className={"flex flex-col"}>
              <h2 className="font-black text-base text-black">HealthPass</h2>
              <p className="font-medium text-base text-black mt-1">
                  {hasHealthData
                    ? 'Create a tailored summary for your next appointment'
                    : 'Prepare a visit summary once you\'ve added medical information'}
              </p>
          </div>
        </div>
      </div>

      {/* Search bar - when there is health data */}
      {hasHealthData && (
        <>
          <div className="px-4 mt-6">
            <div className="w-full h-12 rounded-full flex flex-row items-center px-4 gap-3" style={{ background: '#F1F1F1' }}>
              <img src={searchIcon} alt="search" className="w-6 h-6" />
              <input
                type="text"
                placeholder="Search space"
                className="flex-1 bg-transparent outline-none placeholder:text-[#AEAEAE]"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '121%',
                  letterSpacing: '0%',
                  color: '#000000',
                }}
              />
            </div>
          </div>

          {/* Health data sections */}
          <div className="px-4 pb-24">
            {/* Documents section */}
            {user.documents.length > 0 && (
              <DocumentSection
                title="Documents"
                items={user.documents.map(doc => ({
                  title: doc.documentName,
                  date: doc.documentDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) || '',
                  aiSummary: doc.notes || '',
                }))}
              />
            )}

            {/* Medical conditions section */}
            {user.medicalConditions.length > 0 && (
              <MedicalInfoSection
                title="Medical conditions"
                showToggle={false}
                icon={MedicalConditionIcon}
                items={user.medicalConditions.map(condition => ({
                  title: condition.name,
                  description: condition.diagnosedDate
                    ? `Diagnosed: ${condition.diagnosedDate.toLocaleDateString('en-GB')}`
                    : 'No diagnosis date',
                  isRelevant: true,
                }))}
              />
            )}

            {/* Medications section */}
            {user.medications.length > 0 && (
              <MedicalInfoSection
                title="Medications"
                showToggle={false}
                icon={MedicationIcon}
                items={user.medications.map(medication => ({
                  title: medication.medicationName,
                  description: medication.startDate
                    ? `Prescribed: ${medication.startDate.toLocaleDateString('en-GB')}`
                    : 'No prescription date',
                  isRelevant: true,
                }))}
              />
            )}

            {/* Lifestyle section */}
            {user.lifestyles.length > 0 && (
              <MedicalInfoSection
                title="Lifestyle"
                showToggle={false}
                icon={LifeStyleIcon}
                items={user.lifestyles.map(lifestyle => ({
                  title: lifestyle.description,
                  description: lifestyle.updatedAt
                    ? `Updated: ${lifestyle.updatedAt.toLocaleDateString('en-GB')}`
                    : 'No update date',
                  isRelevant: true,
                }))}
              />
            )}

            {/* Allergies section */}
            {user.allergies.length > 0 && (
              <MedicalInfoSection
                title="Allergies"
                showToggle={false}
                icon={AllergyIcon}
                items={user.allergies.map(allergy => ({
                  title: allergy.allergen,
                  description: allergy.diagnosedDate
                    ? `Diagnosed: ${allergy.diagnosedDate.toLocaleDateString('en-GB')}`
                    : 'No diagnosis date',
                  isRelevant: true,
                }))}
              />
            )}
          </div>
        </>
      )}

      {/* Empty state - when no health data */}
      {!hasHealthData && (
        <div className="flex-1 flex flex-col items-center pt-16 px-6">
          <img src={documentsIcon} alt="documents" className="mb-4" />
          <h2 className="font-bold text-base text-black text-center">
            Start building your Health Space
          </h2>
          <p className="font-normal text-base text-black text-center mt-1">
            Add your medical information here. We'll use it later to prepare Health Passes for your medical visits
          </p>
        </div>
      )}

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl"
            >
              <div className="p-6 pt-12">
                <h2 className="font-black text-2xl text-black mb-8">Menu</h2>
                <nav className="flex flex-col gap-4">
                  <button className="text-left font-medium text-lg text-black py-2">
                    HealthPasses
                  </button>
                  <button className="text-left font-medium text-lg text-black py-2">
                    My Profile
                  </button>
                  <button className="text-left font-medium text-lg text-black py-2">
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-left font-medium text-lg text-red-500 py-2"
                  >
                    Log out
                  </button>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FAB Backdrop */}
      <AnimatePresence>
        {isFabMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsFabMenuOpen(false)}
            className="fixed inset-0 z-40 backdrop-blur-[30px]"
            style={{
              background: 'radial-gradient(circle, rgba(185,185,185,0.7) 0%, rgba(0,0,0,0.8) 100%)'
            }}
          />
        )}
      </AnimatePresence>

      {/* FAB Menu Items */}
      <AnimatePresence>
        {isFabMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-4 z-50 flex flex-col gap-3"
          >
            {fabMenuItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  item.action()
                  setIsFabMenuOpen(false)
                }}
                className="bg-white rounded-3xl px-5 py-3 shadow-lg flex items-center gap-3"
              >
                <img src={item.icon} alt={item.label} className="w-5 h-5" />
                <p className="font-bold text-black text-sm">{item.label}</p>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button
        onClick={() => !isDrawerOpen && setIsFabMenuOpen(!isFabMenuOpen)}
        disabled={isDrawerOpen}
        className={`fixed bottom-6 right-4 w-14 h-14 bg-white rounded-full flex items-center justify-center z-50 transition-all duration-200 ${
          isFabMenuOpen ? 'shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]' : 'shadow-lg'
        } ${isDrawerOpen ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <img
          alt="add"
          src={addIcon}
          className={`w-6 h-6 transition-transform duration-200 ${isFabMenuOpen ? 'rotate-45' : ''}`}
        />
      </button>
    </div>
  )
}

