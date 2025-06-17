import { ClipboardCopy, RefreshCcw, Trash2Icon, X } from "lucide-react";
import Loading from "../Loading";

type LogViewerHeaderProps = {
  isLoading: boolean;
  autoScroll: boolean;
  onRefresh: () => void;
  onClear: () => void;
  onCopyToClipboard: () => void;
  onAutoScrollChange: (checked: boolean) => void;
  onClose: () => void;
};

export default function LogViewerHeader({
  isLoading,
  autoScroll,
  onRefresh,
  onClear,
  onCopyToClipboard,
  onAutoScrollChange,
  onClose,
}: LogViewerHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-t-lg border-b border-base-300 bg-base-200 p-4">
      <div className="ml-3 flex items-center gap-4">
        <h2 className="text-xl font-bold text-base-content">Bot Logs (Live)</h2>
        {isLoading && <Loading size={20} />}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="tooltip btn tooltip-bottom btn-ghost btn-sm"
          data-tip="Refresh"
          disabled={isLoading}
        >
          <RefreshCcw />
        </button>
        <button
          onClick={onClear}
          className="tooltip btn tooltip-bottom btn-ghost btn-sm"
          data-tip="Clear logs"
        >
          <Trash2Icon />
        </button>
        <button
          onClick={onCopyToClipboard}
          className="tooltip btn tooltip-bottom btn-ghost btn-sm"
          data-tip="Copy to clipboard"
        >
          <ClipboardCopy />
        </button>
        <div className="divider divider-horizontal"></div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="checkbox checkbox-sm checkbox-primary"
            checked={autoScroll}
            onChange={(e) => onAutoScrollChange(e.target.checked)}
          />
          Auto-scroll
        </label>
        <button
          onClick={onClose}
          className="btn text-xl font-bold btn-ghost btn-sm hover:btn-error"
          aria-label="Close"
        >
          <X />
        </button>
      </div>
    </div>
  );
}
