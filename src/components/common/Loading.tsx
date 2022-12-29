export default function Loading() {
  return (
    <div className="fixed z-50 top-0 left-0 w-full h-screen backdrop-blur-sm bg-black/10 flex justify-center items-center">
      <div className="animate-pulse text-white text-5xl">🚀 Loading ... 🚀</div>
    </div>
  );
}
