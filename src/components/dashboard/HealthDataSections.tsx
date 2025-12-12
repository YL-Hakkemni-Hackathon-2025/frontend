import { UserFullSummaryDto } from '@/dtos/user.dto'
import { MedicalInfoSection } from '@/components/MedicalInfoSection'
import { DocumentSection } from '@/components/DocumentSection'
import MedicalConditionIcon from '@/assets/MedicalConditionIcon.svg'
import MedicationIcon from '@/assets/MedicationIcon.svg'
import LifeStyleIcon from '@/assets/LifeStyleIcon.svg'
import AllergyIcon from '@/assets/AllergyIcon.svg'

interface HealthDataSectionsProps {
  user: UserFullSummaryDto
  searchQuery?: string
}

// Helper function to format dates that may be strings or Date objects
function formatDate(date: Date | string | undefined | null, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-GB', options || { day: 'numeric', month: 'long', year: 'numeric' })
}

// Helper function to check if a string matches the search query
function matchesSearch(text: string | undefined | null, query: string): boolean {
  if (!query) return true
  if (!text) return false
  return text.toLowerCase().includes(query.toLowerCase())
}

export function HealthDataSections({ user, searchQuery = '' }: HealthDataSectionsProps) {
  // Filter documents
  const filteredDocuments = user.documents.filter((doc) =>
    matchesSearch(doc.documentName, searchQuery) ||
    matchesSearch(doc.notes, searchQuery) ||
    matchesSearch(doc.documentType, searchQuery)
  )

  // Filter medical conditions
  const filteredMedicalConditions = user.medicalConditions.filter((condition) =>
    matchesSearch(condition.name, searchQuery) ||
    matchesSearch(condition.notes, searchQuery)
  )

  // Filter medications
  const filteredMedications = user.medications.filter((medication) =>
    matchesSearch(medication.medicationName, searchQuery) ||
    matchesSearch(medication.notes, searchQuery) ||
    matchesSearch(medication.dosageAmount, searchQuery)
  )

  // Filter lifestyles
  const filteredLifestyles = user.lifestyles.filter((lifestyle) =>
    matchesSearch(lifestyle.description, searchQuery) ||
    matchesSearch(lifestyle.category, searchQuery) ||
    matchesSearch(lifestyle.notes, searchQuery)
  )

  // Filter allergies
  const filteredAllergies = user.allergies.filter((allergy) =>
    matchesSearch(allergy.allergen, searchQuery) ||
    matchesSearch(allergy.type, searchQuery) ||
    matchesSearch(allergy.reaction, searchQuery) ||
    matchesSearch(allergy.notes, searchQuery)
  )

  const hasResults = filteredDocuments.length > 0 ||
    filteredMedicalConditions.length > 0 ||
    filteredMedications.length > 0 ||
    filteredLifestyles.length > 0 ||
    filteredAllergies.length > 0

  if (searchQuery && !hasResults) {
    return (
      <div className="px-4 pb-24 flex flex-col items-center justify-center py-12">
        <p className="text-gray-500 text-center">No results found for "{searchQuery}"</p>
      </div>
    )
  }

  return (
    <div className="px-4 pb-24">
      {/* Documents section */}
      {filteredDocuments.length > 0 && (
        <DocumentSection
          title="Documents"
          items={filteredDocuments.map((doc) => ({
            title: doc.documentName,
            date: formatDate(doc.documentDate),
            aiSummary: doc.notes || '',
            fileUrl: doc.fileUrl,
          }))}
        />
      )}

      {/* Medical conditions section */}
      {filteredMedicalConditions.length > 0 && (
        <MedicalInfoSection
          title="Medical conditions"
          showToggle={false}
          icon={MedicalConditionIcon}
          items={filteredMedicalConditions.map((condition) => ({
            title: condition.name,
            description: condition.diagnosedDate
              ? `Diagnosed: ${formatDate(condition.diagnosedDate)}`
              : 'No diagnosis date',
            isRelevant: true,
          }))}
        />
      )}

      {/* Medications section */}
      {filteredMedications.length > 0 && (
        <MedicalInfoSection
          title="Medications"
          showToggle={false}
          icon={MedicationIcon}
          items={filteredMedications.map((medication) => ({
            title: medication.medicationName,
            description: medication.startDate
              ? `Prescribed: ${formatDate(medication.startDate)}`
              : 'No prescription date',
            isRelevant: true,
          }))}
        />
      )}

      {/* Lifestyle section */}
      {filteredLifestyles.length > 0 && (
        <MedicalInfoSection
          title="Lifestyle"
          showToggle={false}
          icon={LifeStyleIcon}
          items={filteredLifestyles.map((lifestyle) => ({
            title: lifestyle.description,
            description: lifestyle.updatedAt
              ? `Updated: ${formatDate(lifestyle.updatedAt)}`
              : 'No update date',
            isRelevant: true,
          }))}
        />
      )}

      {/* Allergies section */}
      {filteredAllergies.length > 0 && (
        <MedicalInfoSection
          title="Allergies"
          showToggle={false}
          icon={AllergyIcon}
          items={filteredAllergies.map((allergy) => ({
            title: allergy.allergen,
            description: allergy.diagnosedDate
              ? `Diagnosed: ${formatDate(allergy.diagnosedDate)}`
              : 'No diagnosis date',
            isRelevant: true,
          }))}
        />
      )}
    </div>
  )
}
