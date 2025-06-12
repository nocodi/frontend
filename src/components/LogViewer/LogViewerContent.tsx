import { useEffect, useRef } from "react";

interface LogViewerContentProps {
  logs: string;
  autoScroll: boolean;
  onScroll: () => void;
}

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
    <div className="flex-grow overflow-hidden bg-base-100 p-4">
      <div className="h-full rounded-lg border border-base-content/10 bg-base-300">
        <pre
          ref={logDisplayRef}
          onScroll={onScroll}
          className="h-full overflow-auto px-6 py-4 font-mono text-sm leading-relaxed whitespace-pre-wrap text-base-content"
          style={{
            backgroundColor: "#1a1a1a",
            color: "#00ff00",
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            textAlign: "left",
          }}
        >
          {logs || (
            <span className="text-base-content/50 italic">
              No logs available. Logs will appear here when available...
            </span>
          )}
        </pre>
      </div>
    </div>
  );
}
