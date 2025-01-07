import { useEffect } from 'react';

import { ReactPortal } from '@components/reactPortal';
import { cn } from '@utils/helpers';

import styles from './styles.module.css';

import type React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position: 'right' | 'left' | 'top' | 'bottom';
}

export const PDDrawer = ({
  isOpen = false,
  onClose,
  children,
  position = 'right',
}: DrawerProps) => {

  const positionClasses = {
    right: 'right-0 top-0 h-full max-w-[90%]',
    left: 'left-0 top-0 h-full max-w-[90%]',
    top: 'top-0 w-full left-0 max-h-[90%]',
    bottom: 'bottom-0 w-full left-0 max-h-[90%]',
  };

  const transformClasses = {
    right: isOpen ? 'translate-x-0' : 'translate-x-full',
    left: isOpen ? 'translate-x-0' : '-translate-x-full',
    top: isOpen ? 'translate-y-0' : '-translate-y-full',
    bottom: isOpen ? 'translate-y-0' : 'translate-y-full',
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.document.addEventListener('keydown', handleEscape);

    return () => {
      window.document.removeEventListener('keydown', handleEscape);
    };

  }, [onClose]);

  return (
    <ReactPortal id="pd-extras">
      {/* Backdrop */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className={cn(
            'fixed inset-0 z-[999] bg-black bg-opacity-50 transition-opacity',
            {
              'opacity-100': isOpen,
              'pointer-events-none opacity-0': !isOpen,
            },
          )}
        />
      )}

      {/* Drawer */}
      <div
        aria-modal="true"
        role="dialog"
        className={cn(`
          fixed z-[999] overflow-y-auto
          shadow-xl transition-transform duration-300 ease-in-out
          ${styles.drawer}
          ${positionClasses[position]}
          ${transformClasses[position]}
        `)}
      >
        {children}
      </div>
    </ReactPortal>
  );
};
