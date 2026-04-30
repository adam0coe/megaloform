import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

// Order matters: BrowserRouter outside, AuthProvider inside. The auth state
// is router-aware (e.g. logout triggers a navigate), so the router must be
// available wherever auth is consumed.
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
