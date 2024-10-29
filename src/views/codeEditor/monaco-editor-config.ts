import * as monaco from 'monaco-editor';

// Define the custom theme
monaco.editor.defineTheme('dark-theme', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#151515',
  },
});

monaco.editor.defineTheme('light-theme', {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#E6EAF6',
  },
});

export const monacoEditorConfig: monaco.editor.IEditorOptions & monaco.editor.IGlobalEditorOptions = {
  automaticLayout: true,
  folding: true,
  inlayHints: {
    enabled: 'on',
  },
  tabSize: 1,
  guides: {
    bracketPairs: true,
    highlightActiveBracketPair: true,
    indentation: false, // Removes the yellow vertical lines
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
  fontFamily: '"FiraCode Nerd Font Mono", FiraCode, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
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
