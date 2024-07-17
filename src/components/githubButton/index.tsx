import { useToggleVisibility } from '@pivanov/use-toggle-visibility';

import { Icon } from '@components/icon';
import { Modal } from '@components/modals/modal';
import { useStoreAuth } from '@stores';
import { cn } from '@utils/helpers';

export const GithubButton = () => {
  const [
    GithubModal,
    toggleVisibility,
  ] = useToggleVisibility(Modal);

  const { authorize, logout } = useStoreAuth.use.actions();
  const authIsLoading = useStoreAuth.use.jwtTokenIsLoading();
  const isAuthenticated = useStoreAuth.use.jwtToken();

  return (
    <>
      <button
        type="button"
        disabled={authIsLoading}
        onClick={isAuthenticated ? logout : toggleVisibility}
        className={cn(
          'flex cursor-pointer items-center gap-1',
          'disabled:cursor-not-allowedx disabled:opacity-50',
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

      <GithubModal
        onClose={toggleVisibility}
        className={cn(
          'h-[468px] w-[352px]',
          'flex flex-col gap-10  p-6',
          'border border-indigo-600',
        )}
      >
        <h5 className="self-start text-h5-bold">Log in</h5>
        <Icon
          name="icon-github"
          className="self-center"
          size={[96]}
        />
        <div className="flex flex-col" >
          <h4 className="mb-4 self-center text-h4-bold">Please Log in</h4>
          <p className="text-center font-geist text-body1-regular">To access your custom examples, please log in using your GitHub account.</p>
          <button onClick={authorize} className="my-6 h-[56px] bg-dev-pink-500 hover:bg-dev-pink-400" >
            <p className="text-body2-bold text-dev-white-200">Log in</p>
          </button>
          <p
            onClick={toggleVisibility}
            className={cn(
              'cursor-pointer self-center text-body2-regular hover:text-dev-white-1000',
            )}
          >Cancel
          </p>
        </div>
      </GithubModal>
    </>
  );
};
