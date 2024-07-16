import { useCallback } from 'react';

import { GithubButton } from '@components/githubButton';
import { Button } from '@components/ui';
import { snippets } from '@constants/snippets';

export const SnippetsSwitcher = () => {
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const snippetIndex = Number(e.currentTarget.getAttribute('data-snippet-index'));
    window.location.href = `/code?s=${snippetIndex}`;
  }, []);

  return (
    <div className="mb-4 flex flex-wrap gap-x-4 self-end px-4">
      {snippets.map((snippet) => (
        <Button
          key={snippet.id}
          onClick={handleClick}
          data-snippet-index={snippet.id}
        >
          Demo {snippet.id}
        </Button>
      ))}
      <GithubButton />
    </div>
  );
};

SnippetsSwitcher.displayName = 'SnippetsSwitcher';
