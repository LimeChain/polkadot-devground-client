import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

const Button = ({ children }) => (
  <button
    className={cn(
      'px-2 py-2.5 hover:border-dev-pink-500',
      'text-dev-white-400 hover:text-dev-white-200 dark:text-dev-black-800 dark:hover:text-dev-black-1000',
      'border-b-2 border-b-transparent hover:border-b-dev-pink-500',
      'transform transition-colors duration-300 ease-in-out',
    )}
  >
    {children}
  </button>
);

const PDLinkItem = ({ to, title, subtitle }) => (
  <PDLink
    to={to}
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
      {subtitle}
    </p>
  </PDLink>
);

export const Results = ({ block, extrinsics }) => {

  return (
    <>
      {/* <div className="flex gap-2 border-b border-dev-purple-700 px-2 font-geist dark:border-dev-purple-300 dark:text-dev-black-800">
        <Button>All</Button>
        <Button>Blocks</Button>
        <Button>Extrinsics</Button>
      </div> */}
      <PDScrollArea
        className=""
        viewportClassNames="py-4"
        verticalScrollClassNames="py-4"
        verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
      >
        <div className="flex flex-col gap-4">
          {
            block && (
              <>
                <div className={cn(
                  'border-b p-1',
                  'font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000',
                )}
                >
                   Blocks
                </div>
                <PDLinkItem
                  to="/explorer/123123"
                  title="Example:"
                  subtitle={block}
                />
              </>
            )}

          {
            extrinsics && (
              <>
                <div className={cn(
                  'border-b p-1',
                  'font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000',
                )}
                >
                    Extrinsics ({extrinsics.length})
                </div>

                {extrinsics.map(extrinsic => (
                  <PDLinkItem
                    key={extrinsic}
                    to="/explorer/123123"
                    title="Example:"
                    subtitle="CUSTOM"
                  />
                ),
                )}

              </>
            )
          }
        </div>
      </PDScrollArea>
    </>
  );
};
