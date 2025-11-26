"use client"

import { useEffect, useState } from "react"
import { X, Download, Zap, Bell, HardDrive, Smartphone } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function InstallPWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [dismissCount, setDismissCount] = useState(0)
  const [visitCount, setVisitCount] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isInstalling, setIsInstalling] = useState(false)

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (!isMobile) return

    // Track visit count
    const visits = localStorage.getItem("coopa-visit-count")
    const currentVisits = visits ? Number.parseInt(visits) + 1 : 1
    localStorage.setItem("coopa-visit-count", currentVisits.toString())
    setVisitCount(currentVisits)

    // Get dismiss count
    const dismissed = localStorage.getItem("pwa-dismiss-count")
    const dismissCountValue = dismissed ? Number.parseInt(dismissed) : 0
    setDismissCount(dismissCountValue)
  }, [])

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (!isMobile || visitCount < 2 || dismissCount >= 2) return

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after 30 seconds of activity
      const timer = setTimeout(() => {
        setShowPrompt(true)
        // Track analytics impression
        trackAnalytics("pwa_impression")
      }, 30000)

      return () => clearTimeout(timer)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [visitCount, dismissCount])

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setIsScrolling(true)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
      }, 1000)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  const trackAnalytics = (event: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", event, {
        event_category: "pwa",
        event_label: "install_banner",
      })
    }
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return

    setIsInstalling(true)
    trackAnalytics("pwa_install_click")

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === "accepted") {
        setShowPrompt(false)
        setShowSuccess(true)
        trackAnalytics("pwa_install_success")

        // Show success message for 3 seconds
        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)

        setDeferredPrompt(null)
      } else {
        trackAnalytics("pwa_install_dismissed")
      }
    } catch (error) {
      console.error("[v0] PWA install error:", error)
    } finally {
      setIsInstalling(false)
    }
  }

  const handleDismiss = () => {
    const newCount = dismissCount + 1
    setDismissCount(newCount)
    localStorage.setItem("pwa-dismiss-count", newCount.toString())
    setShowPrompt(false)
    trackAnalytics("pwa_dismiss")
  }

  if (!showPrompt && !showSuccess) return null
  if (!deferredPrompt && !showSuccess) return null

  if (showSuccess) {
    return (
      <div
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm animate-in slide-in-from-bottom-4 duration-300"
        role="status"
        aria-live="polite"
      >
        <div className="bg-green-600 text-white rounded-lg shadow-xl p-4 flex items-center gap-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="font-semibold">Coopa Installed!</p>
            <p className="text-sm text-green-50">Find it on your home screen</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolling ? "translate-y-full" : "translate-y-0"
      }`}
      role="dialog"
      aria-labelledby="pwa-banner-title"
      aria-describedby="pwa-banner-description"
    >
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-2xl shadow-2xl p-5 md:p-6 mx-4 md:mx-auto md:max-w-md md:rounded-2xl md:mb-4 animate-in slide-in-from-bottom-8 duration-500 [animation-timing-function:cubic-bezier(0.34,1.56,0.64,1)]">
        {/* Header with close button */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-white bg-opacity-20 rounded-lg p-2">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 id="pwa-banner-title" className="font-bold text-lg">
                Install Coopa
              </h3>
              <p className="text-sm text-green-50">Only takes 2 seconds</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-green-100 hover:text-white transition-colors p-1 hover:bg-white hover:bg-opacity-10 rounded-lg"
            aria-label="Dismiss installation prompt"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits section */}
        <div id="pwa-banner-description" className="mb-5 space-y-2">
          <div className="flex items-center gap-3 text-sm">
            <HardDrive className="w-4 h-4 flex-shrink-0" />
            <span>Works offline - save your data</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Zap className="w-4 h-4 flex-shrink-0" />
            <span>Loads faster than browser</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Bell className="w-4 h-4 flex-shrink-0" />
            <span>Get instant notifications</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Download className="w-4 h-4 flex-shrink-0" />
            <span>Quick access from home screen</span>
          </div>
        </div>

        {/* Sub-text highlighting Nigerian context */}
        <p className="text-xs text-green-50 mb-5 font-medium">✓ No app store needed • Works on poor connections</p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex-1 bg-white text-green-600 font-bold py-3 px-4 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center gap-2"
            aria-label="Install Coopa app now"
          >
            {isInstalling ? (
              <>
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                Installing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Install Now
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-3 text-white font-medium hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors min-h-[44px]"
            aria-label="Maybe later"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}
