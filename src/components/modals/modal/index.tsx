import { useEventBus } from '@pivanov/event-bus';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import type { IEventBusSetChain } from '@custom-types/eventBus';

export interface IModal {
  onClose : () => void;
  children:ReactNode;
  className?:string;
}

export const Modal = ({ onClose, children, className }:IModal) => {
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleTransitionEnd = useCallback(() => {
    if (!open) {
      onClose();
    } 
  }, [onClose, open]);

  useEffect(() => {
    setOpen(true);
    window.document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    });
    
  }, [handleClose]);

  useEventBus<IEventBusSetChain>('@@-set-chain', () => {
    handleClose();
  });

  return (
    <>
      <div
        onTransitionEnd={handleTransitionEnd}
        className={cn(
          'fixed left-0 top-0 z-[99] size-full cursor-pointer opacity-0 transition-opacity',
          'bg-dev-purple-50 dark:bg-dev-black-1000',
          { 'opacity-70': open }, 
        )}
        onClick={handleClose}
      />
      <div className={cn(
        'fixed left-1/2 top-32 z-[100] w-full -translate-x-1/2 opacity-0 transition-opacity',
        'shadow-[0_0_12px_0_#0000000F]',
        'bg-dev-white-200 dark:bg-dev-black-950',
        'max-h-[calc(100%-16px-8rem)]',
        'flex flex-col',
        { 'opacity-100': open }, className,
      )}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-6 top-6"
        >
          <Icon
            name="icon-close"
            size={[24]}
          />
        </button>
        {children}
      </div>
    </>
  );
  
};
