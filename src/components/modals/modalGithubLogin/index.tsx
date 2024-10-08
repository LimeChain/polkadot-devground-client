import { Icon } from '@components/icon';
import { useStoreAuth } from '@stores';
import { cn } from '@utils/helpers';

import {
  type IModal,
  Modal,
} from '../modal';

interface IModalGithubLogin extends Pick<IModal, 'onClose'> {}

export const ModalGithubLogin = ({ onClose }: IModalGithubLogin) => {
  const { authorize } = useStoreAuth.use.actions();

  return (
    <Modal
      onClose={onClose}
      className={cn(
        'w-96',
        'flex flex-col gap-10 p-6',
        'border border-dev-purple-300',
        'dark:border-dev-purple-700',
      )}
    >
      <h5 className="self-start font-h5-bold">Log in</h5>
      <Icon
        name="logo-github"
        size={[96]}
        className={cn(
          'self-center text-dev-white-1000',
          'dark:text-dev-purple-50',
        )}
      />
      <div className="flex flex-col">
        <h4 className="mb-4 self-center font-h4-bold">Please Log in</h4>
        <p className="text-center font-geist font-body1-regular">
          To access your custom examples, please log in using your GitHub account.
        </p>
        <button
          onClick={authorize}
          className={cn(
            'mb-2 mt-6 p-4 transition-colors',
            'font-geist text-white font-body2-bold',
            'bg-dev-pink-500',
            'hover:bg-dev-pink-400',
          )}
        >
          Log in
        </button>
        <button
          onClick={onClose}
          className={cn(
            'p-4 transition-colors',
            'font-geist font-body2-bold',
            'hover:text-dev-white-1000',
          )}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};
