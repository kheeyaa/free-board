type PencilButtonProps = {
  isActive: boolean;
  onClick: () => void;
};

export default function PencilButton({ isActive, onClick }: PencilButtonProps) {
  return (
    <button type="button" className="block text-4xl" onClick={onClick}>
      🖍
    </button>
  );
}
