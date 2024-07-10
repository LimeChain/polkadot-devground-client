import { lazy } from 'react';

import { LayoutBasic } from '@components/layouts/basic';
import { LayoutCodeEditor } from '@components/layouts/codeEditor';
import { NotFound } from '@views/notFound';

const Home = lazy(() => import('../views/home'));
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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
