import {
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import type {
  FC,
  ReactNode,
} from 'react';

interface PortalProps {
  id: string;
  children: ReactNode;
}

export const ReactPortal: FC<PortalProps> = ({ id, children }) => {
  const [
    el,
    setEl,
  ] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const existingContainer = document.getElementById(id);
    const container = existingContainer || document.createElement('div');

    if (!existingContainer) {
      container.setAttribute('id', id);
      document.body.appendChild(container);
    }

    setEl(container);

    // Clean up on unmount
    return () => {
      if (!existingContainer && container.parentNode === document.body) {
        document.body.removeChild(container);
      }
      setEl(null);
    };
  }, [id]);

  return el ? createPortal(children, el) : null;
};

ReactPortal.displayName = 'ReactPortal';
