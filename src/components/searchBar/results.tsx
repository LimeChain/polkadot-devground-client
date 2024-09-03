import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

const Button = ({ children }) => (
  <button
    className={cn(
      'px-2 py-2.5 font-body2-regular hover:border-dev-pink-500',
      'text-dev-white-400 hover:text-dev-white-200 dark:text-dev-black-800 dark:hover:text-dev-black-1000',
      'border-b-2 border-b-transparent hover:border-b-dev-pink-500',
      'duration-300 ease-in',
    )}
  >
    {children}
  </button>
);

export const Results = ({ blockNumber, extrinsics = [], classNames }) => (
  <div className={cn(
    'absolute top-40 z-50 w-96 p-2',
    'bg-dev-black-1000 dark:bg-dev-purple-50',
    'pointer-events-none -translate-y-2',
    classNames,
  )}
  >
    {/* <div className="mb-4 flex gap-2 border-b border-dev-purple-700 px-2 font-geist dark:border-dev-purple-300 dark:text-dev-black-800">
      <Button>All</Button>
      <Button>Blocks</Button>
      <Button>Extrinsics</Button>
    </div> */}
    <PDScrollArea
      verticalScrollClassNames="py-4"
      verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
    >
      <div className="flex flex-col gap-4">
        {blockNumber && (
          <>
            <div className={cn(
              'border-b p-1',
              'font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000',
            )}
            >
              Blocks
            </div>
            <PDLink
              to={`/explorer/${blockNumber}`}
              className={cn(
                'flex w-full items-center',
                'px-4 py-3.5',
                'transition-[background] duration-300',
                'hover:bg-dev-black-900 hover:dark:bg-dev-purple-200',
              )}
            >
              <p className="font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000">
                Block#
              </p>
              <p className="font-geist text-dev-white-1000 font-body1-bold dark:text-dev-black-300">
                {blockNumber}
              </p>
            </PDLink>
          </>
        )}

        {extrinsics?.length > 0 && (
          <>
            <div className={cn(
              'border-b p-1',
              'font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000',
            )}
            >
              Extrinsics ({extrinsics?.length})
            </div>

            {extrinsics.map(({ id }) => (
              <div
                key={id}
                className={cn(
                  'flex w-full items-center',
                  'px-4 py-3.5',
                  'transition-[background] duration-300',
                  'hover:bg-dev-black-900 hover:dark:bg-dev-purple-200',
                )}
              >
                <p className="font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000">
                  Extrinsic# {id}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </PDScrollArea>
  </div>
);
