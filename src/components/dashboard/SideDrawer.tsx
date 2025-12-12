import { motion, AnimatePresence } from 'motion/react'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export function SideDrawer({ isOpen, onClose, onLogout }: SideDrawerProps) {
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
                  onClick={onLogout}
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
  )
}
