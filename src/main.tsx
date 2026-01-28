import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import MainMenu from './MainMenu/MainMenu.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainMenu />
  </StrictMode>,
)
