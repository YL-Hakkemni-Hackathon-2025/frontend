import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { HabitFrequency, LifestyleCategory } from '@/utils/global.types'
import { HabitDto } from '@/dtos/lifestyle.dto'

interface LifestyleFormProps {
  isOpen: boolean
  initialHabits?: HabitDto[]
  isSaving?: boolean
  onSave: (habits: HabitDto[]) => void
  onClose: () => void
}

interface LifestyleHabitConfig {
  id: LifestyleCategory
  question: string
  options: { value: HabitFrequency; label: string }[]
}

const lifestyleHabits: LifestyleHabitConfig[] = [
  {
    id: LifestyleCategory.SMOKING,
    question: 'Do you smoke?',
    options: [
      { value: HabitFrequency.NOT_SET, label: 'Not set' },
      { value: HabitFrequency.NEVER, label: 'Never' },
      { value: HabitFrequency.RARELY, label: 'Rarely' },
      { value: HabitFrequency.OCCASIONALLY, label: 'Occasionally' },
      { value: HabitFrequency.DAILY, label: 'Daily' },
    ],
  },
  {
    id: LifestyleCategory.ALCOHOL,
    question: 'Do you drink alcohol?',
    options: [
      { value: HabitFrequency.NOT_SET, label: 'Not set' },
      { value: HabitFrequency.NEVER, label: 'Never' },
      { value: HabitFrequency.RARELY, label: 'Rarely' },
      { value: HabitFrequency.OCCASIONALLY, label: 'Occasionally' },
      { value: HabitFrequency.DAILY, label: 'Daily' },
    ],
  },
  {
    id: LifestyleCategory.EXERCISE,
    question: 'How physically active are you?',
    options: [
      { value: HabitFrequency.NOT_SET, label: 'Not set' },
      { value: HabitFrequency.RARELY, label: 'Sedentary' },
      { value: HabitFrequency.OCCASIONALLY, label: 'Moderate' },
      { value: HabitFrequency.FREQUENTLY, label: 'Active' },
      { value: HabitFrequency.DAILY, label: 'Very Active' },
    ],
  },
  {
    id: LifestyleCategory.SLEEP,
    question: 'How would you rate your sleep?',
    options: [
      { value: HabitFrequency.NOT_SET, label: 'Not set' },
      { value: HabitFrequency.RARELY, label: 'Poor' },
      { value: HabitFrequency.OCCASIONALLY, label: 'Fair' },
      { value: HabitFrequency.FREQUENTLY, label: 'Good' },
      { value: HabitFrequency.DAILY, label: 'Excellent' },
    ],
  },
  {
    id: LifestyleCategory.STRESS,
    question: 'How would you rate your stress level?',
    options: [
      { value: HabitFrequency.NOT_SET, label: 'Not set' },
      { value: HabitFrequency.RARELY, label: 'Low' },
      { value: HabitFrequency.OCCASIONALLY, label: 'Moderate' },
      { value: HabitFrequency.FREQUENTLY, label: 'High' },
      { value: HabitFrequency.DAILY, label: 'Very High' },
    ],
  },
]

const getFrequencyColor = (value: HabitFrequency): string => {
  switch (value) {
    case HabitFrequency.NOT_SET:
      return '#9CA3AF' // Gray
    case HabitFrequency.NEVER:
      return '#10B981' // Green
    case HabitFrequency.RARELY:
      return '#22C55E' // Light green
    case HabitFrequency.OCCASIONALLY:
      return '#385DA4' // Blue
    case HabitFrequency.FREQUENTLY:
      return '#F59E0B' // Orange
    case HabitFrequency.DAILY:
      return '#EF4444' // Red
    default:
      return '#9CA3AF'
  }
}

