import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TUTORIAL_STORAGE_KEY = "hasSeenPlusSign";

type TutorialProps = {
  showTutorial: boolean;
  setShowTutorial: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  plusButtonRef: React.RefObject<HTMLDivElement | null>;
};

export default function Tutorial({
  showTutorial,
  setShowTutorial,
  setIsPanelOpen,
  plusButtonRef,
}: TutorialProps) {
  const [tutorialPosition, setTutorialPosition] = useState({
    top: 0,
    right: 0,
  });

  useEffect(() => {
    const hasSeenPlusSign = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!hasSeenPlusSign) {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    if (showTutorial && plusButtonRef.current) {
      const rect = plusButtonRef.current.getBoundingClientRect();
      setTutorialPosition({
        top: rect.top,
        right: rect.right + 15,
      });
    }
  }, [showTutorial]);

  const handleDismissTutorial = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    setShowTutorial(false);
    setIsPanelOpen(true);
    // setTimeout(() => {
    //   setIsPanelOpen(false);
    // }, 5000);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" />
      <div
        className="absolute z-50 w-72 animate-pulse rounded-lg bg-base-100 p-4 shadow-2xl"
        style={{
          top: `${tutorialPosition.top}px`,
          right: `${tutorialPosition.right}px`,
        }}
      >
        <button
          onClick={() => {
            localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
            setShowTutorial(false);
          }}
          className="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm"
        >
          <X className="size-4" />
        </button>
        <p className="font-bold text-primary">
          Use Components <span className="text-2xl">►</span>
        </p>
        <p className="py-2 text-sm text-white">
          Click this button to open a list of components for your workflow.
        </p>
        <button
          onClick={handleDismissTutorial}
          className="btn mt-2 w-full btn-sm btn-primary"
        >
          Got it!
        </button>
      </div>
    </>
  );
}
