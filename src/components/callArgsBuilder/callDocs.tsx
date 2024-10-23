import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

interface ICallDocs {
  docs: string[];
  className?: string;
}

export const CallDocs = ({
  docs,
  className,
}: ICallDocs) => {

  if (docs.length <= 0) {
    return null;
  }

  return (
    <div className={cn(
      'p-3 font-body1-regular',
      'grid grid-cols-[24px_1fr] gap-2',
      'bg-dev-black-800 dark:bg-dev-purple-300',
      'border border-dev-purple-700 dark:border-dev-purple-200',
      'text-dev-purple-50 dark:text-dev-black-1000',
      className,
    )}
    >
      <Icon
        name="icon-info"
        size={[24]}
      />
      <div className="flex flex-col gap-2">
        {
          docs?.map((doc, i) => (
            <p key={`doc-${i}`}>
              {doc}
            </p>
          ))
        }
      </div>
    </div>
  );
};
