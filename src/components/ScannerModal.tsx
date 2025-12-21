import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import ScanbotSDK from 'scanbot-web-sdk'
import closeIcon from '@/assets/onboarding/close.svg'

interface ScannerModalProps {
  isOpen: boolean
  onClose: () => void
  onScanComplete: (imageData: string) => void
}

// Helper function to convert Uint8Array to base64 data URL
function uint8ArrayToDataUrl(data: Uint8Array, mimeType: string = 'image/jpeg'): string {
  let binary = ''
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i])
  }
  return `data:${mimeType};base64,${btoa(binary)}`
}

export function ScannerModal({ isOpen, onClose, onScanComplete }: ScannerModalProps) {
  const scannerContainerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scanSuccess, setScanSuccess] = useState(false)
  const sdkRef = useRef<ScanbotSDK | null>(null)
  const scannerRef = useRef<Awaited<ReturnType<ScanbotSDK['createDocumentScanner']>> | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const initScanner = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Initialize Scanbot SDK (using trial license - works for 60 seconds)
        const sdk = await ScanbotSDK.initialize({
          licenseKey: '', // Empty string for trial mode
          enginePath: 'https://cdn.jsdelivr.net/npm/scanbot-web-sdk@8.0.0/bundle/bin/complete/'
        })
        sdkRef.current = sdk

        if (!scannerContainerRef.current) return

        // Create document scanner with auto-capture enabled
        const scanner = await sdk.createDocumentScanner({
          containerId: 'scanner-container',
          autoCaptureEnabled: true,
          autoCaptureSensitivity: 0.66, // Lower sensitivity - waits for clearer image
          autoCaptureDelay: 1000, // Wait 1 second for camera to focus before capturing
          scannerConfiguration: {
              parameters: {
                  ignoreOrientationMismatch: true,
              }
          },
          preferredCamera: 'camera2 0, facing back', // Prefer back camera for better quality
          text: {
            hint: {
              OK: 'Ready to capture',
              OK_BUT_TOO_SMALL: 'Document too small',
              OK_BUT_BAD_ANGLES: 'Bad angles',
              OK_BUT_BAD_ASPECT_RATIO: 'Bad aspect ratio',
              OK_BUT_ORIENTATION_MISMATCH: 'Document is upside down',
              OK_BUT_OFF_CENTER: 'Document off center',
              OK_BUT_TOO_DARK: 'Too dark',
              ERROR_NOTHING_DETECTED: 'No document detected',
              ERROR_TOO_DARK: 'Too dark',
              ERROR_TOO_NOISY: 'Too noisy',
              ERROR_PARTIALLY_VISIBLE: 'Document partially visible',
              ERROR_PARTIALLY_VISIBLE_TOO_CLOSE: 'Too close',
              NOT_ACQUIRED: 'Searching...',
            }
          },
          onDocumentDetected: async (result) => {
            const status = result.result?.detectionResult?.status
            console.log('Detection status:', status)

            // Check if we have a cropped image (capture already happened via auto-capture)
            const croppedImage = result.result?.croppedImage
            if (croppedImage) {
              if (scannerRef.current === null) return
              const currentScanner = scannerRef.current
              scannerRef.current = null
              try {
                const jpegData = await croppedImage.toJpeg(100)
                const base64Image = uint8ArrayToDataUrl(jpegData)
                currentScanner.dispose()

                // Show success state before closing
                setScanSuccess(true)
                setTimeout(() => {
                  onScanComplete(base64Image)
                  onClose()
                  setScanSuccess(false)
                }, 2500)
              } catch (e) {
                console.error('Failed to process image:', e)
                scannerRef.current = currentScanner
              }
              return
            }

            // If status starts with OK but no cropped image, force capture
            if (status?.startsWith('OK') && scannerRef.current) {
              const captureResult = await scannerRef.current.detectAndCrop()
              if (captureResult?.result?.croppedImage && scannerRef.current) {
                const currentScanner = scannerRef.current
                scannerRef.current = null
                try {
                  const jpegData = await captureResult.result.croppedImage.toJpeg(100)
                  const base64Image = uint8ArrayToDataUrl(jpegData)
                  currentScanner.dispose()

                  // Show success state before closing
                  setScanSuccess(true)
                  setTimeout(() => {
                    onScanComplete(base64Image)
                    onClose()
                    setScanSuccess(false)
                  }, 2500)
                } catch (e) {
                  console.error('Failed to process image:', e)
                  scannerRef.current = currentScanner
                }
              }
            }
          },
          onError: (e) => {
            console.error('Scanner error:', e)
            setError('Scanner error occurred')
          },
        })
        scannerRef.current = scanner

        setIsLoading(false)
      } catch (err) {
        console.error('Failed to initialize scanner:', err)
        setError('Failed to initialize camera. Please ensure camera permissions are granted.')
        setIsLoading(false)
      }
    }

    initScanner()

    return () => {
      if (scannerRef.current) {
        scannerRef.current.dispose()
        scannerRef.current = null
      }
    }
  }, [isOpen, onClose, onScanComplete])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-black"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex items-start justify-between p-4 pt-6"
          >
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1C1C1C]"
            >
              <img src={closeIcon} alt="close" className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="px-4 pb-4 text-center"
          >
            <h1 className="font-black text-2xl text-white mb-2">Scan your Lebanese ID</h1>
            <p className="font-medium text-sm text-gray-400">
              We use it to verify your identity and <br/>create your personal Health Space
            </p>
          </motion.div>

          {/* Scanner Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex-1 relative mx-4 rounded-2xl overflow-hidden"
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1C1C1C]">
                <p className="text-white">Initializing camera...</p>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1C1C1C] p-4">
                <p className="text-white text-center">{error}</p>
              </div>
            )}
            {scanSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#1C1C1C] z-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.2 }}
                  className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4"
                >
                  <motion.svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="text-white font-bold text-lg"
                >
                  ID Scanned Successfully
                </motion.p>
              </motion.div>
            )}
            <div
              id="scanner-container"
              ref={scannerContainerRef}
              className="w-full h-full"
            />
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="p-4 pb-8"
          >
            <p className="text-center font-bold text-sm text-gray-400">
              Your data stays private on your device
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
