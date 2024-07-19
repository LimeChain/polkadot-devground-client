import { lazy } from 'react';

import { LayoutBasic } from '@components/layouts/basic';
import { LayoutCodeEditor } from '@components/layouts/codeEditor';
import { NotFound } from '@views/notFound';

const Home = lazy(() => import('../views/home'));
const CodeEditor = lazy(() => import('../views/codeEditor'));
const Callback = lazy(() => import('../components/login/callback'));
const BlockDetails = lazy(() => import('../views/blockDetails'));
const Explorer = lazy(() => import('../views/explorer'));

export const routes = () => ([
  {
    path: '/*',
    children: [
      {
        path: '',
        element: <LayoutBasic hasFooter />,
        children: [
          {
            path: '',
            element: <Home />,
          },
        ],
      },
      {
        path: 'code',
        element: <LayoutCodeEditor />,
        children: [
          {
            path: '',
            element: <CodeEditor />,
          },
        ],
      },
      {
        path: 'login-callback',
        element: <LayoutBasic hasFooter />,
        children: [
          {
            path: '',
            element: <Callback />,
          },
        ],
      },
      {
        path: 'explorer',
        element: <LayoutBasic hasFooter classNames="lg:pb-8" />,
        children: [
          {
            path: '',
            element: <Explorer />,
          },
          {
            path: 'block-details/:blockId',
            element: <BlockDetails />,
          },
        ],
      },

      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
