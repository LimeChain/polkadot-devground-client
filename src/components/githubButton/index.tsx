import { Icon } from '@components/icon';
import { useStoreAuth } from '@stores';
import { cn } from '@utils/helpers';

export const GithubButton = () => {

  const { authorize, logout } = useStoreAuth.use.actions();
  const isAuthenticated = useStoreAuth.use.jwtToken();
  const authIsLoading = useStoreAuth.use.jwtTokenIsLoading();

  return (
    <button
      type="button"
      disabled={authIsLoading}
      onClick={isAuthenticated ? logout : authorize}
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
  );
};
