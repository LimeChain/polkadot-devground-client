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

interface IPDFileUpload {
  onChange: (args: unknown) => void;
}

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
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files.item(0);

      if (file) {
        setFileUploaded(file);

        const buffer = await file.arrayBuffer();
        const val = Binary.fromBytes(new Uint8Array(buffer));
        onChange(val);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const element = refInput?.current;

    if (refInput) {
      element?.addEventListener('drop', handleDrop);
      element?.addEventListener('dragover', handleDragOver);
    }

    return () => {
      element?.removeEventListener('drop', handleDrop);
      element?.removeEventListener('dragover', handleDragOver);
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
