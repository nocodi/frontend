import { useParams, useNavigate, Link } from "react-router-dom";
import DnDFlow from "../components/DndFlow";
import { createContext, useContext, useState } from "react";
import CodeGeneration from "../components/CodeGeneration";
import Loading from "../components/Loading";
import { Check } from "lucide-react";

type loadingContextType = React.Dispatch<React.SetStateAction<boolean>>;

const loadingContext = createContext<loadingContextType>(() => {});

export const useLoading = () => {
  return useContext(loadingContext);
};

export type WorkflowParams = {
  botId: string;
};

function Workflow() {
  const { botId } = useParams<WorkflowParams>();
  const [loading, setLoading] = useState(false);
  return (
    <>
      {!botId || isNaN(Number(botId)) ?
        <div>Not a Number</div>
      : <div className="h-screen overflow-hidden">
          <div className="flex h-full w-full flex-col divide-y divide-white text-gray-800">
            <div className="h-15 shrink-0 bg-base-200 px-5">
              <div className="flex h-full items-center justify-between gap-3 text-primary">
                <Link to="/dashboard" className="btn btn-outline">
                  Back to Home
                </Link>
                <div className="flex items-center gap-3">
                  <div className="my-auto">
                    <CodeGeneration botId={Number(botId)} />
                  </div>
                  {loading ?
                    <Loading size={30} />
                     : <Check size={30} className="my-auto" />
                  }
                </div>
              </div>
            </div>
            <loadingContext.Provider value={setLoading}>
              <DnDFlow botId={Number(botId)} />
            </loadingContext.Provider>
          </div>
        </div>
      }
    </>
  );
}

export default Workflow;
