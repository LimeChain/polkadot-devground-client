import React from 'react';
import { createRoot } from 'react-dom/client';

import { ReloadPrompt } from '@components/reloadPrompt';

import App from './App';

import './workers/monaco-worker';
import 'virtual:svg-icons-register';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <App />
      <ReloadPrompt />
    </>
  </React.StrictMode>,
);
