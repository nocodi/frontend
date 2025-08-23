import { CloudCheck, Undo2, X, HelpCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { createContext, JSX, useContext, useState, useEffect } from "react";
import LogContainer from "../components/logContainerButton";
import CodeGeneration from "../components/CodeGeneration";
import DeployCode from "../components/DeployCode";
import DnDFlow from "../components/Flow";
import Loading from "../components/Loading";
import { useIsFetching } from "@tanstack/react-query";

export type loadingContextType = React.Dispatch<React.SetStateAction<boolean>>;
const loadingContext = createContext<loadingContextType>(() => {});
export const useLoading = () => useContext(loadingContext);

export type WorkflowParams = {
  botId: string;
};

type WorkflowTutorialSteps = "CODEGEN" | "DEPLOY" | "LOG" | "NONE";

const tutorialContent = {
  LOG: {
    step: 1,
    title: "View Logs 📊",
    desc: "Monitor your bot's activity in real-time.",
  },
  DEPLOY: {
    step: 2,
    title: "Deploy Bot 🚀",
    desc: "Ready to go live? Deploy your bot and make it available.",
  },
  CODEGEN: {
    step: 3,
    title: "Download Code 💾",
    desc: "Download your bot's source code for customization.",
  },
  NONE: {
    step: 0,
    title: "",
    desc: "",
  },
};

function Workflow() {
  const { botId } = useParams<WorkflowParams>();
  const [loading, setLoading] = useState(false);
  const isFetching = useIsFetching();
  const [tutorialStep, setTutorialStep] =
    useState<WorkflowTutorialSteps>("NONE");

  useEffect(() => {
    const isTutorialInProgress =
      localStorage.getItem("is_first_login") === "in_progress";
    if (isTutorialInProgress) {
      setTutorialStep("LOG");
    }
  }, []);

  const handleStartTutorial = () => setTutorialStep("LOG");

  const handleAdvanceTutorial = () => {
    if (tutorialStep === "LOG") setTutorialStep("DEPLOY");
    else if (tutorialStep === "DEPLOY") setTutorialStep("CODEGEN");
    else if (tutorialStep === "CODEGEN") handleFinishTutorial();
  };

  const handleFinishTutorial = () => {
    setTutorialStep("NONE");
    localStorage.setItem("is_first_login", "false");
  };

  const wrapWithTutorial = (
    children: JSX.Element,
    step: WorkflowTutorialSteps,
  ) => {
    if (tutorialStep !== step) return children;
    return (
      <div className="relative z-50 flex flex-col items-center">
        {children}
        <div className="animate-in slide-in-from-top-2 absolute top-full left-1/2 z-30 mt-3 w-72 -translate-x-1/2 rounded-xl border border-base-300 bg-base-100 p-6 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span className="text-xs font-medium text-base-content/60">
                {tutorialContent[step].step} of 3
              </span>
            </div>
            <button
              onClick={handleFinishTutorial}
              className="btn btn-ghost btn-xs"
            >
              <X size={16} />
            </button>
          </div>
          <h3 className="mb-2 text-lg font-bold">
            {tutorialContent[step].title}
          </h3>
          <p className="mb-4 text-sm text-base-content/80">
            {tutorialContent[step].desc}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleAdvanceTutorial}
              className="btn flex-1 btn-sm btn-primary"
            >
              Next
            </button>
            <button
              onClick={handleFinishTutorial}
              className="btn btn-ghost btn-sm"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  };

  const isValidBotId = botId && !isNaN(Number(botId));

  if (!isValidBotId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-200">
        <div className="mx-auto max-w-md p-8 text-center">
          <div className="mb-4 text-6xl">🤖</div>
          <h1 className="mb-2 text-2xl font-bold">Invalid Bot ID</h1>
          <p className="mb-6 text-base-content/70">
            The bot ID "{botId}" is not valid. Please check the URL and try
            again.
          </p>
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      {tutorialStep !== "NONE" && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={handleFinishTutorial}
        />
      )}
      <div className="flex h-full w-full flex-col divide-y divide-white text-gray-800">
        <div className="h-16 shrink-0 border-b border-base-300 bg-base-200 px-5">
          <div className="flex h-full items-center justify-between gap-3 text-primary">
            <Link to="/dashboard" className="btn btn-outline">
              <Undo2 />
            </Link>
            <div
              className="flex items-center gap-3"
              onClickCapture={(e) => {
                if (
                  tutorialStep === "NONE" &&
                  localStorage.getItem("is_first_login") === "true"
                ) {
                  e.stopPropagation();
                  handleStartTutorial();
                }
              }}
            >
              {wrapWithTutorial(<LogContainer botId={Number(botId)} />, "LOG")}
              {wrapWithTutorial(<DeployCode botId={Number(botId)} />, "DEPLOY")}
              {wrapWithTutorial(
                <CodeGeneration botId={Number(botId)} />,
                "CODEGEN",
              )}
              <button
                onClick={handleStartTutorial}
                className="tooltip btn tooltip-bottom btn-ghost btn-sm"
                data-tip="Restart tutorial"
              >
                <HelpCircle size={20} />
              </button>
              <div
                className="tooltip tooltip-left"
                data-tip={
                  loading || isFetching ? "Syncing..." : "Everything Synced"
                }
              >
                {loading || isFetching ?
                  <Loading size={24} />
                : <CloudCheck size={24} className="text-success" />}
              </div>
            </div>
          </div>
        </div>
        <loadingContext.Provider value={setLoading}>
          <DnDFlow />
        </loadingContext.Provider>
      </div>
    </div>
  );
}

export default Workflow;
