import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import { LayoutBasic } from '@components/layouts/basic';
import { NotFound } from '@views/notFound';

// const Home = lazy(() => import('../views/home'));
const CodeEditor = lazy(() => import('../views/codeEditor'));

export const routes = () => ([
  {
    path: '/*',
    children: [
      {
        path: '',
        element: <Navigate to="code" replace />,
        // element: <Home />,
      },
      {
        path: 'code',
        element: <LayoutBasic />,
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
