import React from "react";
import { useDnD } from "./DnDContext";

function NodeListSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const setType = useDnD()[1];

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
  ) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`flex absolute right-0 z-1 h-screen w-64 bg-patina-300 transition-transform duration-400 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full overflow-y-auto w-full flex flex-col gap-2">
        <div className="flex flex-row">
          <div className="h-fit w-10 my-auto">
            <button
              onClick={onClose}
              className="rounded float-right cursor-pointer group"
            >
              <svg
                className="w-6 h-6 group-hover:text-accent"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
            </button>
          </div>
          <h1 className="font-bold p-4 text-center w-full">
            Drag and Drop Nodes
          </h1>
        </div>
        <label className="input h-10 bg-patina-300 border-2 border-patina-700 w-60 mx-2 mb-2">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" className="grow" placeholder="Search" />
        </label>
        <div className="flex flex-col gap-3">
          <div
            className="h-15 w-full border-l-4 content-center border-patina-200 hover:border-accent hover:bg-patina-200 tansition-all duration-300"
            onDragStart={(event) => onDragStart(event, "input")}
            draggable
          >
            <div className="ml-5 text-sm">Input Node</div>
          </div>
          <div
            className="h-15 w-full border-l-4 content-center border-patina-200 hover:border-accent hover:bg-patina-200 tansition-all duration-300"
            onDragStart={(event) => onDragStart(event, "input-output")}
            draggable
          >
            <div className="ml-5 text-sm">Def Node</div>
          </div>
          <div
            className="h-15 w-full border-l-4 content-center border-patina-200 hover:border-accent hover:bg-patina-200 tansition-all duration-300"
            onDragStart={(event) => onDragStart(event, "output")}
            draggable
          >
            <div className="ml-5 text-sm">Output Node</div>
          </div>
          <div className="h-15"></div>
        </div>
      </div>
    </div>
  );
}

export default NodeListSidebar;
