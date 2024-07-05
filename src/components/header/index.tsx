import {
  useCallback,
  useEffect,
} from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@components/icon';
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

  const initStoreUI = useStoreUI.use.init?.();
  const {
    resetStore: resetStoreUI,
    countIncrement,
    countDecrement,
  } = useStoreUI.use.actions();

  const count = useStoreUI.use.count?.();

  useEffect(() => {
    initStoreUI();

    return () => {
      resetStoreUI();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeTheme = useCallback(async () => {
    await changeTheme(isDarkTheme ? 'light' : 'dark');
  }, [isDarkTheme, changeTheme]);

  return (
    <div className="flex items-center justify-between px-6 py-4">
      <Link to="/" className="text-current hover:text-current">
        <Icon name="logo-polkadot" size={[128, 40]} />
      </Link>
      <div>
        <button type="button" onClick={countDecrement}>
          -
        </button>
        <span className="mx-4 text-xl">
          {count}
        </span>
        <button type="button" onClick={countIncrement}>
          +
        </button>
      </div>
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
