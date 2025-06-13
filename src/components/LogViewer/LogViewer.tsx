import { useState } from "react";
import LogViewerHeader from "./LogViewerHeader";
import LogViewerContent from "./LogViewerContent";
import LogViewerFooter from "./LogViewerFooter";

type LogViewerProps = {
  logs: string;
  onClose: () => void;
  isLoading: boolean;
  onClear: () => void;
  onRefresh: () => void;
};

export default function LogViewer({
  logs,
  onClose,
  isLoading,
  onClear,
  onRefresh,
}: LogViewerProps) {
  const [autoScroll, setAutoScroll] = useState(true);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(logs);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy logs:", err);
    }
  };

  const handleScroll = () => {
    const element = document.querySelector("pre");
    if (element) {
      const isAtBottom =
        element.scrollHeight - element.scrollTop <= element.clientHeight + 10;
      setAutoScroll(isAtBottom);
    }
  };

  return (
    <dialog className="modal-open modal">
      <div className="modal-box flex h-11/12 max-w-6xl flex-col p-0">
        <LogViewerHeader
          isLoading={isLoading}
          autoScroll={autoScroll}
          onRefresh={onRefresh}
          onClear={onClear}
          onCopyToClipboard={copyToClipboard}
          onAutoScrollChange={setAutoScroll}
          onClose={onClose}
        />

        <LogViewerContent
          logs={logs}
          autoScroll={autoScroll}
          onScroll={handleScroll}
        />

        <LogViewerFooter logs={logs} />
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}
