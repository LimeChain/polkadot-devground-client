import { Icon } from '@components/icon';
import { useStoreAuth } from '@stores';
import { cn } from '@utils/helpers';

const NotFound = () => {
  const isAuthenticated = useStoreAuth.use.jwtToken?.();
  const { authorize } = useStoreAuth.use.actions();

  return (
    <>
      {
        isAuthenticated
          ? (
            <div className="flex flex-col">
              <Icon
                name="icon-Group"
                size={[128]}
                className={cn(
                  'mb-8',
                  'self-center text-dev-white-1000',
                  'dark:text-dev-purple-50',
                )}
              />
              <div className="flex flex-col items-center justify-center">
                <h4 className="mb-4 self-center font-h4-bold">Nothing here</h4>
                <p className="max-w-80 text-center font-geist">
                  Currently, you don't have any custom examples created. Ready to create one?
                </p>
                <button
                  className={cn(
                    'mb-2 mt-6 w-full p-4 transition-colors',
                    'font-geist text-white font-body2-bold',
                    'bg-dev-pink-500',
                    'hover:bg-dev-pink-400',
                  )}
                >
                  Create Example
                </button>
              </div>
            </div>
          )
          : (
            <div className="flex flex-col">
              <Icon
                name={isAuthenticated ? 'icon-Group' : 'logo-github'}
                size={[128]}
                className={cn(
                  'mb-8',
                  'self-center text-dev-white-1000',
                  'dark:text-dev-purple-50',
                )}
              />
              <div className="flex flex-col items-center justify-center">
                <h4 className="mb-4 self-center font-h4-bold">Please Log in</h4>
                <p className="max-w-80 text-center font-geist">
                  To access your custom examples, please log in using your GitHub account.
                </p>
                <button
                  onClick={authorize}
                  className={cn(
                    'mb-2 mt-6 w-full p-4 transition-colors',
                    'font-geist text-white font-body2-bold',
                    'bg-dev-pink-500',
                    'hover:bg-dev-pink-400',
                  )}
                >
                  Log in
                </button>
              </div>
            </div>
          )
      }
    </>
  );
};

export default NotFound;
