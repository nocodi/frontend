import { useState } from "react";
import Loading from "../Loading";
import LogViewer from "./LogViewer";
import { useBotLogs } from "./useBotLogs";

export default function LogContainerBtn({ botId }: { botId: number }) {
  const [isLogViewerOpen, setLogViewerOpen] = useState(false);

  const { logs, loading, setLoading, refreshLogs, clearLogs } = useBotLogs(
    botId,
    isLogViewerOpen,
  );

  const openLogViewer = () => {
    setLoading(true);
    clearLogs();
    setLogViewerOpen(true);
  };

  const closeLogViewer = () => {
    setLogViewerOpen(false);
    clearLogs();
  };

  return (
    <div className="text-center">
      <button
        onClick={openLogViewer}
        className="group btn relative overflow-hidden btn-primary hover:btn-primary"
        disabled={loading}
      >
        <div className="flex items-center gap-2">
          {loading ?
            <Loading size={20} />
          : <span className="font-medium">View Logs</span>}
        </div>
      </button>

      {isLogViewerOpen && (
        <LogViewer
          logs={logs}
          onClose={closeLogViewer}
          isLoading={loading}
          onClear={clearLogs}
          onRefresh={refreshLogs}
        />
      )}
    </div>
  );
}
