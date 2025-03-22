import { useLayoutEffect, useState } from "react";

const panelStates: readonly string[] = ["w-12 sm:w-40", "w-12", "w-40"];
const arrowStates: readonly string[] = [
  "scale-x-[-1] sm:scale-x-[1]",
  "scale-x-[-1]",
  "",
];

function SidePanel() {
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
    <div
      className={`bg-secondary shrink-0 transition-all ease-in-out duration-300 ${panelStates[panelState]}`}
    >
      <div className="flex flex-col gap-20 items-center">
        <div className="flex flex-col gap-10">
          <div className="bg-red-400 w-5 h-5"></div>
          <div className="bg-red-400 w-5 h-5"></div>
          <div className="bg-red-400 w-5 h-5"></div>
          <div className="bg-red-400 w-5 h-5"></div>
        </div>
        <div className="w-full h-full ml-4 z-1">
          <button
            onClick={handleExpand}
            className="cursor-pointer w-4 h-4 bg-gray-600 rounded-full float-right border-1 border-gray-400"
          >
            <div className="text-white hover:text-red-500 w-full h-full content-center">
              <svg
                className={`w-3 h-3 float-right align-middle ${arrowStates[panelState]}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 16"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
                />
              </svg>
            </div>
          </button>
        </div>
        <div className="flex flex-col gap-10">
          <div className="bg-red-400 w-5 h-5"></div>
          <div className="bg-red-400 w-5 h-5"></div>
          <div className="bg-red-400 w-5 h-5"></div>
          <div className="bg-red-400 w-5 h-5"></div>
        </div>
      </div>
    </div>
  );
}

export default SidePanel;
