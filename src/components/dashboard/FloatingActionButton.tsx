import { motion, AnimatePresence } from 'motion/react'
import addIcon from '@/assets/dashboard/add.svg'
import heartIcon from '@/assets/dashboard/heart.svg'
import medicationIcon from '@/assets/dashboard/medication.svg'
import allergyIcon from '@/assets/dashboard/allergy.svg'
import lifestyleIcon from '@/assets/dashboard/lifestyle.svg'
import documentIcon from '@/assets/dashboard/document.svg'

type FormType = 'medical-condition' | 'medication' | 'allergy' | 'lifestyle' | 'document'

interface FABMenuItem {
  label: string
  icon: string
  type: FormType
}

interface FloatingActionButtonProps {
  isMenuOpen: boolean
  isDrawerOpen: boolean
  onToggleMenu: () => void
  onSelectForm: (formType: FormType) => void
}

const fabMenuItems: FABMenuItem[] = [
  { label: 'Medical condition', icon: heartIcon, type: 'medical-condition' },
  { label: 'Medication', icon: medicationIcon, type: 'medication' },
  { label: 'Allergy', icon: allergyIcon, type: 'allergy' },
  { label: 'Lifestyle', icon: lifestyleIcon, type: 'lifestyle' },
  { label: 'Document', icon: documentIcon, type: 'document' },
]

export function FloatingActionButton({ isMenuOpen, isDrawerOpen, onToggleMenu, onSelectForm }: FloatingActionButtonProps) {
  const handleMenuItemClick = (type: FormType) => {
    onSelectForm(type)
    onToggleMenu()
  }

  return (
    <>
      {/* FAB Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onToggleMenu}
            className="fixed inset-0 z-40 backdrop-blur-[30px]"
            style={{
              background: 'radial-gradient(circle, rgba(185,185,185,0.7) 0%, rgba(0,0,0,0.8) 100%)',
            }}
          />
        )}
      </AnimatePresence>

      {/* FAB Menu Items */}
      <AnimatePresence>
        {isMenuOpen && (
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
                onClick={() => handleMenuItemClick(item.type)}
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
        onClick={() => !isDrawerOpen && onToggleMenu()}
        disabled={isDrawerOpen}
        className={`fixed bottom-6 right-4 w-14 h-14 bg-white rounded-full flex items-center justify-center z-50 transition-all duration-200 ${
          isMenuOpen ? 'shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]' : 'shadow-lg'
        } ${isDrawerOpen ? 'opacity-0 pointer-events-none' : ''}`}
      >
        <img
          alt="add"
          src={addIcon}
          className={`w-6 h-6 transition-transform duration-200 ${isMenuOpen ? 'rotate-45' : ''}`}
        />
      </button>
    </>
  )
}
