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
    nodeType: string
  ) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`flex  absolute right-0 z-1 h-screen w-64 bg-gray-400 transition-transform duration-400 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full overflow-y-auto w-full flex flex-col">
        <div className="flex flex-row bg-gray-500">
          <div className="h-fit w-10 my-auto">
            <button
              onClick={onClose}
              className="text-white rounded float-right cursor-pointer group"
            >
              <svg
                className="w-6 h-6 text-white group-hover:text-secondary"
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
          <h1 className="text-black font-bold text-white p-4 text-center w-full">
            Drag and Drop Nodes
          </h1>
        </div>
        <div className="my-5 mx-auto">SearchBar</div>
        <div className="flex flex-col gap-2">
          <div
            className="h-15 w-full border-l-4 border-gray-400 hover:border-orange-400"
            onDragStart={(event) => onDragStart(event, "input")}
            draggable
          >
            <div className="ml-5">Input Node</div>
          </div>
          <div
            className="h-15 w-full border-l-4 border-gray-400 hover:border-orange-400"
            onDragStart={(event) => onDragStart(event, "input-output")}
            draggable
          >
            <div className="ml-5">Def Node</div>
          </div>
          <div
            className="h-15 w-full border-l-4 border-gray-400 hover:border-orange-400"
            onDragStart={(event) => onDragStart(event, "output")}
            draggable
          >
            <div className="ml-5">Output Node</div>
          </div>
          <div className="h-15"></div>
        </div>
      </div>
    </div>
  );
}

export default NodeListSidebar;
