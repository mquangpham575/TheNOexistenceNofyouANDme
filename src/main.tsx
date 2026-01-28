import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/styles/index.css'
import MainMenu from './features/main-menu/routes/MainMenu.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainMenu />
  </StrictMode>,
)
