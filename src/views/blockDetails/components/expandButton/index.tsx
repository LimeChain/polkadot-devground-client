interface IExpandButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  itemType: 'extrinsics' | 'events';
  className: string;
}

const ExpandButton = (props: IExpandButtonProps) => {
  const {
    isExpanded,
    onToggle,
    itemType,
    className,
  } = props;

  return (
    <div className="flex justify-center">
      <button
        className={className}
        data-type={itemType}
        onClick={onToggle}
      >
        {isExpanded ? `Show Less` : `Show More`}
      </button>
    </div>
  );
};

export default ExpandButton;
