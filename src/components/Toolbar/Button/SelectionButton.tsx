type SelectionButtonProps = {
  isActive: boolean;
  onClick: () => void;
};

export default function SelectionButton({
  isActive,
  onClick,
}: SelectionButtonProps) {
  return (
    <button type="button" className="block text-4xl" onClick={onClick}>
      👆🏻
    </button>
  );
}
