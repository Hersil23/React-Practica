import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BroswerRouter, Routes, Route, } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <App />
  </StrictMode>,
)
