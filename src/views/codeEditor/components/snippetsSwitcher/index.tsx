import { GithubButton } from '@components/githubButton';

import { SelectExample } from '../selectExample';

export const SnippetsSwitcher = () => {

  return (
    <div className="mb-4 flex w-full flex-wrap justify-between gap-x-4 self-end px-4">
      <SelectExample/>
      <GithubButton />
    </div>
  );
};

SnippetsSwitcher.displayName = 'SnippetsSwitcher';
