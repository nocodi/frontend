import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export default function CodeGeneration({ botId }: { botId: number }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);
    api
      .get(`/bot/${botId}/generate-code`)
      .then((response) => {
        const blob = new Blob([response.data], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "bot-generated-code.py";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        toast(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="text-center">
      <button
        className="btn-patina btn w-25 bg-primary text-primary btn-outline hover:bg-primary"
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ?
          <svg
            className="my-auto h-6 w-6 animate-spin text-base-content"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        : <p className="text-secondary-content">Download</p>}
      </button>
    </div>
  );
}
