import axios from 'axios';
import { useCallback } from 'react';
import {
  Link,
  useLocation,
} from 'react-router-dom';

import ChainSelectButton from '@components/chainSelectButton';
import { Icon } from '@components/icon';
import { Button } from '@components/ui';
import { useAuthStore } from '@stores/auth';
import { cn } from '@utils/helpers';
import { useTheme } from '@utils/hooks/useTheme';
import { snippets } from '@views/codeEditor/snippets';

export const Header = () => {
  const jwtToken = useAuthStore.use.jwtToken();
  const { logout, authorize, refreshToken } = useAuthStore.use.actions();
  console.log(jwtToken);

  const uploadSnippet = useCallback(() => {
    const uploadSnippet = async () => {

      if (!jwtToken) {
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

      const body = {
        description: 'Snippet description',
        files,
        publicGist: true,
      };
      const response = await axios.post(`http://localhost:3000/gists`, body, { withCredentials: true });

      console.log('response', response);
    };

    void uploadSnippet();

  }, [jwtToken]);

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
        />
        {
          jwtToken
            ? (
              <>
                <Button onClick={logout}>
                  Logout
                </Button>
                <Button onClick={uploadSnippet}>
                  Upload
                </Button>
              </>
            )
            : (
              <Button onClick={authorize}>
                Login with Github
              </Button>
            )
        }
        <Button onClick={refreshToken}>Refresh token</Button>
      </div>
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
