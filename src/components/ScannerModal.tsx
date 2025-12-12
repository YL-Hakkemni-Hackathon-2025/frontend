import { useEffect, useRef, useState } from 'react'
import ScanbotSDK from 'scanbot-web-sdk'

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
  const sdkRef = useRef<ScanbotSDK | null>(null)
  const scannerRef = useRef<Awaited<ReturnType<ScanbotSDK['createDocumentScanner']>> | null>(null)
  const LICENSE_KEY =
        "i83CJeuvcWa3FN3lsvs/zfkA9wlngP" +
        "0TVVyj9habNZlfntHvQFBJDr4lXPzz" +
        "91JAnQ5Iic5K1/dwn/1e/Hi5NgV5/B" +
        "oM55Ly+QW2XHXpUtNZ1yv427Do4evI" +
        "Wb+YVRBhmNUNR/+1I94dzptC62u0KS" +
        "rBrqyOrIDJNrYNl92iKmqmbcbAsiXL" +
        "EI/dLz7NblTN0ZmeuHOtlL/q7gnxJT" +
        "XJXajkOnn5M6ToKmtqLXZerpIUqkp4" +
        "y9x8THqFNvt6qJ/nDylwHYTD2+rQJt" +
        "PZVDp7zcM/XdvyYJSX1hs1lEDd6kEL" +
        "+N2vbuH8xc4BkjghGmwZ+/PxYUktRB" +
        "7JdtTIijkusA==\nU2NhbmJvdFNESw" +
        "psb2NhbGhvc3R8aGFra2VtbmktZnJv" +
        "bnRlbmQtaGFja2F0aG9uLnZlcmNlbC" +
        "5hcHAKMTc2NjE4ODc5OQo4Mzg4NjA3" +
        "Cjg=\n";

  useEffect(() => {
    if (!isOpen) return

    const initScanner = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Initialize Scanbot SDK (using trial license - works for 60 seconds)
        const sdk = await ScanbotSDK.initialize({
          licenseKey: LICENSE_KEY, // Empty string for trial mode
          enginePath: 'https://cdn.jsdelivr.net/npm/scanbot-web-sdk@8.0.0/bundle/bin/complete/'
        })
        sdkRef.current = sdk

        if (!scannerContainerRef.current) return

        // Create document scanner with auto-capture enabled
        const scanner = await sdk.createDocumentScanner({
          containerId: 'scanner-container',
          autoCaptureEnabled: true,
          autoCaptureSensitivity: 1.0, // Maximum speed - immediate capture
          autoCaptureDelay: 0, // No delay
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
                const jpegData = await croppedImage.toJpeg(90)
                const base64Image = uint8ArrayToDataUrl(jpegData)
                currentScanner.dispose()
                onScanComplete(base64Image)
                onClose()
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
                  const jpegData = await captureResult.result.croppedImage.toJpeg(90)
                  const base64Image = uint8ArrayToDataUrl(jpegData)
                  currentScanner.dispose()
                  onScanComplete(base64Image)
                  onClose()
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Sheet */}
      <div className="absolute bottom-0 left-0 right-0 h-[90%] bg-white rounded-t-3xl flex flex-col overflow-hidden">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4">
          <h2 className="text-xl font-bold text-black">Scan Lebanese ID</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
          >
            <span className="text-xl text-gray-600">×</span>
          </button>
        </div>

        {/* Scanner Container */}
        <div className="flex-1 relative bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <p className="text-white">Initializing camera...</p>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black p-4">
              <p className="text-white text-center">{error}</p>
            </div>
          )}
          <div
            id="scanner-container"
            ref={scannerContainerRef}
            className="w-full h-full"
          />
        </div>

        {/* Instructions */}
        <div className="p-4 bg-white">
          <p className="text-center text-gray-600">
            Position your Lebanese ID within the frame
          </p>
        </div>
      </div>
    </div>
  )
}
