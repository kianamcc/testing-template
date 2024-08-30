import React from 'react'
import { createRoot } from 'react-dom/client'
import App from 'portals-base/App'
import palette from './config/paletteConfig'
import routes from './config/routesConfig'
import footerConfig from './config/footerConfig'
import logoHeaderConfig from './config/logoHeaderConfig'
import logoFooterConfig from './config/logoFooterConfig'
import headerConfig from './config/headerConfig'

// KaTeX CSS is not included in the SRC style bundle since it includes many large font files.
import 'katex/dist/katex.css'

import './App.scss'

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
  <React.StrictMode>
    <App
      portalName={import.meta.env.VITE_PORTAL_NAME}
      palette={palette}
      routeConfig={routes}
      headerConfig={headerConfig}
      footerConfig={footerConfig}
      logoHeaderConfig={logoHeaderConfig}
      logoFooterConfig={logoFooterConfig}
    />
  </React.StrictMode>,
)
