import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/generate-healthpass')({
  component: GenerateHealthPassPage,
})

function GenerateHealthPassPage() {
  const navigate = useNavigate()

  const messages = [
    "Preparing your Dermatology HealthPass…",
    "Analyzing your medical history…",
    "Selecting the information your dermatologist actually needs…",
    "Preparing your HealthPass…"
  ]

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate({ to: '/healthpass-results' })
    }, 15000) // 15 seconds

    return () => clearTimeout(timer)
  }, [navigate])
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#001568]">
      {/* Animated gradient background - scaled larger to create movement effect */}
      <motion.div
        className="absolute -inset-[50%]"
        style={{
          background: 'linear-gradient(225deg, #FF0000 0%, #001568 50%, #001568 100%)',
        }}
        initial={{ x: 0, y: 0 }}
        animate={{
          x: [-50, 50, -50],
          y: [-50, 50, -50],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-dvh px-6 pt-16 flex justify-start">
        <div className="text-left max-w-xs">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentMessageIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="font-black text-2xl text-white mb-4"
            >
              {messages[currentMessageIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