export function LifestyleForm({ isOpen, initialHabits, isSaving, onSave, onClose }: LifestyleFormProps) {
  const [habitValues, setHabitValues] = useState<Record<LifestyleCategory, HabitFrequency>>(() => {
    // Initialize from initialHabits if provided
    const initial: Record<LifestyleCategory, HabitFrequency> = {
      [LifestyleCategory.SMOKING]: HabitFrequency.NOT_SET,
      [LifestyleCategory.ALCOHOL]: HabitFrequency.NOT_SET,
      [LifestyleCategory.EXERCISE]: HabitFrequency.NOT_SET,
      [LifestyleCategory.DIET]: HabitFrequency.NOT_SET,
      [LifestyleCategory.SLEEP]: HabitFrequency.NOT_SET,
      [LifestyleCategory.STRESS]: HabitFrequency.NOT_SET,
      [LifestyleCategory.OTHER]: HabitFrequency.NOT_SET,
    }

    if (initialHabits) {
      initialHabits.forEach(habit => {
        initial[habit.category] = habit.frequency
      })
    }

    return initial
  })

  // Reset habits when initialHabits changes (e.g., when opening the form)
  useEffect(() => {
    if (initialHabits) {
      const updated: Record<LifestyleCategory, HabitFrequency> = {
        [LifestyleCategory.SMOKING]: HabitFrequency.NOT_SET,
        [LifestyleCategory.ALCOHOL]: HabitFrequency.NOT_SET,
        [LifestyleCategory.EXERCISE]: HabitFrequency.NOT_SET,
        [LifestyleCategory.DIET]: HabitFrequency.NOT_SET,
        [LifestyleCategory.SLEEP]: HabitFrequency.NOT_SET,
        [LifestyleCategory.STRESS]: HabitFrequency.NOT_SET,
        [LifestyleCategory.OTHER]: HabitFrequency.NOT_SET,
      }
      initialHabits.forEach(habit => {
        updated[habit.category] = habit.frequency
      })
      setHabitValues(updated)
    }
  }, [initialHabits])

  const handleHabitClick = (habit: LifestyleHabitConfig) => {
    const currentValue = habitValues[habit.id]
    const currentIndex = habit.options.findIndex(o => o.value === currentValue)
    const nextIndex = (currentIndex + 1) % habit.options.length
    const nextOption = habit.options[nextIndex]

    setHabitValues(prev => ({
      ...prev,
      [habit.id]: nextOption.value
    }))
  }

  const handleSave = () => {
    // Convert habitValues to HabitDto array, only include habits that are set
    const habits: HabitDto[] = Object.entries(habitValues)
      .filter(([_, frequency]) => frequency !== HabitFrequency.NOT_SET)
      .map(([category, frequency]) => ({
        category: category as LifestyleCategory,
        frequency: frequency,
      }))

    onSave(habits)
  }

  const getHabitLabel = (habit: LifestyleHabitConfig): string => {
    const value = habitValues[habit.id]
    return habit.options.find(o => o.value === value)?.label || 'Not set'
  }

  const hasAnyHabitSet = Object.values(habitValues).some(v => v !== HabitFrequency.NOT_SET)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-60"
          />
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-[#F5F7FA] rounded-t-3xl z-61 flex flex-col"
            style={{
              paddingBottom: 'env(safe-area-inset-bottom)',
              maxHeight: '85vh',
            }}
          >
            <div className="px-6 pb-8 overflow-y-auto flex-1">
              {/* Top buttons row */}
              <div className="flex flex-row items-center justify-between mb-6 sticky top-0 bg-[#F5F7FA] z-10 -mx-6 px-6 pb-4 pt-6 rounded-t-3xl">
                {/* Cancel button */}
                <button
                  onClick={onClose}
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '121%',
                    color: '#FF0000',
                  }}
                >
                  Cancel
                </button>

                {/* Save button */}
                <button
                  disabled={!hasAnyHabitSet || isSaving}
                  onClick={handleSave}
                  className="flex items-center gap-2"
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '121%',
                    color: !hasAnyHabitSet || isSaving ? '#A4A4A4' : '#0057FF',
                  }}
                >
                  {isSaving && (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  )}
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>

              {/* Header text */}
              <h2
                className="text-left mb-8"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 900,
                  fontSize: '18px',
                  lineHeight: '140%',
                  color: '#1F2937',
                }}
              >
                Help your doctor better understand your daily habits
              </h2>

              {/* Lifestyle pills */}
              <div className="flex flex-col items-center gap-3">
                {lifestyleHabits.map((habit) => {
                  const currentValue = habitValues[habit.id]
                  const currentLabel = getHabitLabel(habit)

                  return (
                    <button
                      key={habit.id}
                      type="button"
                      onClick={() => handleHabitClick(habit)}
                      className="w-full bg-white rounded-full px-6 py-4 flex items-center justify-between transition-all active:scale-[0.98]"
                      style={{
                        boxShadow: '0px 0px 30px 0px rgba(56, 93, 164, 0.1)',
                      }}
                    >
                      <span
                        className="text-left flex-1"
                        style={{
                          fontFamily: 'Inter',
                          fontWeight: 700,
                          fontSize: '15px',
                          color: '#1F2937',
                        }}
                      >
                        {habit.question}
                      </span>
                      <span
                        className="text-right flex-shrink-0 ml-4"
                        style={{
                          fontFamily: 'Inter',
                          fontWeight: 700,
                          fontSize: '14px',
                          color: getFrequencyColor(currentValue),
                        }}
                      >
                        {currentLabel}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
