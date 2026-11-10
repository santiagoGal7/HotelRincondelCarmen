import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/bodoni-moda/latin-500.css'
import '@fontsource/bodoni-moda/latin-ext-500.css'
import '@fontsource/bodoni-moda/latin-600.css'
import '@fontsource/bodoni-moda/latin-ext-600.css'
import '@fontsource/bodoni-moda/latin-500-italic.css'
import '@fontsource/bodoni-moda/latin-ext-500-italic.css'
import '@fontsource/outfit/latin-400.css'
import '@fontsource/outfit/latin-ext-400.css'
import '@fontsource/outfit/latin-500.css'
import '@fontsource/outfit/latin-ext-500.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-ext-400.css'
import { App } from '@/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
