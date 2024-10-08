import { Icon } from '@components/icon';
import { ToolTip } from '@components/tooltTip';
import { cn } from '@utils/helpers';

interface ActionButtonProps {
  iconName: string;
  onClick?: () => void;
  classes?: string;
  fill?: string;
  toolTip?: string;
}

export const ActionButton = (props: ActionButtonProps) => {
  const { iconName, onClick, classes, toolTip } = props;

  const button = (
    <button
      onClick={onClick}
      className={cn(
        `p-2 transition-all`,
        'hover:bg-dev-purple-700 hover:text-dev-white-200',
        'dark:hover:bg-dev-purple-50 dark:hover:text-dev-black-1000',
        classes,
      )}
    >
      <Icon name={iconName} />
    </button>
  );

  return toolTip
    ? <ToolTip text={toolTip}>{button}</ToolTip>
    : button;
};
