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
    <>
      <button
        type="button"
        disabled={authIsLoading}
        onClick={isAuthenticated ? logout : toggleVisibility}
        className={cn(
          'flex cursor-pointer items-center gap-1',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'font-geist text-body1-bold',
        )}
      >
        <Icon name="icon-github" />
        {
          isAuthenticated
            ? 'Logout'
            : 'Login'
        }
      </button>
      <GithubModal onClose={toggleVisibility} />
    </>
  );
};
