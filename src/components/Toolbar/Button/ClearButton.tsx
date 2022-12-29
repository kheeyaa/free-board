type ClearButtonProps = {
  isActive: boolean;
  onClick: () => void;
};

export default function ClearButton({ isActive, onClick }: ClearButtonProps) {
  return (
    <button type="button" className="block text-4xl" onClick={onClick}>
      🧹
    </button>
  );
}
