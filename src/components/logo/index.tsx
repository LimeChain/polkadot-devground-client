import { Icon } from '@components/icon';
import { PDLink } from '@components/ui/PDLink';

export const Logo = () => {
  return (
    <PDLink
      to="/"
      className="-mt-2 text-current hover:text-current"
    >
      <Icon name="logo-polkadot" size={[128, 40]} />
    </PDLink>
  );
};
