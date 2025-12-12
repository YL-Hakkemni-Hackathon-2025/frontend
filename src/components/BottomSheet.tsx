import { motion, AnimatePresence } from 'motion/react'
import { ReactNode } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  isValid: boolean
  children: ReactNode
}

export function BottomSheet({ isOpen, onClose, onSave, isValid, children }: BottomSheetProps) {
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
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-61 max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="p-6 pb-8">
              {/* Top buttons row */}
              <div className="flex flex-row items-center justify-between mb-6">
                {/* Cancel button */}
                <button
                  onClick={onClose}
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '121%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    color: '#FF0000',
                  }}
                >
                  Cancel
                </button>

                {/* Save button */}
                <button
                  disabled={!isValid}
                  onClick={onSave}
                  style={{
                    fontFamily: 'Inter',
                    fontWeight: 700,
                    fontSize: '16px',
                    lineHeight: '121%',
                    letterSpacing: '0%',
                    verticalAlign: 'middle',
                    color: !isValid ? '#A4A4A4' : '#0057FF',
                  }}
                >
                  Save
                </button>
              </div>

              {/* Form content */}
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
