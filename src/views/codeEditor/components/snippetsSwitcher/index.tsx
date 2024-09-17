import { GithubButton } from '@components/githubButton';

import { SelectExample } from '../selectExample';

export const SnippetsSwitcher = () => {
  return (
    <div className="flex flex-wrap justify-between gap-x-4">
      <SelectExample/>
      <GithubButton />
    </div>
  );
};

SnippetsSwitcher.displayName = 'SnippetsSwitcher';
