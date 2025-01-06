import {
  useCallback,
  useMemo,
} from 'react';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

interface IPageHeader {
  title: string;
  location?: string;
  blockNumber?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader = (props: IPageHeader) => {
  const { title, location = -1, blockNumber, children, className } = props;
  const navigate = useNavigate();

  const currentLocation = useLocation();

  const categoryPages = useMemo(() => [
    '/chain-state',
    '/extrinsics',
    '/decoder',
    '/decoder-dynamic',
    '/rpc-calls',
    '/runtime-calls',
    '/constants',
  ], []);

  const goBack = useCallback(() => {
    if (categoryPages.includes(currentLocation.pathname)) {
      navigate('/');
    } else if (location === -1) {
      navigate(-1);
    } else {
      navigate(location);
    }
  }, [
    categoryPages,
    currentLocation.pathname,
    navigate,
    location,
  ]);

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="flex items-center">
        <div
          onClick={goBack}
          className={cn(
            'mr-8 cursor-pointer duration-300 ease-out',
            'bg-dev-purple-700 p-2 dark:bg-dev-purple-50',
            'hover:bg-dev-purple-900 hover:dark:bg-dev-purple-200',
          )}
        >
          <Icon
            className="text-dev-white-200 dark:text-dev-purple-700"
            name="icon-arrowLeft"
          />
        </div>
        <h4 className="mr-2 text-dev-black-300 font-h4-light dark:text-dev-purple-300">{title}</h4>
        {blockNumber && <h4 className="font-h4-bold">{blockNumber}</h4>}
      </div>
      {children && (
        <div className="flex items-center">
          {children}
        </div>
      )}
    </div>
  );
};
