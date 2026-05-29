import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WeatherAppWrapper from './wrapper.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WeatherAppWrapper>
      <App />
    </WeatherAppWrapper>
  </StrictMode>,
)
