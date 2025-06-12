import { useState } from "react";
import Loading from "./Loading";
import LogViewer from "./LogViewer/LogViewer";
import { useBotLogs } from "../hooks/useBotLogs";

export default function LogContainer({ botId }: { botId: number }) {
  const [isLogViewerOpen, setLogViewerOpen] = useState(false);

  const { logs, loading, setLoading, refreshLogs, clearLogs, setLogs } =
    useBotLogs(botId, isLogViewerOpen);

  const openLogViewer = () => {
    setLoading(true);
    setLogs("");
    setLogViewerOpen(true);
  };

  const closeLogViewer = () => {
    setLogViewerOpen(false);
    setLogs("");
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
          : <>
              <span className="text-lg">📋</span>
              <span className="font-medium">View Logs</span>
            </>
          }
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
