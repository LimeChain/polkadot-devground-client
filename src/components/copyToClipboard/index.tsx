import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import type {
  ReactElement,
  ReactNode,
} from 'react';

interface ICopyToClipboardProps {
  text: string;
  toastMessage?: string;
  children: (props: { ClipboardIcon: ReactNode; onClick: (e: React.MouseEvent) => void }) => ReactElement;
  onCopy?: (success: boolean, text: string) => void;
  showToast?: boolean;
  className?: string;
}

export const CopyToClipboard = memo((props: ICopyToClipboardProps) => {
  const {
    text,
    toastMessage,
    showToast = true,
    children,
    onCopy,
    className,
  } = props;

  const refTimeout = useRef<NodeJS.Timeout>();

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      refTimeout.current = setTimeout(() => setIsCopied(false), 2000);
      return () => {
        clearTimeout(refTimeout?.current);
      };
    }
  }, [isCopied]);

  const copyToClipboard = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const toastId = 'copy-to-clipboard';
    toast.dismiss(toastId);

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      onCopy?.(true, text);

      if (showToast && !!toastMessage?.length) {
        toast.loading('Copying...', { id: toastId });
        toast.success(<span>Copied <strong>{toastMessage}</strong> to clipboard</span>, { id: toastId });
      }
    } catch (err) {
      onCopy?.(false, text);
      if (showToast) {
        toast.error('Oops. Something went wrong', { id: toastId });
      }
    }
  }, [text, onCopy, showToast, toastMessage]);

  const ClipboardIcon = useMemo(() => {
    return (
      <span
        onClick={copyToClipboard}
        className={cn(
          'z-10',
          'flex items-center justify-center',
          'hover:text-dev-pink-400',
          'transition-colors duration-200 ease-in-out',
          'cursor-pointer',
          className,
        )}
      >
        <Icon
          name={`icon-${isCopied ? 'check' : 'clipboard'}`}
          className={cn(
            'mx-2',
            {
              ['text-green-500']: isCopied,
            },
          )}
          size={[14]}
        />
      </span>
    );
  }, [className, copyToClipboard, isCopied]);

  return children({
    ClipboardIcon,
    onClick: copyToClipboard,
  });
});
