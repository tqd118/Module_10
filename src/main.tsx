import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@/styles/normalize.css"
import "@/styles/index.scss"
import App from '@/app/App'
import { startMockingSocial } from '@sidekick-monorepo/internship-backend';

startMockingSocial("Module_10").then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
)});