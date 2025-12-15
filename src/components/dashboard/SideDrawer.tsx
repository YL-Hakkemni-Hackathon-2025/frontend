import { motion, AnimatePresence } from 'motion/react'
import MenuBck from '@/assets/MenuBck.svg'
import LockIcon from '@/assets/lock-closed.svg'

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
            style={{ overflow: 'hidden' }}
          >
            <div className="pl-6 pr-6 pt-8 pb-6 relative z-10">
              <h2 className="font-extrabold text-black mb-8" style={{ fontSize: '24px' }}>Menu</h2>
              <nav className="flex flex-col gap-2">
                <button className="flex items-center justify-between font-bold text-black py-2" style={{ fontSize: '16px' }}>
                  <span>HealthPasses</span>
                  <img src={LockIcon} alt="" />
                </button>
                <button className="flex items-center justify-between font-bold text-black py-2" style={{ fontSize: '16px' }}>
                  <span>My Profile</span>
                  <img src={LockIcon} alt="" />
                </button>
                <button className="flex items-center justify-between font-bold text-black py-2" style={{ fontSize: '16px' }}>
                  <span>Settings</span>
                  <img src={LockIcon} alt="" />
                </button>
                <button
                  onClick={onLogout}
                  className="text-left font-bold text-red-500 py-2"
                  style={{ fontSize: '16px' }}
                >
                  Log out
                </button>
              </nav>
            </div>
            {/* Background SVG */}
            <img
              src={MenuBck}
              alt=""
              className="absolute bottom-0 right-0 pointer-events-none"
              style={{
                display: 'block',
                maxWidth: 'none',
                transform: 'translateX(-10px)'
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
