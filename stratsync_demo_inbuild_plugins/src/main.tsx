import { createRoot } from 'react-dom/client'
import Popup from './popup/Popup'
import './index.css'

const container = document.getElementById('root')!
createRoot(container).render(<Popup />)
