import { UserFullSummaryDto } from '@/dtos/user.dto'
import { MedicalInfoSection } from '@/components/MedicalInfoSection'
import { DocumentSection } from '@/components/DocumentSection'
import MedicalConditionIcon from '@/assets/MedicalConditionIcon.svg'
import MedicationIcon from '@/assets/MedicationIcon.svg'
import LifeStyleIcon from '@/assets/LifeStyleIcon.svg'
import AllergyIcon from '@/assets/AllergyIcon.svg'

interface HealthDataSectionsProps {
  user: UserFullSummaryDto
}

export function HealthDataSections({ user }: HealthDataSectionsProps) {
  return (
    <div className="px-4 pb-24">
      {/* Documents section */}
      {user.documents.length > 0 && (
        <DocumentSection
          title="Documents"
          items={user.documents.map((doc) => ({
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
          items={user.medicalConditions.map((condition) => ({
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
          items={user.medications.map((medication) => ({
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
          items={user.lifestyles.map((lifestyle) => ({
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
          items={user.allergies.map((allergy) => ({
            title: allergy.allergen,
            description: allergy.diagnosedDate
              ? `Diagnosed: ${allergy.diagnosedDate.toLocaleDateString('en-GB')}`
              : 'No diagnosis date',
            isRelevant: true,
          }))}
        />
      )}
    </div>
  )
}
