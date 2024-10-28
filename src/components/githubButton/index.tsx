import { useToggleVisibility } from '@pivanov/use-toggle-visibility';

import { Icon } from '@components/icon';
import { ModalGithubLogin } from '@components/modals/modalGithubLogin';
import { useStoreAuth } from '@stores';
import { cn } from '@utils/helpers';

export const GithubButton = () => {
  const [
    GithubModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalGithubLogin);

  const { logout } = useStoreAuth.use.actions();
  const { name, avatar } = useStoreAuth.use.user();
  const authIsLoading = useStoreAuth.use.jwtTokenIsLoading?.();
  const isAuthenticated = useStoreAuth.use.jwtToken?.();

  return (
    <div className="mb-4 flex h-16 items-center">
      <button
        disabled={authIsLoading}
        onClick={isAuthenticated ? logout : toggleVisibility}
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
        {
          isAuthenticated
            ? (
              <div className="flex h-12 cursor-pointer items-center gap-4">
                <img
                  alt="avatar"
                  className="size-8 rounded-full"
                  src={avatar}
                />
                <div className="flex items-center gap-1">
                  {name.length > 14 ? `${name.slice(0, 10)}..` : name}
                  <Icon name="icon-logout" />
                </div>
              </div>
            )
            : (
              <div className="flex h-12 cursor-pointer items-center gap-1">
                <Icon name="logo-github" />
                Login
              </div>
            )
        }
      </button>
      <GithubModal onClose={toggleVisibility} />
    </div>
  );
};
