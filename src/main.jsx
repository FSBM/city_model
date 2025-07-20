import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
// import { Logo } from '@pmndrs/branding'

createRoot(document.getElementById('root')).render(
  <>
    <App />
    {/* <Overlay /> */}
    {/* <Logo style={{ position: 'absolute', bottom: 40, left: 40, width: 30 }} /> */}
  </>
)
