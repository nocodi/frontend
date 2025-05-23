import React, { useState } from "react";

import { ContentType } from "../types/Component";
import SearchBar from "./searchBar";
import Tooltip from "./Tooltip";
import { X } from "lucide-react";
import { useContentTypes } from "../services/getQueries";
import { useDnD } from "./DnDContext";

function ContentTypesList({
  onClose,
  addSelectedComponent,
}: {
  onClose: () => void;
  addSelectedComponent: (component: ContentType) => void;
}) {
  const setContent = useDnD()[1];

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    component: ContentType,
  ) => {
    setContent(component);
    event.dataTransfer.effectAllowed = "move";
  };

  const clickedOnComponent = (content: ContentType) => {
    addSelectedComponent(content);
    onClose();
  };

  const [query, setQuery] = useState("");

  const { contentTypes } = useContentTypes();

  const filtered = contentTypes?.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-scroll">
      <div className="flex flex-row">
        <div className="my-auto h-fit w-fit">
          <button
            onClick={onClose}
            className="group btn ml-2 cursor-pointer p-4 btn-outline btn-primary"
          >
            <X />
          </button>
        </div>
        <h1 className="w-full p-4 text-center font-bold">
          Drag and Drop Components
        </h1>
      </div>
      <div className="mx-auto mb-2 w-60">
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="flex flex-col gap-3">
        {filtered ?
          filtered?.map((item, key) => (
            <div
              key={`${key}`}
              onClick={() => clickedOnComponent(item)}
              className="tansition-all group/component relative flex min-h-17 w-full cursor-pointer flex-row duration-300 hover:bg-primary hover:text-primary-content"
              onDragStart={(event) => onDragStart(event, item)}
              draggable
            >
              <div className="h-full w-3 min-w-3 rounded-r-xs bg-primary group-hover/component:bg-patina-200"></div>
              <div>
                <div className="ml-2 text-sm font-bold">{item.name}</div>

                <Tooltip content={item.description}>
                  <div className="ml-4 text-xs">
                    {item.description.length < 100 ?
                      item.description
                    : item.description.slice(0, 96) + "..."}
                  </div>
                </Tooltip>
              </div>
            </div>
          ))
        : <div className="py-1 text-gray-500 italic">No results found</div>}

        <div className="h-15"></div>
      </div>
    </div>
  );
}

export default ContentTypesList;
