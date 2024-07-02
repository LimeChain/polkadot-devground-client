import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

import { LayoutBasic } from '@components/layouts/basic';
import { NotFound } from '@views/notFound';

// const Home = lazy(() => import('../views/home'));
const CodeEditor = lazy(() => import('../views/codeEditor'));
// const CodeEditorV2 = lazy(() => import('../../codeEditorV2'));

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
      // {
      //   path: 'code-v2',
      //   element: <LayoutBasic />,
      //   children: [
      //     {
      //       path: '',
      //       element: <CodeEditorV2 />,
      //     },
      //   ],
      // },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
