import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/fraunces/latin-500.css'
import '@fontsource/fraunces/latin-ext-500.css'
import '@fontsource/fraunces/latin-600.css'
import '@fontsource/fraunces/latin-ext-600.css'
import '@fontsource/fraunces/latin-500-italic.css'
import '@fontsource/fraunces/latin-ext-500-italic.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-ext-400.css'
import '@fontsource/manrope/latin-500.css'
import '@fontsource/manrope/latin-ext-500.css'
import '@fontsource/manrope/latin-600.css'
import '@fontsource/manrope/latin-ext-600.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-ext-400.css'
import { App } from '@/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const boot = document.getElementById('boot')
const dropBoot = () => boot?.remove()
const watch = () => {
  if (document.querySelector('h1')) dropBoot()
  else requestAnimationFrame(watch)
}
requestAnimationFrame(watch)
