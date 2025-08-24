import { X } from "lucide-react";
import { useState, useEffect, JSX } from "react";

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

const useTutorial = () => {
    const [tutorialStep, setTutorialStep] =
    useState<WorkflowTutorialSteps>("NONE");
  const isFirst = localStorage.getItem("is_first_login");
  useEffect(() => {
    if (isFirst === "true") {
      setTutorialStep("LOG");
    }
  }, [isFirst]);

  const handleStartTutorial = () => setTutorialStep("LOG");

  const handleAdvanceTutorial = () => {
    if (tutorialStep === "LOG") setTutorialStep("DEPLOY");
    else if (tutorialStep === "DEPLOY") setTutorialStep("CODEGEN");
    else if (tutorialStep === "CODEGEN") handleFinishTutorial();
  };

  const handleFinishTutorial = () => {
    if (isFirst === "false") {
      setTutorialStep("NONE");
    }
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
  
  return {
    tutorialStep,
    handleStartTutorial,
    handleFinishTutorial,
    wrapWithTutorial,
  };
};

export default useTutorial;
