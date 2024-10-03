import { lazy } from 'react';

import { LayoutBasic } from '@components/layouts/basic';
import { LayoutCodeEditor } from '@components/layouts/codeEditor';
import LatestBlocks from '@views/latestBlocks';
import { NotFound } from '@views/notFound';
import { RpcCalls } from '@views/rpcCalls';
import Decoder from '@views/decode';
import DecoderDynamic from '@views/decodeDynamic';

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
        element: <LayoutBasic
          classNames="lg:pb-8"
          hasFooter
        />,
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
        path: 'chain-state',
        element: <LayoutBasic
          classNames="lg:pb-8"
          hasFooter
        />,
        children: [
          {
            path: '',
            element: <ChainState />,
          },
        ],
      },
      {
        path: 'constants',
        element: <LayoutBasic
          classNames="lg:pb-8"
          hasFooter
        />,
        children: [
          {
            path: '',
            element: <Constants />,
          },
        ],
      },
      {
        path: 'runtime-calls',
        element: <LayoutBasic
          classNames="lg:pb-8"
          hasFooter
        />,
        children: [
          {
            path: '',
            element: <RuntimeCalls />,
          },
        ],
      },
      {
        path: 'rpc-calls',
        element: <LayoutBasic
          classNames="lg:pb-8"
          hasFooter
        />,
        children: [
          {
            path: '',
            element: <RpcCalls />,
          },
        ],
      },
      {
        path: 'extrinsics',
        element: <LayoutBasic
          classNames="lg:pb-8"
          hasFooter
        />,
        children: [
          {
            path: '',
            element: <Extrinsics />,
          },
        ],
      },
      {
        path: 'decoder',
        element: <LayoutBasic
          classNames="lg:pb-8"
          hasFooter
        />,
        children: [
          {
            path: '',
            element: <Decoder />,
          },
        ],
      },
      {
        path: 'decoder-dynamic',
        element: <LayoutBasic
          classNames="lg:pb-8"
          hasFooter
        />,
        children: [
          {
            path: '',
            element: <DecoderDynamic />,
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
