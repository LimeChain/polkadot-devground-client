import { Icon } from '@components/icon';
import { useAuthStore } from '@stores';
import { cn } from '@utils/helpers';

export const GithubButton = () => {

  const { authorize, logout } = useAuthStore.use.actions();
  const isAuthenticated = useAuthStore.use.jwtToken();
  const authIsLoading = useAuthStore.use.jwtTokenIsLoading();

  return (
    <button
      type="button"
      disabled={authIsLoading}
      onClick={isAuthenticated ? logout : authorize}
      className={cn(
        'flex cursor-pointer items-center gap-1',
        'disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      <Icon name="icon-github" />
      {
        isAuthenticated
          ? 'Logout'
          : 'Login'
      }
    </button>
  );
};
