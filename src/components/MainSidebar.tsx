import { useLayoutEffect, useState } from "react";

const panelStates: readonly string[] = ["w-12 sm:w-40", "w-12", "w-40"];
const arrowStates: readonly string[] = [
  "scale-x-[-1] sm:scale-x-[1]",
  "scale-x-[-1]",
  "",
];

function MainSidebar() {
  const [panelState, setPanelState] = useState(0);
  // side panel functions-------------
  function handleExpand(): void {
    if (panelState === 0) {
      setPanelState(window.innerWidth < 800 ? 2 : 1);
    } else if (panelState === 1) {
      setPanelState(window.innerWidth < 800 ? 2 : 0);
    } else {
      setPanelState(1);
    }
  }

  // Must Be Added to Hooks Folder?
  useLayoutEffect(() => {
    function updateExpand() {
      if (panelState === 2 && window.innerWidth < 800) {
        setPanelState(0);
      }
    }
    window.addEventListener("resize", updateExpand);

    return () => window.removeEventListener("resize", updateExpand);
  }, [panelState]);

  return (
    <div className="h-screen">
      <div
        className={`relative h-full shrink-0 bg-patina-300 transition-all duration-300 ease-in-out ${panelStates[panelState]}`}
      >
        <div className="absolute top-80 -right-2 z-1">
          <button
            onClick={handleExpand}
            className="float-right h-4 w-4 cursor-pointer rounded-full border-1 border-primary-content bg-patina-500 hover:border-accent"
          >
            <div className="h-full w-full content-center text-white hover:text-accent">
              <svg
                className={`float-right h-3 w-3 align-middle ${arrowStates[panelState]}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
                />
              </svg>
            </div>
          </button>
        </div>
        <div className="flex h-full flex-col items-center gap-20"></div>
      </div>
    </div>
  );
}

export default MainSidebar;
