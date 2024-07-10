import { lazy } from 'react';

import { LayoutBasic } from '@components/layouts/basic';
import { NotFound } from '@views/notFound';

const Home = lazy(() => import('../views/home'));
const HomeV2 = lazy(() => import('../views/home-v2'));
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
