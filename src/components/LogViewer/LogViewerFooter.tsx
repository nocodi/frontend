type LogViewerFooterProps = {
  logs: string;
};

export default function LogViewerFooter({ logs }: LogViewerFooterProps) {
  return (
    <div className="flex items-center justify-between rounded-b-lg border-t border-base-300 bg-base-200 px-4 py-2 text-sm text-base-content/70">
      <span>Lines: {logs.split("\n").length - 1}</span>
      <span>Auto-refresh every 5 seconds</span>
    </div>
  );
}
