import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { useCallback } from 'react';

import { Icon } from '@components/icon';
import { ModalGithubLogin } from '@components/modals/modalGithubLogin';
import { useStoreAuth } from '@stores';
import { cn } from '@utils/helpers';
import { useStoreCustomExamples } from 'src/stores/examples';

export const GithubButton = () => {
  const [
    GithubModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalGithubLogin);

  const { logout } = useStoreAuth.use.actions();
  const { name, avatar } = useStoreAuth.use.user();
  const isAuthenticated = useStoreAuth.use.jwtToken?.();
  const { resetStore } = useStoreCustomExamples.use.actions();

  const handleLogout = useCallback(async () => {
    resetStore();
    await logout();
  }, [
    logout,
    resetStore,
  ]);
  return (
    <div className="mb-4 flex h-16 items-center">
      {
        isAuthenticated
          ? (
            <div className={cn(
              'flex h-12 items-center gap-4',
              'ml-auto',
              'font-geist font-body1-bold',
            )}
            >
              <div className="flex items-center gap-2.5">
                <img
                  alt="avatar"
                  className="size-8 rounded-full"
                  src={avatar}
                />
                {name.length > 14 ? `${name.slice(0, 10)}..` : name}
              </div>
              <button
                className="flex items-center gap-4 duration-200 hover:text-dev-pink-500"
                onClick={handleLogout}
              >
                <Icon
                  name="icon-logout"
                  size={[22]}
                />
              </button>
            </div>
          )
          : (
            <button
              onClick={toggleVisibility}
              type="button"
              className={cn(
                'flex h-12 cursor-pointer items-center gap-1',
                'ml-auto',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'font-geist font-body1-bold',
                'relative',
                'after:absolute after:bottom-0 after:left-0 after:content-[""]',
                'after:h-[2px] after:w-full after:bg-dev-pink-500',
                'after:opacity-0 after:transition-opacity hover:after:opacity-100',
              )}
            >
              <Icon name="logo-github" />
              Login
            </button>
          )
      }

      <GithubModal onClose={toggleVisibility} />
    </div>
  );
};
