"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthClient } from "@/lib/firebase.js"
import { createUserWithEmailAndPassword, sendPasswordResetEmail, fetchSignInMethodsForEmail } from "firebase/auth"
import { createUserProfile } from "@/lib/firestore-service"
import { ChevronDown, Eye, EyeOff, Check, AlertCircle } from "lucide-react"

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
]

interface FormState {
  coopName: string
  registrationNumber: string
  state: string
  members: string
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

interface ValidationState {
  [key: string]: boolean | null
}

export default function SignUpForm() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
    coopName: "",
    registrationNumber: "",
    state: "",
    members: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const [validation, setValidation] = useState<ValidationState>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)
  const [resetStatus, setResetStatus] = useState<string | null>(null)

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "coopName":
        return value.trim().length >= 3
      case "registrationNumber":
        return value.trim().length >= 5
      case "state":
        return value.length > 0
      case "members":
        return Number.parseInt(value) > 0
      case "fullName":
        return value.trim().length >= 2
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      case "phone":
        return /^0\d{10}$/.test(value.replace(/\s/g, ""))
      case "password":
        return value.length >= 8
      case "confirmPassword":
        return value === form.password && value.length >= 8
      default:
        return false
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setValidation((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    ;(async () => {
      try {
        // Basic validation before attempting sign up
        if (!form.email || !form.password) throw new Error('Email and password required')

        const auth = getAuthClient()
        if (!auth) throw new Error('Auth not available')

        // Check whether this email already has sign-in methods. This avoids
        // attempting to create a duplicate account which results in a noisy
        // FirebaseError (auth/email-already-in-use).
        const methods = await fetchSignInMethodsForEmail(auth, form.email).catch(() => [])
        if (methods && methods.length > 0) {
          // Email already registered — offer user-friendly guidance instead of throwing
          setSubmitError('That email is already registered. Try logging in instead.')
          setInfoMessage('If this is your email, you can log in or reset your password.')
          setIsLoading(false)
          return
        }

        const result = await createUserWithEmailAndPassword(auth, form.email, form.password)
        const user = result.user

        // Create user profile in Firestore with default role 'member'
        await createUserProfile({
          uid: user.uid,
          displayName: form.fullName || user.displayName || undefined,
          email: user.email || undefined,
          photoURL: user.photoURL || undefined,
          role: 'member',
        })

        // Redirect to dashboard
        router.push('/dashboard')
      } catch (err: any) {
        console.error('signup error', err)
        // Map known Firebase auth errors to friendly messages
        let msg = 'Signup failed. Please try again.'
        const code = err?.code || err?.message || ''
        if (typeof code === 'string') {
          if (code.includes('auth/email-already-in-use') || code.includes('email-already-in-use')) {
            msg = 'That email is already registered. Try logging in instead.'
          } else if (code.includes('auth/weak-password') || code.includes('weak-password')) {
            msg = 'Password is too weak. Use at least 8 characters with numbers and letters.'
          } else if (code.includes('auth/invalid-email') || code.includes('invalid-email')) {
            msg = 'Please enter a valid email address.'
          } else if (code.includes('Auth not available')) {
            msg = 'Authentication is not available in this environment.'
          } else if (err?.message) {
            msg = err.message
          }
        }
        setSubmitError(msg)
        // If email already in use, provide a gentle nudge and option to reset
        if (msg.includes('already registered')) {
          setInfoMessage('If this is your email, you can log in or reset your password.')
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }

  const getPasswordStrength = (password: string) => {
    if (!password) return { level: 0, text: "", color: "" }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const levels = [
      { level: 0, text: "", color: "" },
      { level: 1, text: "Weak", color: "text-red-500" },
      { level: 2, text: "Fair", color: "text-yellow-500" },
      { level: 3, text: "Good", color: "text-blue-500" },
      { level: 4, text: "Strong", color: "text-green-500" },
    ]
    return levels[strength]
  }

  const passwordStrength = getPasswordStrength(form.password)

  return (
    <div className="w-full max-w-md">
      {/* Logo and Branding */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-10 h-10 bg-[#22A65B] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Coopa</span>
        </div>
        <p className="text-sm text-gray-600">The Cooperative Advantage</p>
      </div>

      {/* Form Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Co-op Account</h1>
        <p className="text-gray-600">Join cooperatives saving together across Nigeria</p>
      </div>

  <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
        {/* Co-op Information Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Co-op Information</h2>

          {/* Co-op Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Co-op Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="coopName"
                placeholder="Unity Cooperative Society"
                value={form.coopName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 rounded-lg border-2 transition-colors ${
                  validation.coopName === true
                    ? "border-[#22A65B] bg-green-50"
                    : validation.coopName === false
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                } focus:outline-none focus:border-[#22A65B]`}
              />
              {validation.coopName === true && <Check className="absolute right-3 top-3.5 w-5 h-5 text-[#22A65B]" />}
              {validation.coopName === false && (
                <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />
              )}
            </div>
            {validation.coopName === false && (
              <p className="text-red-500 text-sm mt-1">Co-op name must be at least 3 characters</p>
            )}
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="registrationNumber"
                placeholder="RC123456"
                value={form.registrationNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 rounded-lg border-2 transition-colors ${
                  validation.registrationNumber === true
                    ? "border-[#22A65B] bg-green-50"
                    : validation.registrationNumber === false
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                } focus:outline-none focus:border-[#22A65B]`}
              />
              {validation.registrationNumber === true && (
                <Check className="absolute right-3 top-3.5 w-5 h-5 text-[#22A65B]" />
              )}
              {validation.registrationNumber === false && (
                <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />
              )}
            </div>
            {validation.registrationNumber === false && (
              <p className="text-red-500 text-sm mt-1">Registration number must be at least 5 characters</p>
            )}
          </div>

          {/* State/Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State/Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="state"
                value={form.state}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 rounded-lg border-2 transition-colors appearance-none ${
                  validation.state === true
                    ? "border-[#22A65B] bg-green-50"
                    : validation.state === false
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                } focus:outline-none focus:border-[#22A65B]`}
              >
                <option value="">Select a state</option>
                {NIGERIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
              {validation.state === true && <Check className="absolute right-10 top-3.5 w-5 h-5 text-[#22A65B]" />}
            </div>
          </div>

          {/* Number of Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Members <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                name="members"
                placeholder="50"
                value={form.members}
                onChange={handleChange}
                onBlur={handleBlur}
                min="1"
                className={`w-full px-5 py-4 rounded-lg border-2 transition-colors ${
                  validation.members === true
                    ? "border-[#22A65B] bg-green-50"
                    : validation.members === false
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                } focus:outline-none focus:border-[#22A65B]`}
              />
              {validation.members === true && <Check className="absolute right-3 top-3.5 w-5 h-5 text-[#22A65B]" />}
              {validation.members === false && (
                <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />
              )}
            </div>
            {validation.members === false && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid number of members</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Administrator Details Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Administrator Details</h2>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                placeholder="Adewale Johnson"
                value={form.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 rounded-lg border-2 transition-colors ${
                  validation.fullName === true
                    ? "border-[#22A65B] bg-green-50"
                    : validation.fullName === false
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                } focus:outline-none focus:border-[#22A65B]`}
              />
              {validation.fullName === true && <Check className="absolute right-3 top-3.5 w-5 h-5 text-[#22A65B]" />}
              {validation.fullName === false && (
                <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />
              )}
            </div>
            {validation.fullName === false && (
              <p className="text-red-500 text-sm mt-1">Full name must be at least 2 characters</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="admin@unity-coop.org"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 rounded-lg border-2 transition-colors ${
                  validation.email === true
                    ? "border-[#22A65B] bg-green-50"
                    : validation.email === false
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                } focus:outline-none focus:border-[#22A65B]`}
              />
              {validation.email === true && <Check className="absolute right-3 top-3.5 w-5 h-5 text-[#22A65B]" />}
              {validation.email === false && <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />}
            </div>
            {validation.email === false && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="0803 456 7890"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 rounded-lg border-2 transition-colors ${
                  validation.phone === true
                    ? "border-[#22A65B] bg-green-50"
                    : validation.phone === false
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                } focus:outline-none focus:border-[#22A65B]`}
              />
              {validation.phone === true && <Check className="absolute right-3 top-3.5 w-5 h-5 text-[#22A65B]" />}
              {validation.phone === false && <AlertCircle className="absolute right-3 top-3.5 w-5 h-5 text-red-500" />}
            </div>
            {validation.phone === false && (
              <p className="text-red-500 text-sm mt-1">Please enter a valid Nigerian phone number</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Min 8 characters"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 rounded-lg border-2 transition-colors ${
                  validation.password === true
                    ? "border-[#22A65B] bg-green-50"
                    : validation.password === false
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                } focus:outline-none focus:border-[#22A65B]`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.level === 1
                        ? "w-1/4 bg-red-500"
                        : passwordStrength.level === 2
                          ? "w-1/2 bg-yellow-500"
                          : passwordStrength.level === 3
                            ? "w-3/4 bg-blue-500"
                            : "w-full bg-green-500"
                    }`}
                  ></div>
                </div>
                <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.text}</span>
              </div>
            )}
            {validation.password === false && (
              <p className="text-red-500 text-sm mt-1">Password must be at least 8 characters</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-5 py-4 rounded-lg border-2 transition-colors ${
                  validation.confirmPassword === true
                    ? "border-[#22A65B] bg-green-50"
                    : validation.confirmPassword === false
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                } focus:outline-none focus:border-[#22A65B]`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {validation.confirmPassword === true && (
                <Check className="absolute right-12 top-3.5 w-5 h-5 text-[#22A65B]" />
              )}
              {validation.confirmPassword === false && (
                <AlertCircle className="absolute right-12 top-3.5 w-5 h-5 text-red-500" />
              )}
            </div>
            {validation.confirmPassword === false && (
              <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
            )}
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name="agreeTerms"
            checked={form.agreeTerms}
            onChange={handleChange}
            className="w-5 h-5 rounded border-gray-300 text-[#22A65B] focus:ring-[#22A65B] mt-1 cursor-pointer"
          />
          <label className="text-sm text-gray-700">
            I agree to the{" "}
            <a href="#" className="text-[#22A65B] hover:underline font-medium">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#22A65B] hover:underline font-medium">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit Button */}
        {submitError && <div className="text-red-500 text-sm mb-2">{submitError}</div>}
        {infoMessage && (
          <div className="text-sm text-gray-700 mb-2">
            <div>{infoMessage}</div>
            <div className="mt-2 flex gap-2">
              <a href="/login" className="text-[#22A65B] hover:underline font-medium">Go to Login</a>
              <button
                type="button"
                onClick={async () => {
                  setResetStatus(null)
                  try {
                    const auth = getAuthClient()
                    if (!auth) throw new Error('Auth not available')
                    await sendPasswordResetEmail(auth, form.email)
                    setResetStatus('A password reset email has been sent if the account exists.')
                  } catch (err: any) {
                    setResetStatus('Failed to send reset email. Please try again later.')
                  }
                }}
                className="px-3 py-1 text-sm border rounded text-gray-700 hover:bg-gray-50"
              >
                Send reset email
              </button>
            </div>
            {resetStatus && <div className="text-xs text-gray-600 mt-1">{resetStatus}</div>}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !form.agreeTerms}
          className="w-full bg-[#22A65B] hover:bg-[#1B8A4A] disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Account...
            </>
          ) : (
            <>
              Create Account <span>→</span>
            </>
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-[#22A65B] hover:underline font-medium">
            Login
          </a>
        </p>
      </form>
    </div>
  )
}

// Helper: attempt to send password reset email and show friendly messages
export async function trySendPasswordReset(email: string) {
  try {
    const auth = getAuthClient()
    if (!auth) throw new Error('Auth not available')
    await sendPasswordResetEmail(auth, email)
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err?.message || String(err) }
  }
}
