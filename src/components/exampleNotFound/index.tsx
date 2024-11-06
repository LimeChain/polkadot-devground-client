import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { useStoreAuth } from '@stores';
import { cn } from '@utils/helpers';

interface ExampleNotFoundProps {
  classes?: string;
  iconClasses?: string;
  textClasses?: string;
  onClick?: () => void;
}

export const ExampleNotFound = (props: ExampleNotFoundProps) => {
  const { classes, iconClasses, textClasses, onClick } = props;
  const isAuthenticated = useStoreAuth.use.jwtToken?.();
  const { authorize } = useStoreAuth.use.actions();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col">
        <Icon
          name="logo-github"
          size={[128]}
          className={cn(
            'mb-8',
            'self-center text-dev-white-1000',
            'dark:text-dev-purple-50',
            iconClasses,
          )}
        />
        <div className={cn(
          'flex flex-col items-center justify-center',
          textClasses,
        )}
        >
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
    );
  }

  return (
    <div className={cn(
      'flex flex-col',
      classes,
    )}
    >
      <Icon
        name="icon-group"
        size={[128]}
        className={cn(
          'mb-8',
          'self-center text-dev-white-1000',
          'dark:text-dev-purple-50',
          iconClasses,
        )}
      />
      <div className={cn(
        'flex flex-col items-center justify-center',
        textClasses,
      )}
      >
        <h4 className="mb-4 self-center font-h4-bold">Nothing here</h4>
        <p className="max-w-80 text-center font-geist">
          Currently, you don't have any custom examples created. Ready to create one?
        </p>

        {
          onClick
            ? (
              <button
                onClick={onClick}
                className={cn(
                  'mb-2 mt-6 w-full p-4 transition-colors',
                  'font-geist text-white font-body2-bold',
                  'bg-dev-pink-500',
                  'hover:bg-dev-pink-400',
                )}
              >
                Create Example
              </button>
            )
            : (
              <PDLink to="/code?d=1">
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
              </PDLink>
            )
        }

      </div>
    </div>
  );
};
