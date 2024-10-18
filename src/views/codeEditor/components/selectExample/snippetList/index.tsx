import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

export const SnippetList = (props) => {
  const { snippets, type, handleChangeExample } = props;

  return (
    <PDScrollArea
      verticalScrollClassNames="py-4"
      verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
    >
      <ul className="max-h-56 ">
        {
          snippets?.map((snippet) => (
            <li
              key={snippet.id}
            >
              <button
                data-example-index={snippet.id}
                data-example-type={type}
                onClick={handleChangeExample}
                className={cn(
                  'flex w-full items-center justify-between',
                  'px-4 py-3.5',
                  'transition-[background] duration-300',
                  'hover:bg-dev-black-900 hover:dark:bg-dev-purple-200',
                  // {
                  //   ['bg-dev-black-800 dark:bg-dev-purple-300']: selectedSnippet === snippet.id.toString(),
                  // },
                )}
              >
                <p className="font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000">
                  {snippet.name}
                </p>
                <p className="font-geist text-dev-white-1000 font-body3-regular dark:text-dev-black-300">
                  CUSTOM
                </p>
              </button>
            </li>
          ))
        }
      </ul>
    </PDScrollArea>
  );
};
