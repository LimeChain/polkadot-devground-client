export const STORAGE_CACHE_NAME = 'polkadot-devground-ide-cache';
export const STORAGE_PREFIX = 'tmp-example-index';
export const STORAGE_PREFIX_CONSOLE_OUTPUT = `${STORAGE_PREFIX}-console-output`;

export const iframeConsole = `
  class CustomLogger {
    constructor() {
      this.webSockets = new Set();
      this.fetchControllers = new Set();
    }

    log(...args) {
      this._logMessage('log', ...args);
    }

    info(...args) {
      this._logMessage('info', ...args);
    }

    warn(...args) {
      this._logMessage('warn', ...args);
    }

    error(...args) {
      this._logMessage('error', ...args);
    }

    _logMessage(type, ...args) {
      const serializedArgs = args.map(arg => {
        if (typeof arg === "bigint") {
          return arg.toString();
        }
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, (key, value) => {
              return typeof value === 'bigint' ? value.toString() : value;
            });
          } catch (e) {
            return '[Object]';
          }
        }
        return arg;
      });
      window.parent.postMessage({ type: 'customLog', args: serializedArgs }, '*');
    }
  }

  const logger = new CustomLogger();
  console.log = (...args) => {
    logger.log(...args);
  };

  console.info = (...args) => {
    logger.info(...args);
  };

  console.warn = (...args) => {
    logger.warn(...args);
  };

  console.error = (...args) => {
    logger.error(...args);
  };
`;

export const iframeImports = `
  import { ApiPromise, WsProvider } from 'https://cdn.jsdelivr.net/npm/@polkadot/api@11.3.1/+esm';
  import { createClient } from 'https://cdn.jsdelivr.net/npm/polkadot-api@0.9.0/+esm'
  import { getSmProvider } from 'https://cdn.jsdelivr.net/npm/polkadot-api@0.9.0/sm-provider/+esm';
  import { start } from 'https://cdn.jsdelivr.net/npm/polkadot-api@0.9.0/smoldot/+esm';
  import { WebSocketProvider } from 'https://cdn.jsdelivr.net/npm/polkadot-api@0.9.0/ws-provider/web/+esm';
  import { startFromWorker } from 'https://cdn.jsdelivr.net/npm/polkadot-api@0.9.0/smoldot/from-worker/+esm';

  import { getPolkadotSigner } from 'https://cdn.jsdelivr.net/npm/@polkadot-api/signer@0.0.1/+esm';
  import { DEV_PHRASE, entropyToMiniSecret, mnemonicToEntropy, ss58Address } from 'https://cdn.jsdelivr.net/npm/@polkadot-labs/hdkd-helpers@0.0.6/+esm';
  import { sr25519CreateDerive } from 'https://cdn.jsdelivr.net/npm/@polkadot-labs/hdkd@0.0.6/+esm';
  import { getInjectedExtensions, connectInjectedExtension } from "https://cdn.jsdelivr.net/npm/@polkadot-api/pjs-signer@0.2.0/+esm";

  const papiDescriptors = window.parent.papiDescriptors;
  window.injectedWeb3 = window.parent.injectedWeb3;
`;
