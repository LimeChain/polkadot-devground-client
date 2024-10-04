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
  const authIsLoading = useStoreAuth.use.jwtTokenIsLoading?.();
  const isAuthenticated = useStoreAuth.use.jwtToken?.();

  return (
    <div className="mb-4 flex h-16 items-center">
      <button
        disabled={authIsLoading}
        onClick={isAuthenticated ? logout : toggleVisibility}
        type="button"
        className={cn(
          'flex cursor-pointer items-center gap-1',
          'ml-auto',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'font-geist font-body1-bold',
        )}
      >
        <Icon name="logo-github" />
        {
          isAuthenticated
            ? 'Logout'
            : 'Login'
        }
      </button>
      <GithubModal onClose={toggleVisibility} />
    </div>
  );
};
