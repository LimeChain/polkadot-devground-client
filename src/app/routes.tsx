import { lazy } from 'react';

import { LayoutBasic } from '@components/layouts/basic';
import { LayoutCodeEditor } from '@components/layouts/codeEditor';
// import { App } from '@constants/snippets/snippet1';
import { NotFound } from '@views/notFound';

const Home = lazy(() => import('../views/home'));
const CodeEditor = lazy(() => import('../views/codeEditor'));
const CodePreview = lazy(() => import('../views/codePreview'));
const Callback = lazy(() => import('../components/login/callback'));
const BlockDetails = lazy(() => import('../views/blockDetails'));
const Explorer = lazy(() => import('../views/explorer'));
const Forks = lazy(() => import('../views/forks'));
const RpcCalls = lazy(() => import('../views/rpcCalls'));

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
            path: 'forks',
            element: <Forks />,
          },
        ],
      },
      // {
      //   path: 'test',
      //   element: <LayoutBasic hasFooter />,
      //   children: [
      //     {
      //       path: '',
      //       element: <App />,
      //     },
      //   ],
      // },
      {
        path: 'code',
        element: <LayoutCodeEditor />,
        children: [
          {
            path: '',
            element: <CodeEditor />,
          },
          {
            path: ':previewId',
            element: <CodePreview />,
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
            path: ':blockNumber',
            element: <BlockDetails />,
          },
        ],
      },
      {
        path: 'rpc-calls',
        element: <LayoutBasic hasFooter classNames="lg:pb-8" />,
        children: [
          {
            path: '',
            element: <RpcCalls />,
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
