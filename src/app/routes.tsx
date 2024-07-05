import { lazy } from 'react';

import { LayoutBasic } from '@components/layouts/basic';
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
            element: <></>,
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
