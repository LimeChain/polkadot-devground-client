import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';

export const Logo = () => {
  return (
    <PDLink
      to="/"
      className="-mt-2 text-current hover:text-current"
    >
      <Icon name="logo-devground" size={[128, 40]} />
    </PDLink>
  );
};
