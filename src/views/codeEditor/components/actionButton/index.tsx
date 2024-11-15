import { Icon } from '@components/icon';
import { ToolTip } from '@components/tooltTip';
import { cn } from '@utils/helpers';

interface ActionButtonProps {
  iconName: string;
  classes?: string;
  fill?: string;
  toolTip?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export const ActionButton = (props: ActionButtonProps) => {
  const { iconName, classes, toolTip, isLoading = false, disabled, onClick } = props;

  const button = (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        `p-2 transition-all`,
        'hover:bg-dev-purple-700 hover:text-dev-white-200',
        'dark:hover:bg-dev-purple-50 dark:hover:text-dev-black-1000',
        classes,
      )}
    >
      {
        isLoading
          ? (
            <Icon
              className="animate-spin duration-1000"
              name="icon-loader"
            />
          )
          : <Icon name={iconName} />
      }
    </button>
  );

  return toolTip
    ? <ToolTip text={toolTip}>{button}</ToolTip>
    : button;
};
