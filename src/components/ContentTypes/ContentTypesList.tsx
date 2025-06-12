import React, { useState } from "react";
import { ContentType } from "../../types/Component";
import SearchBar from "../searchBar";
import Tooltip from "../Tooltip";
import {
  ArrowLeft,
  X,
  Bot,
  Zap,
  Settings2,
  Puzzle,
  MessageSquare,
  Image,
  FileText,
  Video,
  Mic,
  MapPin,
  Contact,
  BarChart2,
  Keyboard,
  Reply,
  Layout,
  Square,
  MousePointerClick,
} from "lucide-react";
import { useContentTypes } from "../../services/getQueries";
import { useDnD } from "../Context/DnDContext";

const CATEGORIES = ["Telegram", "Trigger", "Conditional", "Other"];
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Telegram: <Bot className="h-6 w-6 text-primary" />,
  Trigger: <Zap className="h-6 w-6 text-yellow-500" />,
  Conditional: <Settings2 className="h-6 w-6 text-green-500" />,
  Other: <Puzzle className="h-6 w-6 text-gray-500" />,
};

const getComponentIcon = (name: string, size: "small" | "large" = "large") => {
  const iconClass =
    size === "small" ? "mr-1 ml-1 h-4.5 w-4.5" : "mr-2 ml-2 h-6 w-6";
  const colorClass = {
    message: "text-blue-500",
    photo: "text-pink-500",
    document: "text-gray-500",
    video: "text-purple-500",
    voice: "text-orange-500",
    location: "text-green-500",
    contact: "text-teal-500",
    poll: "text-yellow-500",
    keyboard: "text-indigo-500",
    reply: "text-cyan-500",
    markup: "text-lime-500",
    button: "text-rose-500",
    callback: "text-fuchsia-500",
    default: "text-gray-500",
  };
  const lower = name.toLowerCase();
  if (lower.includes("message"))
    return <MessageSquare className={`${iconClass} ${colorClass.message}`} />;
  if (lower.includes("photo"))
    return <Image className={`${iconClass} ${colorClass.photo}`} />;
  if (lower.includes("document"))
    return <FileText className={`${iconClass} ${colorClass.document}`} />;
  if (lower.includes("video"))
    return <Video className={`${iconClass} ${colorClass.video}`} />;
  if (lower.includes("voice"))
    return <Mic className={`${iconClass} ${colorClass.voice}`} />;
  if (lower.includes("location"))
    return <MapPin className={`${iconClass} ${colorClass.location}`} />;
  if (lower.includes("contact"))
    return <Contact className={`${iconClass} ${colorClass.contact}`} />;
  if (lower.includes("poll"))
    return <BarChart2 className={`${iconClass} ${colorClass.poll}`} />;
  if (lower.includes("keyboard"))
    return <Keyboard className={`${iconClass} ${colorClass.keyboard}`} />;
  if (lower.includes("reply"))
    return <Reply className={`${iconClass} ${colorClass.reply}`} />;
  if (lower.includes("markup"))
    return <Layout className={`${iconClass} ${colorClass.markup}`} />;
  if (lower.includes("button"))
    return <Square className={`${iconClass} ${colorClass.button}`} />;
  if (lower.includes("callback"))
    return (
      <MousePointerClick className={`${iconClass} ${colorClass.callback}`} />
    );
  return <Puzzle className={`${iconClass} ${colorClass.default}`} />;
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
    <div className="flex h-full w-full flex-col gap-6 overflow-y-scroll bg-base-100 p-6">
      <div className="flex flex-row items-center justify-between">
        <div className="my-auto h-fit w-fit">
          {selectedCategory ?
            <button
              onClick={() => setSelectedCategory(null)}
              className="group btn btn-circle btn-ghost hover:bg-primary/10"
            >
              <ArrowLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
            </button>
          : <button
              onClick={onClose}
              className="group btn btn-circle btn-ghost hover:bg-primary/10"
            >
              <X className="h-6 w-6 transition-transform group-hover:rotate-90" />
            </button>
          }
        </div>
        <h1 className="text-2xl font-bold">
          {!selectedCategory ? "Select a Category" : "Drag and Drop Components"}
        </h1>
        <div className="w-12" /> {/* Spacer for alignment */}
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="flex flex-col gap-4">
        {!selectedCategory ?
          <div className="flex flex-col gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="group relative flex h-24 w-full cursor-pointer flex-row items-center gap-4 rounded-xl border border-base-300 bg-base-200 p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-primary hover:bg-primary/5 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-base-100 shadow-sm transition-all duration-200 group-hover:bg-primary/10">
                  {CATEGORY_ICONS[cat]}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-lg font-semibold">{cat}</span>
                </div>
              </div>
            ))}
          </div>
        : <div className="flex flex-col gap-4">
            {filtered?.map((item, key) => (
              <Tooltip key={`tooltip-${key}`} content={item.description}>
                <div
                  key={`${key}`}
                  onClick={() => clickedOnComponent(item)}
                  className="group relative flex h-24 w-full cursor-pointer flex-row items-center gap-4 rounded-xl border border-base-300 bg-base-200 p-4 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-primary hover:bg-primary/5 hover:shadow-md"
                  onDragStart={(event) => onDragStart(event, item)}
                  draggable
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-base-100 shadow-sm transition-all duration-200 group-hover:bg-primary/10">
                    {getComponentIcon(item.name)}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-lg font-semibold">
                      {item.name}
                    </span>
                  </div>
                </div>
              </Tooltip>
            ))}
          </div>
        }

        <div className="h-6" />
      </div>
    </div>
  );
}

export default ContentTypesList;
export { getComponentIcon };
