import { Check, Undo2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import CodeGeneration from "../components/CodeGeneration";
import DeployCode from "../components/DeployCode";
import DnDFlow from "../components/Flow";
import Loading from "../components/Loading";
import { useIsFetching } from "@tanstack/react-query";

export type loadingContextType = React.Dispatch<React.SetStateAction<boolean>>;
const loadingContext = createContext<loadingContextType>(() => {});

export const useLoading = () => {
  return useContext(loadingContext);
};

export type WorkflowParams = {
  botId: string;
};

const DEPLOY_TUTORIAL_KEY = "hasSeenDeployTutorial";
const CODE_GEN_TUTORIAL_KEY = "hasSeenCodeGenTutorial";

function Workflow() {
  const { botId } = useParams<WorkflowParams>();
  const [loading, setLoading] = useState(false);
  const isFetching = useIsFetching();

  const deployButtonRef = useRef<HTMLDivElement>(null);
  const codeGenButtonRef = useRef<HTMLDivElement>(null);

  const [showDeployTutorial, setShowDeployTutorial] = useState(false);
  const [showCodeGenTutorial, setShowCodeGenTutorial] = useState(false);

  const [tutorialPosition, setTutorialPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const hasSeenDeploy = localStorage.getItem(DEPLOY_TUTORIAL_KEY);
    const hasSeenCodeGen = localStorage.getItem(CODE_GEN_TUTORIAL_KEY);

    if (!hasSeenDeploy) {
      setShowDeployTutorial(true);
    } else if (!hasSeenCodeGen) {
      setShowCodeGenTutorial(true);
    }
  }, []);
  useEffect(() => {
    if (
      (showDeployTutorial || showCodeGenTutorial) &&
      deployButtonRef.current
    ) {
      const rect = deployButtonRef.current.getBoundingClientRect();
      setTutorialPosition({
        top: rect.bottom + 15,
        left: rect.left,
      });
    }
  }, [showDeployTutorial, showCodeGenTutorial]);

  const handleDismissDeployTutorial = () => {
    localStorage.setItem(DEPLOY_TUTORIAL_KEY, "true");
    setShowDeployTutorial(false);

    const hasSeenCodeGen = localStorage.getItem(CODE_GEN_TUTORIAL_KEY);
    if (!hasSeenCodeGen) {
      setShowCodeGenTutorial(true);
    }
  };

  const handleDismissCodeGenTutorial = () => {
    localStorage.setItem(CODE_GEN_TUTORIAL_KEY, "true");
    setShowCodeGenTutorial(false);
  };

  return (
    <>
      {(showDeployTutorial || showCodeGenTutorial) && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute z-50 w-72 animate-pulse rounded-lg bg-base-100 p-4 shadow-2xl"
            style={{
              top: `${tutorialPosition.top}px`,
              left: `${tutorialPosition.left}px`,
            }}
          >
            {showDeployTutorial && (
              <>
                <h3 className="font-bold">Deploy Your Bot</h3>
                <p className="py-2 text-sm">
                  Click here to deploy your bot and make it live.
                </p>
                <button
                  onClick={handleDismissDeployTutorial}
                  className="btn mt-2 w-full btn-sm btn-primary"
                >
                  Next
                </button>
              </>
            )}
            {showCodeGenTutorial && (
              <>
                <h3 className="font-bold">Generate Code</h3>
                <p className="py-2 text-sm">
                  Use this to see and download the underlying code for your bot.
                </p>
                <button
                  onClick={handleDismissCodeGenTutorial}
                  className="btn mt-2 w-full btn-sm btn-primary"
                >
                  Got it!
                </button>
              </>
            )}
          </div>
        </>
      )}

      {!botId || isNaN(Number(botId)) ?
        <div>Not a Number</div>
      : <div className="h-screen overflow-hidden">
          <div className="flex h-full w-full flex-col divide-y divide-white text-gray-800">
            <div className="h-15 shrink-0 bg-base-200 px-5">
              <div className="flex h-full items-center justify-between gap-3 text-primary">
                <Link to="/dashboard" className="btn btn-outline">
                  <Undo2 />
                </Link>
                <div className="flex items-center gap-3">
                  <div
                    ref={deployButtonRef}
                    className={`my-auto ${
                      showDeployTutorial ?
                        "relative z-50 rounded-md ring-2 ring-primary ring-offset-2"
                      : ""
                    }`}
                  >
                    <DeployCode botId={Number(botId)} />
                  </div>
                  <div
                    ref={codeGenButtonRef}
                    className={`my-auto ${
                      showCodeGenTutorial ?
                        "relative z-50 rounded-md ring-2 ring-primary ring-offset-2"
                      : ""
                    }`}
                  >
                    <CodeGeneration botId={Number(botId)} />
                  </div>
                  {loading || isFetching ?
                    <Loading size={30} />
                  : <Check size={30} className="my-auto" />}
                </div>
              </div>
            </div>
            <loadingContext.Provider value={setLoading}>
              <DnDFlow />
            </loadingContext.Provider>
          </div>
        </div>
      }
    </>
  );
}

export default Workflow;
