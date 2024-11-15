import { cn } from '@utils/helpers';

interface LoaderProps {
  classNames?: string;
}
export const Loader = (props: LoaderProps) => {
  const { classNames } = props;
  return (
    <div className={cn('ball', classNames)} />
  );
};

Loader.displayName = 'Loader';
