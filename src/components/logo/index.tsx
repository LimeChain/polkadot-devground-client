import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';

export const Logo = () => {
  return (
    <PDLink
      className="-mt-2 text-current hover:text-current"
      to="/"
    >
      <Icon
        name="logo-devground"
        size={[
          128,
          40,
        ]}
      />
    </PDLink>
  );
};
