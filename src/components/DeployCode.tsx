import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Loading from "./Loading";

export default function DeployCode({ botId }: { botId: number }) {
  const [loading, setLoading] = useState(false);

  const handleDeploy = () => {
    setLoading(true);
    api
      .get(`/bot/${botId}/deploy`)
      .then((response) => {
        if (response.status === 202) {
          toast(response.data.message);
        }
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
        onClick={handleDeploy}
        disabled={loading}
      >
        {loading ?
          <Loading size={30} />
        : <p className="text-secondary-content">Deploy</p>}
      </button>
    </div>
  );
}
