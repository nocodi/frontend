import React, { useState } from "react";
import { ContentType } from "../types/Component";
import SearchBar from "./searchBar";
import Tooltip from "./Tooltip";
import { ArrowLeft, X, Bot, Zap, Settings2, Puzzle } from "lucide-react";
import { useContentTypes } from "../services/getQueries";
import { useDnD } from "./DnDContext";

const CATEGORIES = ["Telegram", "Trigger", "Conditional", "Other"];
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Telegram: <Bot className="h-5 w-5 text-primary" />,
  Trigger: <Zap className="h-5 w-5 text-yellow-500" />,
  Conditional: <Settings2 className="h-5 w-5 text-green-500" />,
  Other: <Puzzle className="h-5 w-5 text-gray-500" />,
};

function ContentTypesList({
  onClose,
  addSelectedComponent,
}: {
  onClose: () => void;
  addSelectedComponent: (component: ContentType) => void;
}) {
  const setContent = useDnD()[1];
  const { contentTypes } = useContentTypes();

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const filtered = contentTypes
    ?.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    .filter((item) => {
      if (!selectedCategory) return false;
      if (selectedCategory === "Other") return item.component_type === "";
      return (
        item.component_type?.toLowerCase() === selectedCategory.toLowerCase()
      );
    });

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-y-scroll">
      <div className="flex flex-row">
        <div className="my-auto h-fit w-fit">
          {selectedCategory ?
            <button
              onClick={() => setSelectedCategory(null)}
              className="group btn ml-2 cursor-pointer p-4 btn-outline btn-primary"
            >
              <ArrowLeft />
            </button>
          : <button
              onClick={onClose}
              className="group btn ml-2 cursor-pointer p-4 btn-outline btn-primary"
            >
              <X />
            </button>
          }
        </div>

        <h1 className="w-full p-4 text-center font-bold">
          {!selectedCategory && CATEGORIES ?
            <>Select a Category</>
          : <>Drag and Drop Components</>}
        </h1>
      </div>

      <div className="mx-auto mb-2 w-60">
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="flex flex-col gap-3">
        {!selectedCategory && CATEGORIES ?
          <>
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="tansition-all group/component relative flex min-h-17 w-full cursor-pointer flex-row items-center gap-2 duration-300 hover:bg-primary hover:text-primary-content"
              >
                <div className="h-full w-3 min-w-3 rounded-r-xs bg-primary group-hover/component:bg-patina-200"></div>
                <div className="ml-2 flex items-center gap-2 text-sm font-bold">
                  {CATEGORY_ICONS[cat]}
                  {cat}
                </div>
              </div>
            ))}
          </>
        : null}

        {filtered?.map((item, key) => (
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
        ))}

        <div className="h-15"></div>
      </div>
    </div>
  );
}

export default ContentTypesList;
