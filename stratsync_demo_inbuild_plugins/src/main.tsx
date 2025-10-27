import React from 'react'
import { createRoot } from 'react-dom/client'
import Popup from './popup/Popup'
import './styles.css'

const container = document.getElementById('root')!
createRoot(container).render(<Popup />)
