import { useCallback } from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';

import ChainSelectButton from '@components/chainSelectButton';
import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';
import { Button } from '@components/ui';
import { useStoreUI } from '@stores';
import { useTheme } from '@utils/hooks/useTheme';
import { snippets } from '@views/codeEditor/snippets';

export const Header = () => {

  const loginWithGithub = useCallback(() => {

    const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const githubApiUrl = import.meta.env.VITE_GITHUB_API_URL;
    window.location.assign(githubApiUrl + githubClientId + '&scope=user:email%20gist');
  }, []);

  const uploadSnippet = useCallback(() => {

    const uploadSnippet = async () => {

      const jwt = localStorage.getItem('jwt');
      if (!jwt) {
        return;
      }

      const snippet = snippets[0].code;
      const files = {
        'snippet.tsx': {
          content: snippet,
        },
        'package.json': {
          content: 'snippet2 content',
        },
        'readme.txt': {
          content: 'readme content',
        },
      };
  
      const res = await fetch('http://localhost:3000/gists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          description: 'Snippet description',
          files,
          publicGist: true,
        }),
      });
      console.log('res', res);
    };

    void uploadSnippet();

  }, []);

  const { isDarkTheme, changeTheme } = useTheme();
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  const handleChangeTheme = useCallback(async () => {
    await changeTheme(isDarkTheme ? 'light' : 'dark');
  }, [isDarkTheme, changeTheme]);

  return (
    <div className="flex items-center justify-between px-6 ">
      <div className="flex items-center gap-12">
        <Link
          to="/"
          className="-mt-2 text-current hover:text-current"
        >
          <Icon name="logo-polkadot" size={[128, 40]} />
        </Link>
      </div>
      <div className="flex gap-5">
        {!isHomePage && <ChainSelectButton/> }
        <button
          type="button"
          onClick={handleChangeTheme}
          className={cn(
            'navSpacer',
            { 'ml-5 ': !isHomePage },
            { 'before:content-none': isHomePage },
          )}
        >
      {localStorage.getItem('jwt') ? <Button onClick={uploadSnippet}>Upload snippet</Button> : <Button onClick={loginWithGithub}>Login with Github</Button>}
      <div className="flex">
        <button type="button" onClick={handleChangeTheme}>
          <Icon
            name={isDarkTheme ? 'icon-lightMode' : 'icon-darkMode'}
            size={[24]}
            className="text-dev-black-600 dark:text-dev-purple-100"
          />
        </button>
      </div>
    </div>
  );
};

Header.displayName = 'Header';
