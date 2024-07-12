import { useEventBus } from '@pivanov/event-bus';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@utils/helpers';

import type { IEventBusMonacoEditorTypesProgress } from '@custom-types/eventBus';

interface IProgressProps {
  size?: number;
  classNames?: string;
}

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const Progress = (props: IProgressProps) => {
  const {
    size = 30,
    classNames,
  } = props;

  const refTimeout = useRef<NodeJS.Timeout>();
  const refStrokeDashoffset = useRef((100) * (size * Math.PI) / 100);
  const [progress, setProgress] = useState(0);

  useEventBus<IEventBusMonacoEditorTypesProgress>('@@-monaco-editor-types-progress', async ({ data }) => {
    const timeout = data * getRandomNumber(data / 10, (data / 10) + 4);
    setTimeout(() => {
      refStrokeDashoffset.current = (100 - data) * (size * Math.PI) / 100;
      setProgress(data);
      if (data === 100) {
        clearTimeout(refTimeout.current);
        refTimeout.current = setTimeout(() => {
          setProgress(0);
        }, 500);
      }
    }, timeout);
  });

  useEffect(() => {
    const timer = refTimeout.current;
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const fontSize = size * 0.20;

  return (
    <div
      className={cn(
        `w-[${size}px] h-[${size}px]`,
        'transition-opacity duration-500',
        {
          ['opacity-0 delay-500']: progress === 0 || progress === 100,
        },
        classNames,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="size-full"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          fill="none"
          className="dark:dev-purple-700 stroke-current text-dev-purple-300 dark:text-dev-purple-700"
          strokeWidth="1"
        />
        <g className="origin-center -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            fill="none"
            className="stroke-current text-blue-600 transition-[stroke-dashoffset] duration-300 dark:text-dev-purple-400"
            strokeWidth="3"
            strokeDasharray={`${size * Math.PI - 4}`}
            strokeDashoffset={refStrokeDashoffset.current}
          />
        </g>
      </svg>

      {
        size > 30 && (
          <span
            className={cn(
              'absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'text-center font-bold text-gray-800 dark:text-white',
            )}
            style={{
              fontSize,
            }}
          >
            {progress}%
          </span>
        )
      }
    </div>
  );
};
