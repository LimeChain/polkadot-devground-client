import type { IChain } from './chain';
import type {
  IConsoleMessage,
  IErrorItem,
} from './global';

export interface IEventBusDemoCodeIndex {
  type: '@@-example-code-index';
  data: number;
}

export interface IEventBusDemoCode {
  type: '@@-example-code';
  data: string;
}

export interface IEventBusConsoleMessage {
  type: '@@-console-message';
  data: IConsoleMessage[];
}

export interface IEventBusErrorItem {
  type: '@@-problems-message';
  data: IErrorItem[];
}

export interface IEventBusConsoleMessageReset {
  type: '@@-console-message-reset';
}

export interface IEventBusIframeDestroy {
  type: '@@-iframe-destroy';
}

export interface IEventBusSetChain {
  type: '@@-set-chain';
  data: IChain;
}
export interface IEventBusSearchChain {
  type: '@@-search-chain';
  data: string;
}
export interface IEventBusCodeEditorTypesProgress {
  type: '@@-code-editor-types-progress';
  data: number;
}
