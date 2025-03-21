import {
  useCallback,
  useRef,
} from 'react';
import { toast } from 'react-hot-toast';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';
import { useStoreCustomExamples } from 'src/stores/examples';

interface CreateExampleProps {
  code: string;
  handleClose: () => void;
}

export const CreateExample = (props: CreateExampleProps) => {
  const { code, handleClose } = props;
  const { createExample } = useStoreCustomExamples.use.actions();
  const { isCreatingExample } = useStoreCustomExamples.use.loading();

  const exampleNameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const exampleName = exampleNameRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!exampleName || !description) {
      toast.error('Please fill all fields');
      return;
    }

    createExample({
      exampleName,
      description,
      code,
    });
  }, [
    code,
    createExample,
  ]);

  return (
    <div className="flex flex-col p-6">
      <h2 className="mb-10 font-body1-bold">Create Example</h2>
      <input
        ref={exampleNameRef}
        placeholder="Enter Example Name"
        className={cn(
          'mb-6 border border-dev-white-900 bg-transparent p-4',
          'caret-dev-pink-500 focus-visible:outline-none',
          'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
          'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
        )}
      />
      <textarea
        ref={descriptionRef}
        placeholder="Enter Description"
        rows={5}
        className={cn(
          'mb-6 border border-dev-white-900 bg-transparent p-4',
          'caret-dev-pink-500 focus-visible:outline-none',
          'placeholder:text-dev-black-1000 placeholder:font-body2-regular',
          'dark:border-dev-purple-700 dark:bg-transparent dark:placeholder:text-white',
        )}
      />
      <button
        disabled={isCreatingExample}
        onClick={handleSubmit}
        className={cn(
          'mb-2 mt-6 flex justify-center p-4 font-geist text-white transition-colors font-body2-bold',
          'bg-dev-pink-500 hover:bg-dev-pink-400',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      >
        {
          isCreatingExample
            ? (
              <Icon
                className="animate-spin"
                name="icon-loader"
              />
            )
            : (
              'Create'
            )
        }
      </button>
      <button
        onClick={handleClose}
        className={cn(
          'p-4 font-geist transition-colors font-body2-bold hover:text-dev-white-1000',
        )}
      >
        Cancel
      </button>
    </div>
  );
};
