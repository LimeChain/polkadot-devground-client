import { useLocation } from 'react-router-dom';

import { PDLink } from '@components/ui/PDLink';

export const Navigation = () => {
  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return null;
  }

  return (
    <div>
      <PDLink
        to="/explorer"
        className="-mt-2 text-current hover:text-current"
      >
        <span> Explore </span>
      </PDLink>
    </div>
  );
};
