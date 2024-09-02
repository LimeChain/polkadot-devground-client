import { lazy } from 'react';

import { LayoutBasic } from '@components/layouts/basic';
import { LayoutCodeEditor } from '@components/layouts/codeEditor';
import LatestBlocks from '@views/latestBlocks';
import { NotFound } from '@views/notFound';

const Home = lazy(() => import('../views/home'));
const CodeEditor = lazy(() => import('../views/codeEditor'));
const CodePreview = lazy(() => import('../views/codePreview'));
const Callback = lazy(() => import('../components/login/callback'));
const BlockDetails = lazy(() => import('../views/blockDetails'));
const Explorer = lazy(() => import('../views/explorer'));
const SignedExtrinsics = lazy(() => import('../views/signedExtrinsics'));
const Forks = lazy(() => import('../views/forks'));
const Extrinsics = lazy(() => import('../views/Extrinsics'));
const ChainState = lazy(() => import('../views/ChainState'));

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
            path: 'latest-blocks',
            element: <LatestBlocks />,
          },
          {
            path: ':blockNumber',
            element: <BlockDetails />,
          },
          {
            path: 'extrinsics',
            element: <SignedExtrinsics />,
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
        path: 'chain-state',
        element: <LayoutBasic hasFooter classNames="lg:pb-8" />,
        children: [
          {
            path: '',
            element: <ChainState />,
          },
        ],
      },
      {
        path: 'extrinsics',
        element: <LayoutBasic hasFooter classNames="lg:pb-8" />,
        children: [
          {
            path: '',
            element: <Extrinsics />,
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
