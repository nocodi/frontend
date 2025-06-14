import { useEffect, useRef } from "react";

type LogViewerContentProps = {
  logs: string;
  autoScroll: boolean;
  onScroll: () => void;
};

export default function LogViewerContent({
  logs,
  autoScroll,
  onScroll,
}: LogViewerContentProps) {
  const logDisplayRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (autoScroll) {
      const element = logDisplayRef.current;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [logs, autoScroll]);

  return (
    <pre
      ref={logDisplayRef}
      onScroll={onScroll}
      className="grow overflow-auto bg-[#1e1e1e] px-6 py-4 text-left font-mono text-sm leading-relaxed whitespace-pre-wrap text-[#0f0]"
    >
      {logs || (
        <span className="text-base-content/50 italic">
          No logs available. Logs will appear here when available...
        </span>
      )}
    </pre>
  );
}
