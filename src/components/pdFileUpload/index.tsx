import { Binary } from 'polkadot-api';
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  cn,
  formatNumber,
} from '@utils/helpers';

import type { InvocationOnChangeProps } from '@components/invocationArgsMapper/types';

interface IPDFileUpload extends InvocationOnChangeProps {}

export const PDFileUpload = ({ onChange }: IPDFileUpload) => {
  const refInput = useRef<HTMLLabelElement>(null);
  const inputId = crypto.randomUUID();
  const [
    fileUploaded,
    setFileUploaded,
  ] = useState<File | undefined>(undefined);

  const handleFileUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (file) {
      setFileUploaded(file);

      const buffer = await file.arrayBuffer();
      const val = Binary.fromBytes(new Uint8Array(buffer));
      onChange(val);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleFileDrop = async (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files.item(0);

      if (file) {
        setFileUploaded(file);

        const buffer = await file.arrayBuffer();
        const val = Binary.fromBytes(new Uint8Array(buffer));
        onChange(val);
      }
    };

    const handleFileDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const element = refInput?.current;

    if (refInput) {
      element?.addEventListener('drop', handleFileDrop);
      element?.addEventListener('dragover', handleFileDragOver);
    }

    return () => {
      element?.removeEventListener('drop', handleFileDrop);
      element?.removeEventListener('dragover', handleFileDragOver);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <label
      ref={refInput}
      htmlFor={inputId}
      className={cn(
        'flex w-full cursor-pointer flex-col items-center justify-center gap-3',
        'border border-dev-purple-300 dark:border-dev-purple-700',
        'px-6 py-12',
      )}
    >
      <span className="font-body2-regular">
        {
          fileUploaded
            ? `${fileUploaded.name}${fileUploaded.type} (${formatNumber(fileUploaded.size) || 0} bytes)`
            : 'Drop your file here'
        }
      </span>
      <button
        className="pointer-events-none bg-dev-pink-500 px-10 py-2 text-dev-white-200 font-body2-bold"
        type="button"
      >
        Upload file
      </button>
      <input
        className="hidden"
        id={inputId}
        onChange={handleFileUpload}
        type="file"
      />
    </label>
  );
};
