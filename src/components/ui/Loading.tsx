export function Loading({ text = '載入中...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-text-secondary text-sm">{text}</p>
    </div>
  );
}
