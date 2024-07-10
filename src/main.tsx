import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Helmet,
  HelmetProvider,
} from 'react-helmet-async';

import { ReloadPrompt } from '@components/reloadPrompt';

import { App } from './app';

import './assets/fonts/fonts.css';
import './assets/workers/monaco-worker';
import 'virtual:svg-icons-register';

createRoot(document.getElementById('pd-root')!).render(
  // <React.StrictMode>
  <HelmetProvider>
    <Helmet defaultTitle="Polkadot Devground" titleTemplate="%s - Polkadot Devground" />
    <App />
    <ReloadPrompt />
  </HelmetProvider>,
  // </React.StrictMode>,
);
