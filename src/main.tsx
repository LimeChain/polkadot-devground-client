import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  Helmet,
  HelmetProvider,
} from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import { ReactPortal } from '@components/reactPortal';
import { ReloadPrompt } from '@components/reloadPrompt';

import { App } from './app';

import './assets/fonts/fonts.css';
import './assets/workers/monaco-worker';
import 'virtual:svg-icons-register';

import './assets/styles/index.css';

createRoot(document.getElementById('pd-root')!).render(
  <HelmetProvider>
    <Helmet defaultTitle="Polkadot Devground" titleTemplate="%s - Polkadot Devground" />
    <App />
    <ReactPortal id="pd-extras">
      <Toaster
        toastOptions={{
          className: 'pd-toast',
          duration: 2000,
        }}
      />
      <ReloadPrompt />
    </ReactPortal>
  </HelmetProvider>,
);
