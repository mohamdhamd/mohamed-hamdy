import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// تحية فلكية برمجية لأي مطور يفتح كونسول المتصفح F12
console.log(
  `%c✦ Mohamed Hamdy | Web Developer ✦%c\nLooking for high-performance frontend systems and clean code?\nLet's connect: mohamed.hamdy.fawzy0@gmail.com\nGitHub: https://github.com/mohamedhamdy`,
  'color: #C9A227; font-size: 14px; font-weight: bold; background: #0C1226; padding: 6px 12px; border-radius: 6px; border: 1px solid #C9A227;',
  'color: #A4AFC4; font-size: 11px; padding-top: 4px;'
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
