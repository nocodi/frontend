import { Check, Undo2, X, HelpCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import LogContainer from "../components/logContainerButton";
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

const WORKFLOW_TUTORIAL_KEY = "hasSeenWorkflowTutorial";

function Workflow() {
  const { botId } = useParams<WorkflowParams>();
  const [loading, setLoading] = useState(false);
  const isFetching = useIsFetching();

  const deployButtonRef = useRef<HTMLDivElement>(null);
  const codeGenButtonRef = useRef<HTMLDivElement>(null);
  const logButtonRef = useRef<HTMLDivElement>(null);

  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(true);

  const [showDeployTutorial, setShowDeployTutorial] = useState(false);
  const [showCodeGenTutorial, setShowCodeGenTutorial] = useState(false);
  const [showLogTutorial, setShowLogTutorial] = useState(false);
  const [tutorialPosition, setTutorialPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const hasSeen = localStorage.getItem(WORKFLOW_TUTORIAL_KEY);
    if (!hasSeen) {
      setHasCompletedTutorial(false);
    }
  }, []);

  useEffect(() => {
    let activeTutorialRef = null;
    if (showLogTutorial) {
      activeTutorialRef = logButtonRef;
    } else if (showDeployTutorial) {
      activeTutorialRef = deployButtonRef;
    } else if (showCodeGenTutorial) {
      activeTutorialRef = codeGenButtonRef;
    }

    if (activeTutorialRef && activeTutorialRef.current) {
      const rect = activeTutorialRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const tooltipWidth = 300; // Estimated tooltip width

      let left = rect.left;
      // Ensure tooltip doesn't go off screen
      if (left + tooltipWidth > viewportWidth - 20) {
        left = viewportWidth - tooltipWidth - 20;
      }
      if (left < 20) {
        left = 20;
      }

      setTutorialPosition({
        top: rect.bottom + 15,
        left: left,
      });
    }
  }, [showCodeGenTutorial, showDeployTutorial, showLogTutorial]);

  const handleStartTutorial = () => {
    setShowLogTutorial(true);
    setShowDeployTutorial(false);
    setShowCodeGenTutorial(false);
  };

  const handleAdvanceToDeployTutorial = () => {
    setShowLogTutorial(false);
    setShowDeployTutorial(true);
    setShowCodeGenTutorial(false);
  };

  const handleAdvanceToCodeGenTutorial = () => {
    setShowLogTutorial(false);
    setShowDeployTutorial(false);
    setShowCodeGenTutorial(true);
  };

  const handleFinishTutorial = () => {
    localStorage.setItem(WORKFLOW_TUTORIAL_KEY, "true");
    setShowDeployTutorial(false);
    setShowLogTutorial(false);
    setShowCodeGenTutorial(false);
    setHasCompletedTutorial(true);
  };

  const handleSkipTutorial = () => {
    localStorage.setItem(WORKFLOW_TUTORIAL_KEY, "true");
    setShowDeployTutorial(false);
    setShowLogTutorial(false);
    setShowCodeGenTutorial(false);
    setHasCompletedTutorial(true);
  };

  const handleRestartTutorial = () => {
    setHasCompletedTutorial(false);
    handleStartTutorial();
  };

  const TutorialButton = ({
    onClick,
    children,
    disabled,
    ariaLabel,
  }: {
    onClick: () => void;
    children: React.ReactNode;
    disabled?: boolean;
    ariaLabel?: string;
  }) => (
    <button
      onClick={onClick}
      className={`btn transition-all duration-200 btn-outline ${
        disabled ?
          "btn-disabled cursor-not-allowed opacity-50"
        : "text-primary hover:scale-105"
      }`}
      disabled={disabled}
      aria-label={
        ariaLabel || (disabled ? "Button - Available after tutorial" : "Button")
      }
    >
      {children}
    </button>
  );

  const isTutorialActive =
    showCodeGenTutorial || showDeployTutorial || showLogTutorial;

  // Validate botId
  const isValidBotId = botId && !isNaN(Number(botId));

  return (
    <>
      {isTutorialActive && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleSkipTutorial}
            aria-label="Click to skip tutorial"
          />
          <div
            className="animate-in slide-in-from-top-2 absolute z-50 w-72 max-w-sm rounded-xl border border-base-300 bg-base-100 p-6 shadow-2xl duration-300"
            style={{
              top: `${tutorialPosition.top}px`,
              left: `${tutorialPosition.left}px`,
            }}
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span className="text-xs font-medium text-base-content/60">
                  {showLogTutorial ?
                    "1"
                  : showDeployTutorial ?
                    "2"
                  : "3"}{" "}
                  of 3
                </span>
              </div>
              <button
                onClick={handleSkipTutorial}
                className="btn btn-ghost btn-xs"
                aria-label="Skip tutorial"
              >
                <X size={16} />
              </button>
            </div>

            {showLogTutorial && (
              <>
                <h3 className="mb-2 text-lg font-bold">View Logs 📊</h3>
                <p className="mb-4 text-sm leading-relaxed text-base-content/80">
                  Monitor your bot's activity in real-time. See what's happening
                  behind the scenes.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleAdvanceToDeployTutorial}
                    className="btn flex-1 btn-sm btn-primary"
                  >
                    Next
                  </button>
                  <button
                    onClick={handleSkipTutorial}
                    className="btn btn-ghost btn-sm"
                  >
                    Skip
                  </button>
                </div>
              </>
            )}
            {showDeployTutorial && (
              <>
                <h3 className="mb-2 text-lg font-bold">Deploy Bot 🚀</h3>
                <p className="mb-4 text-sm leading-relaxed text-base-content/80">
                  Ready to go live? Deploy your bot and make it available to
                  users worldwide.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleAdvanceToCodeGenTutorial}
                    className="btn flex-1 btn-sm btn-primary"
                  >
                    Next
                  </button>
                  <button
                    onClick={handleSkipTutorial}
                    className="btn btn-ghost btn-sm"
                  >
                    Skip
                  </button>
                </div>
              </>
            )}
            {showCodeGenTutorial && (
              <>
                <h3 className="mb-2 text-lg font-bold">Download Code 💾</h3>
                <p className="mb-4 text-sm leading-relaxed text-base-content/80">
                  Get the complete source code for your bot. Perfect for
                  customization or deployment elsewhere.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleFinishTutorial}
                    className="btn flex-1 btn-sm btn-primary"
                  >
                    Got it!
                  </button>
                  <button
                    onClick={handleSkipTutorial}
                    className="btn btn-ghost btn-sm"
                  >
                    Skip
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {!isValidBotId ?
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
      : <div className="h-screen overflow-hidden">
          <div className="flex h-full w-full flex-col divide-y divide-white text-gray-800">
            <div className="h-16 shrink-0 border-b border-base-300 bg-base-200 px-5">
              <div className="flex h-full items-center justify-between gap-3 text-primary">
                <Link
                  to="/dashboard"
                  className="btn transition-transform btn-outline hover:scale-105"
                  aria-label="Back to dashboard"
                >
                  <Undo2 />
                </Link>
                <div className="flex items-center gap-3">
                  {hasCompletedTutorial ?
                    <>
                      <div className="my-auto">
                        <LogContainer botId={Number(botId)} />
                      </div>
                      <div className="my-auto">
                        <DeployCode botId={Number(botId)} />
                      </div>
                      <div className="my-auto">
                        <CodeGeneration botId={Number(botId)} />
                      </div>
                      <button
                        onClick={handleRestartTutorial}
                        className="tooltip btn tooltip-bottom btn-ghost btn-sm"
                        data-tip="Restart tutorial"
                        aria-label="Restart tutorial"
                      >
                        <HelpCircle size={20} />
                      </button>
                    </>
                  : <>
                      <div
                        ref={logButtonRef}
                        className={`my-auto transition-all duration-300 ${
                          showLogTutorial ?
                            "relative z-50 rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-base-200"
                          : ""
                        }`}
                      >
                        <TutorialButton
                          onClick={() => {}}
                          disabled
                          ariaLabel="Logs - Available after tutorial"
                        >
                          Logs
                        </TutorialButton>
                      </div>
                      <div
                        ref={deployButtonRef}
                        className={`my-auto transition-all duration-300 ${
                          showDeployTutorial ?
                            "relative z-50 rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-base-200"
                          : ""
                        }`}
                      >
                        <TutorialButton
                          onClick={() => {}}
                          disabled
                          ariaLabel="Deploy - Available after tutorial"
                        >
                          Deploy
                        </TutorialButton>
                      </div>
                      <div
                        ref={codeGenButtonRef}
                        className={`my-auto transition-all duration-300 ${
                          showCodeGenTutorial ?
                            "relative z-50 rounded-lg ring-2 ring-primary ring-offset-2 ring-offset-base-200"
                          : ""
                        }`}
                      >
                        <TutorialButton
                          onClick={handleStartTutorial}
                          ariaLabel="Start tutorial - Download code"
                        >
                          Download
                        </TutorialButton>
                      </div>
                    </>
                  }
                  <div className="flex items-center gap-2">
                    {loading || isFetching ?
                      <>
                        <Loading size={24} />
                        <span className="text-sm text-base-content/70">
                          Processing...
                        </span>
                      </>
                    : <>
                        <Check size={24} className="text-success" />
                        <span className="text-sm text-success">Ready</span>
                      </>
                    }
                  </div>
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
