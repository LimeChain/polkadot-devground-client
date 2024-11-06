import { lazy } from 'react';

import { LayoutBasic } from '@components/layouts/basic';
import { LayoutCodeEditor } from '@components/layouts/codeEditor';

const Home = lazy(() => import('../views/home'));
const CodeEditor = lazy(() => import('../views/codeEditor'));
const CodePreview = lazy(() => import('../views/codePreview'));
const Callback = lazy(() => import('../components/login/callback'));
const BlockDetails = lazy(() => import('../views/blockDetails'));
const Explorer = lazy(() => import('../views/explorer'));
const SignedExtrinsics = lazy(() => import('../views/signedExtrinsics'));
const Forks = lazy(() => import('../views/forks'));
const Extrinsics = lazy(() => import('../views/extrinsics'));
const ChainState = lazy(() => import('../views/chainState'));
const Constants = lazy(() => import('../views/constants'));
const RuntimeCalls = lazy(() => import('../views/runtimeCalls'));
const Onboarding = lazy(() => import('../views/onboarding'));
const LatestBlocks = lazy(() => import('../views/latestBlocks'));
const Decoder = lazy(() => import('../views/decoder'));
const DecoderDynamic = lazy(() => import('../views/decoderDynamic'));
const RpcCalls = lazy(() => import('../views/rpcCalls'));
const NotFound = lazy(() => import('../views/notFound'));

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
          {
            path: 'onboarding',
            element: <Onboarding />,
          },
          {
            path: 'login-callback',
            element: <Callback />,
          },
          {
            path: 'extrinsics',
            element: <Extrinsics />,
          },
          {
            path: 'chain-state',
            element: <ChainState />,
          },
          {
            path: 'constants',
            element: <Constants />,
          },
          {
            path: 'runtime-calls',
            element: <RuntimeCalls />,
          },
          {
            path: 'rpc-calls',
            element: <RpcCalls />,
          },
          {
            path: 'decoder',
            element: <Decoder />,
          },
          {
            path: 'decoder-dynamic',
            element: <DecoderDynamic />,
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
        path: 'explorer',
        element: <LayoutBasic hasFooter />,
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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
