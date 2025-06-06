import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { isAxiosError } from "axios";

const Loading = ({ size }: { size: number }) => (
  <div
    style={{ width: size, height: size }}
    className="animate-spin rounded-full border-4 border-primary border-t-transparent"
  />
);

interface LogViewerProps {
  logs: string;
  onClose: () => void;
}

function LogViewer({ logs, onClose }: LogViewerProps) {
  const logDisplayRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    const element = logDisplayRef.current;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex h-3/4 w-3/4 max-w-4xl flex-col rounded-lg bg-base-300 shadow-xl">
        <div className="flex items-center justify-between rounded-t-lg border-b bg-base-300 p-4">
          <h2 className="text-lg font-semibold text-primary">
            Bot Logs (Live)
          </h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-primary hover:text-gray-800"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="flex-grow overflow-hidden rounded-b-lg bg-base-300 p-4 font-mono text-sm text-primary">
          <pre
            ref={logDisplayRef}
            className="h-full overflow-y-auto whitespace-pre-wrap"
          >
            {logs}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function LogContainer({ botId }: { botId: number }) {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string>("");
  const [isLogViewerOpen, setLogViewerOpen] = useState(false);

  useEffect(() => {
    if (!isLogViewerOpen) {
      return;
    }

    let isMounted = true;

    const fetchLogs = async () => {
      try {
        const response = await api.get(`/bot/${botId}/log`);
        if (isMounted && response.status === 200) {
          setLogs((prevLogs) => prevLogs + String(response.data.logs) + "\n");
        }
      } catch (error: unknown) {
        if (isMounted) {
          let errorMessage = "An unknown error occurred.";
          if (isAxiosError(error)) {
            errorMessage = error.response?.data?.message || error.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          setLogs((prevLogs) => prevLogs + `--- ERROR: ${errorMessage} ---\n`);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchLogs();

    const intervalId = setInterval(() => {
      void fetchLogs();
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [isLogViewerOpen, botId]);

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
        className="btn-patina btn w-25 bg-primary text-primary btn-outline hover:bg-primary"
        disabled={loading}
      >
        {loading ?
          <Loading size={30} />
        : <p className="text-secondary-content">Log</p>}
      </button>

      {isLogViewerOpen && <LogViewer logs={logs} onClose={closeLogViewer} />}
    </div>
  );
}
