import { useState, useEffect } from "react";
import api from "../services/api";

export default function CodeGeneration({ botId }: { botId: number }) {
  const [generatedCode, setGeneratedCode] = useState("");

  useEffect(() => {
    api
      .get(`/bot/${botId}/generate-code`)
      .then((response) => {
        setGeneratedCode(response.data.code);
      })
      .catch((error) => {
        console.error("Error fetching code:", error);
      });
  }, [botId]);

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "generated-code.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 text-center">
      <button
        className="btn-patina btn text-patina-500 btn-outline hover:bg-patina-700"
        onClick={handleDownload}
        disabled={!generatedCode}
      >
        Download
      </button>
    </div>
  );
}
