import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import api from "../../services/api";

export function useBotLogs(botId: number, isOpen: boolean) {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isMounted = true;

    const fetchLogs = async () => {
      try {
        const response = await api.get(`/bot/${botId}/log`);
        if (isMounted && response.status === 200) {
          setLogs(String(response.data.logs) || "");
        }
      } catch (error: unknown) {
        if (isMounted) {
          let errorMessage = "An unknown error occurred.";
          if (isAxiosError(error)) {
            errorMessage = error.response?.data?.message || error.message;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          setLogs(
            `--- ERROR: ${errorMessage} ---\n${new Date().toISOString()}`,
          );
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
  }, [isOpen, botId]);

  const refreshLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/bot/${botId}/log`);
      if (response.status === 200) {
        setLogs(String(response.data.logs) || "");
      }
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setLogs(`--- ERROR: ${errorMessage} ---\n${new Date().toISOString()}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs("");
  };

  return {
    logs,
    loading,
    setLoading,
    refreshLogs,
    clearLogs,
  };
}
