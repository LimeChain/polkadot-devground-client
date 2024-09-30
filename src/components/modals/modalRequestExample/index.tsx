import { useState } from 'react';

import { cn } from '@utils/helpers';

import {
  type IModal,
  Modal,
} from '../modal';

interface IModalGithubLogin extends Pick<IModal, 'onClose'> {}

export const ModalRequestExample = ({ onClose }: IModalGithubLogin) => {
  const [exampleName, setExampleName] = useState('');
  const [description, setDescription] = useState('');

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
      <h5 className="self-start font-h5-bold">Request Example</h5>

      <div className="flex flex-col">
        <input
          className={cn(
            'mb-6 p-4',
            'border border-dev-white-900',
            'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
            'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
          )}
          placeholder="Enter Example Name"
          value={exampleName}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(e) => setExampleName(e.target.value)}
        />
        <textarea
          className={cn(
            'mb-6 p-4',
            'border border-dev-white-900',
            'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
            'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
          )}
          placeholder="Enter Description"
          value={description}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className={cn(
            'mb-2 mt-6 p-4 transition-colors',
            'font-geist text-white font-body2-bold',
            'bg-dev-pink-500',
            'hover:bg-dev-pink-400',
          )}
        >
          Submit
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