import type { TChain } from './chain';
import type {
  IConsoleMessage,
  IErrorItem,
} from './global';
import type * as monaco from 'monaco-editor';

export interface IEventBusStoreSize {
  type: '@@-store-size';
}

export interface IEventBusMonacoEditorShowPreview {
  type: '@@-monaco-editor-show-preview';
  data: boolean;
}

export interface IEventBusMonacoEditorUpdateCode {
  type: '@@-monaco-editor-update-code';
  data: string;
}

export interface IEventBusMonacoEditorUpdateCursorPosition {
  type: '@@-monaco-editor-update-cursor-position';
  data: monaco.Position;
}

export interface IEventBusMonacoEditorExecuteSnippet {
  type: '@@-monaco-editor-execute-snippet';
  data: string;
}

export interface IEventBusMonacoEditorTypesProgress {
  type: '@@-monaco-editor-types-progress';
  data: number;
}

export interface IEventBusConsoleMessage {
  type: '@@-console-message';
  data: IConsoleMessage[];
}

export interface IEventBusConsoleMessageReset {
  type: '@@-console-message-reset';
}

export interface IEventBusErrorItem {
  type: '@@-problems-message';
  data: IErrorItem[];
}

export interface IEventBusIframeDestroy {
  type: '@@-iframe-destroy';
}

export interface IEventBusSetChain {
  type: '@@-set-chain';
  data: TChain;
}
export interface IEventBusSearchChain {
  type: '@@-search-chain';
  data: string;
}

export interface IEventBusForksReceiveUpdate {
  type: '@@-forks-receive-update';
  data: {
    canGoToStart: boolean;
    canGoToEnd: boolean;
    keepScrollToEnd: boolean;
  };
}
