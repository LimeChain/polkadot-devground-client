import { lazy } from 'react';

import { LayoutBasic } from '@components/layouts/basic';
import { LayoutCodeEditor } from '@components/layouts/codeEditor';
import Callback from '@components/login/callback';
import { NotFound } from '@views/notFound';

const Home = lazy(() => import('../views/home'));
const CodeEditor = lazy(() => import('../views/codeEditor'));
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
        element: <LayoutBasic hasFooter />,
        children: [
          {
            path: '',
            element: <Explorer />,
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
