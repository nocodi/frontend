import { CloudCheck, Undo2, HelpCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import LogContainer from "../../components/logContainerButton";
import CodeGeneration from "../../components/CodeGeneration";
import DeployCode from "../../components/DeployCode";
import Flow from "../../components/Flow";
import Loading from "../../components/Loading";
import { useIsFetching } from "@tanstack/react-query";
import useTutorial from "./useTutorial";
import { LoadingContext } from "./LoadingContext";

export type WorkflowParams = {
  botId: string;
};

function Workflow() {
  const { botId } = useParams<WorkflowParams>();
  const [loading, setLoading] = useState(false);
  const isFetching = useIsFetching();

  const {
    tutorialStep,
    handleStartTutorial,
    handleFinishTutorial,
    wrapWithTutorial,
  } = useTutorial();

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
                className="tooltip btn tooltip-left btn-ghost btn-sm"
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
        <LoadingContext.Provider value={setLoading}>
          <Flow />
        </LoadingContext.Provider>
      </div>
    </div>
  );
}

export default Workflow;
