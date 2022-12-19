type PostButtonProps = {
  isActive: boolean;
  onClick: () => void;
};

export default function PostButton({ isActive, onClick }: PostButtonProps) {
  return (
    <button type="button" className="block text-4xl" onClick={onClick}>
      📝
    </button>
  );
}
