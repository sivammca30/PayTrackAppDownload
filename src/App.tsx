import { useState, type FormEvent } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getFirestoreDatabase } from './firebase'
import './App.css'

function DownloadPage() {
  const apkUrl = new URL(
    `${import.meta.env.BASE_URL}paytrack.apk`,
    window.location.href,
  ).toString()

  return (
    <main className="page-shell">
      <section className="download-card" aria-labelledby="download-title">
        <div className="brand-mark" aria-hidden="true">P</div>
        <p className="eyebrow">PAYTRACK</p>
        <h1 id="download-title">You’re all set.</h1>
        <p className="intro">
          Thanks for registering. Your PayTrack app is ready to download.
        </p>
        <a className="primary-button download-button" href={apkUrl} download>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />
          </svg>
          Download PayTrack APK
        </a>
        <p className="download-note">Android app · APK file</p>
        <a className="text-link" href={import.meta.env.BASE_URL}>Back to registration</a>
      </section>
    </main>
  )
}

function RegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const mobileNumber = String(formData.get('mobileNumber') ?? '').trim()

    try {
      const database = getFirestoreDatabase()
      await addDoc(collection(database, 'registrations'), {
        name,
        email,
        mobileNumber,
        registeredAt: serverTimestamp(),
      })
      const downloadPageUrl = new URL(
        import.meta.env.BASE_URL,
        window.location.href,
      )
      downloadPageUrl.searchParams.set('page', 'download')
      window.location.assign(downloadPageUrl.toString())
    } catch (error) {
      console.error('Registration failed:', error)
      setErrorMessage(
        error instanceof Error && error.message.startsWith('Firebase is not configured')
          ? error.message
          : 'We couldn’t complete your registration. Please try again.',
      )
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <section className="registration-layout" aria-labelledby="registration-title">
        <div className="welcome-panel">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">P</span>
            <span>PayTrack</span>
          </div>
          <div className="welcome-copy">
            <p className="eyebrow">A BETTER WAY TO STAY ON TRACK</p>
            <h1>Make every rupee count.</h1>
            <p>
              Keep your finances in focus with PayTrack. Register now to get
              started with the app.
            </p>
          </div>
          <div className="welcome-footer">
            <span className="status-dot" aria-hidden="true" />
            Simple. Clear. In control.
          </div>
        </div>

        <div className="form-panel">
          <div className="form-heading">
            <p className="eyebrow">GET STARTED</p>
            <h2 id="registration-title">Create your account</h2>
            <p>Enter your details to download the PayTrack app.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full name</label>
            <input
              autoComplete="name"
              id="name"
              name="name"
              placeholder="Your name"
              required
              maxLength={100}
            />

            <label htmlFor="email">Email address</label>
            <input
              autoComplete="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              type="email"
              maxLength={254}
            />

            <label htmlFor="mobileNumber">Mobile number</label>
            <input
              autoComplete="tel"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="+91 98765 43210"
              required
              type="tel"
              minLength={7}
              maxLength={20}
              pattern="\+?[0-9 ]{7,19}"
              title="Enter a mobile number using digits, spaces, and an optional leading +."
            />

            {errorMessage && (
              <p className="form-error" role="alert">{errorMessage}</p>
            )}

            <button className="primary-button" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Registering…' : 'Register'}
              {!isSubmitting && (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              )}
            </button>
          </form>

          <p className="privacy-note">
            Your details are used only to register your PayTrack account.
          </p>
        </div>
      </section>
    </main>
  )
}

function App() {
  const isDownloadPage =
    new URLSearchParams(window.location.search).get('page') === 'download' ||
    window.location.pathname.replace(/\/+$/, '') === '/download'
  return isDownloadPage ? <DownloadPage /> : <RegistrationPage />
}

export default App
