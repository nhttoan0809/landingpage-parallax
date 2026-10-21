import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LenisProvider } from './lib/lenis.tsx'
import { HelmetProvider } from 'react-helmet-async'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <LenisProvider>
        <App />
      </LenisProvider>
    </HelmetProvider>
  </StrictMode>,
)
