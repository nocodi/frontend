import React, { useEffect, useState } from "react";
import { useDnD } from "./DnDContext";
import { ComponentType } from "../types/Component";
import getComponents from "../services/getComponents";
import Tooltip from "./Tooltip";

function ComponentList({
  onClose,
  addSelectedComponent,
}: {
  onClose: () => void;
  addSelectedComponent: (component: ComponentType) => void;
}) {
  const setComponent = useDnD()[1];

  const [components, setComponents] = useState<ComponentType[]>([]);

  useEffect(() => {
    getComponents()
    .then(() => setComponents(data))
    .catch((err) => {
      console.error("Failed to load components:", err);
    });
  }, []);

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    component: ComponentType,
  ) => {
    setComponent(component);
    event.dataTransfer.effectAllowed = "move";
  };

  const clickedOnComponent = (component: ComponentType) => {
    addSelectedComponent(component);
    onClose();
  };

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-scroll">
      <div className="flex flex-row">
        <div className="my-auto h-fit w-10">
          <button
            onClick={onClose}
            className="group float-right cursor-pointer rounded"
          >
            <svg
              className="h-6 w-6 group-hover:text-accent"
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
        <h1 className="w-full p-4 text-center font-bold">
          Drag and Drop Components
        </h1>
      </div>
      <label className="input mx-2 mb-2 h-10 w-60 border-2 border-patina-700 bg-patina-300">
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
        {components.map((item, key) => (
          <div
            key={`${key}`}
            onClick={() => clickedOnComponent(item)}
            className="tansition-all group/component relative flex h-15 w-full cursor-pointer flex-row duration-300 hover:bg-patina-200"
            onDragStart={(event) => onDragStart(event, item)}
            draggable
          >
            <div className="h-full w-3 rounded-r-xl bg-patina-200 group-hover/component:bg-accent"></div>
            <div>
              <div className="ml-2 text-sm font-bold">{item.name}</div>

              <Tooltip content={item.description}>
                <div className="ml-4 text-xs">
                  {item.description.length < 80 ?
                    item.description
                  : item.description.slice(0, 80) + " ..."}
                </div>
              </Tooltip>
            </div>
          </div>
        ))}

        <div className="h-15"></div>
      </div>
    </div>
  );
}

export default ComponentList;
