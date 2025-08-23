import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Loading from "./Loading";

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
      .catch(() => {
        toast("Download Code failed, please check your components!!!");
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
          <Loading size={30} />
        : <p className="text-secondary-content">Download</p>}
      </button>
    </div>
  );
}
