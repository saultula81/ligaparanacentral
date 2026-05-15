import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Registrar el Service Worker de la PWA inmediatamente
registerSW({ immediate: true })

console.log("React montando y PWA registrada...");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("No se encontro el elemento root en el HTML");
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
