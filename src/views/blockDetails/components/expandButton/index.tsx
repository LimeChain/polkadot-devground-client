interface IExpandButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  itemType: 'extrinsics' | 'events';
}

const ExpandButton = (props: IExpandButtonProps) => {
  const { isExpanded, onToggle, itemType } = props;

  return (
    <div className="flex justify-center">
      <button
        className="font-geist font-body2-bold"
        data-type={itemType}
        onClick={onToggle}
      >
        {isExpanded ? `Show Less` : `Show More`}
      </button>
    </div>
  );
};

export default ExpandButton;
