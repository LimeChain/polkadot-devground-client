import type { editor } from 'monaco-editor';

export const monacoEditorConfig: editor.IEditorOptions & editor.IGlobalEditorOptions = {
  inlayHints: {
    enabled: 'on',
  },
  tabSize: 2,
  guides: {
    bracketPairs: true,
    highlightActiveBracketPair: true,
  },
  hover: {
    delay: 100,
  },
  unicodeHighlight: {
    ambiguousCharacters: false,
  },
  bracketPairColorization: {
    enabled: true,
    independentColorPoolPerBracketType: true,
  },
  find: {
    addExtraSpaceOnTop: false,
    seedSearchStringFromSelection: 'never',
  },
  padding: {
    top: 14,
  },
  contextmenu: false,
  wordWrap: 'on',
  smoothScrolling: true,
  stickyTabStops: true,
  fontLigatures: true,
  fontSize: 14,
  fontFamily:
    '"FiraCode Nerd Font Mono", FiraCode, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  quickSuggestions: false,
  minimap: {
    enabled: false,
  },
  autoClosingBrackets: 'always',
  autoClosingComments: 'always',
  autoIndent: 'advanced',
  autoClosingDelete: 'always',
  autoClosingQuotes: 'always',
  autoDetectHighContrast: true,
  autoClosingOvertype: 'always',
} as const;
