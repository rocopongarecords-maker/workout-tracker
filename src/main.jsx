import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Restore theme and font from localStorage before render to prevent flash
const savedTheme = localStorage.getItem('wt-theme');
if (savedTheme && savedTheme !== 'ocean') {
  document.documentElement.setAttribute('data-theme', savedTheme);
}
const savedFont = localStorage.getItem('wt-font');
if (savedFont) {
  const fonts = {
    inter: "'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif",
    jakarta: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
    system: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  };
  if (fonts[savedFont]) {
    document.documentElement.style.setProperty('--font-family', fonts[savedFont]);
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)