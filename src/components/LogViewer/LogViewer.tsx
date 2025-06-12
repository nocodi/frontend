import { useState } from "react";
import LogViewerHeader from "./LogViewerHeader";
import LogViewerContent from "./LogViewerContent";
import LogViewerFooter from "./LogViewerFooter";

interface LogViewerProps {
  logs: string;
  onClose: () => void;
  isLoading: boolean;
  onClear: () => void;
  onRefresh: () => void;
}

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
    <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm">
      <div className="flex h-5/6 w-5/6 max-w-6xl flex-col rounded-lg border border-base-300 bg-base-100 shadow-2xl">
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
    </div>
  );
}
