import { createRoot } from 'react-dom/client';
import {
  Helmet,
  HelmetProvider,
} from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import { ReactPortal } from '@components/reactPortal';
import { StoreSizeViewer } from '@components/storeSizeViewer';

import { App } from './app';

import './assets/fonts/fonts.css';
import './assets/workers/monaco-worker';
import './assets/styles/index.css';
import './services/axiosSetup';

createRoot(document.getElementById('pd-root')!).render(
  <HelmetProvider>
    <Helmet
      defaultTitle="Polkadot devGround"
      titleTemplate="%s - Polkadot devGround"
    />
    <App />
    <StoreSizeViewer />
    <ReactPortal id="pd-extras">
      <Toaster
        toastOptions={{
          className: 'pd-toast',
          duration: 2000,
        }}
      />
    </ReactPortal>
  </HelmetProvider>,
);
