
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Explicitly create root with React 18 API
const container = document.getElementById('root')
if (!container) throw new Error('Root element not found')
const root = createRoot(container)

// Wrap the App component with React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
