import { lazy } from 'react';

import { LayoutBasic } from '@components/layouts/basic';
import Callback from '@components/login/callback';
import { NotFound } from '@views/notFound';

const Home = lazy(() => import('../views/home'));
const HomeV2 = lazy(() => import('../views/home-v2'));
const CodeEditor = lazy(() => import('../views/codeEditor'));

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
          {
            path: 'v2',
            element: <HomeV2 />,
          },
        ],
      },
      {
        path: 'code',
        element: <LayoutBasic hasFooter />,
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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
