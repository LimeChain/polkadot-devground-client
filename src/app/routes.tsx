import { lazy } from 'react';

import { LayoutBasic } from '@components/layouts/basic';
import { NotFound } from '@views/notFound';

const Home = lazy(() => import('../views/home'));
const CodeEditor = lazy(() => import('../views/codeEditor'));
// const CodeEditorV2 = lazy(() => import('../../codeEditorV2'));

export const routes = () => ([
  {
    path: '/*',
    element: <LayoutBasic/>,
    children: [
      {
        path: '',
        // element: <Navigate to="code" replace />,
        element: <Home />,
      },
      {
        path: 'code',
        element: <CodeEditor />,
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
