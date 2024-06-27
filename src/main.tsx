import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import 'virtual:svg-icons-register';

import './workers/monaco-worker';
import { ReloadPrompt } from '@components/reloadPrompt';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <>
      <App />
      <ReloadPrompt />
    </>
  </React.StrictMode>,
);
