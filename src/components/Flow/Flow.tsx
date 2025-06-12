import "reactflow/dist/style.css";

import { ComponentType, ContentType } from "../../types/Component";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeDragHandler,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import { useBotSchema, useContentTypes } from "../../services/getQueries";
import { useCallback, useEffect, useRef, useState } from "react";
import Component from "./Component";
import ComponentDetail from "../ComponentDetail";
import ContentTypesList from "../ContentTypes/ContentTypesList";
import CustomEdge from "./EdgeComponent";
import { Plus, X } from "lucide-react";
import { useDnD } from "../Context/DnDContext";
import { useLoading } from "../../pages/Workflow";
import { useUnattended } from "../Context/UnattendedComponentContext";
import { GroupNode } from "./GroupNode";
import { HandleConn } from "./HandleConn";
import { MakeComponent } from "./MakeComponent";
import { HandleNodeDragExit } from "./HandleNodeDragExit";

const nodeTypes = { customNode: Component, group: GroupNode };
const edgeTypes = { customEdge: CustomEdge };
const TUTORIAL_STORAGE_KEY = "hasSeenPlusSign";

export default function Flow() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [draggingNodeXY, setDraggingNodeXY] = useState<{
    x: number;
    y: number;
  }>({ x: -1, y: -1 });
  const reactFlowWrapper = useRef(null);
  const plusButtonRef = useRef<HTMLDivElement>(null);
  const flowInstance = useReactFlow();
  const [content] = useDnD();
  const [unattendedComponent, setUnattendedComponent] = useUnattended();
  const [nodes, setNodes, onNodeChange] = useNodesState<ComponentType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const setLoading = useLoading();
  const { contentTypes } = useContentTypes(0);

  const [showTutorial, setShowTutorial] = useState(false);
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

  useBotSchema(setNodes, setEdges);

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      HandleConn(flowInstance, connection, contentTypes, setLoading);
    },
    [flowInstance, contentTypes, setLoading],
  );

  const makeNewComponent = useCallback(
    (content: ContentType, x?: number, y?: number) =>
      MakeComponent(flowInstance, content, setUnattendedComponent, x, y),
    [flowInstance, setUnattendedComponent],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!content) return;
      makeNewComponent(content, event.clientX, event.clientY);
    },
    [content, makeNewComponent],
  );

  const addSelectedComponent = (content: ContentType) => {
    makeNewComponent(content);
  };

  const nodeDragEnter: NodeDragHandler = (
    _event: React.MouseEvent,
    node: Node,
  ) => {
    setDraggingNodeXY({ x: node.position.x, y: node.position.y });
  };

  const nodeDragExit: NodeDragHandler = (
    _event: React.MouseEvent,
    node: Node,
  ) => {
    HandleNodeDragExit(
      flowInstance,
      draggingNodeXY,
      node,
      contentTypes,
      setLoading,
    );
  };

  return (
    <>
      {showTutorial && (
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
      )}
      <div className="h-full w-full text-primary">
        <div className="relative h-full w-full bg-base-300">
          <div
            ref={plusButtonRef}
            onClick={() => setIsPanelOpen(true)}
            className={`group btn absolute right-0 z-1 mt-5 mr-5 flex h-10 w-12 items-center justify-center rounded-xl border-2 btn-outline btn-primary ${
              showTutorial ? "relative" : ""
            }`}
          >
            <Plus strokeWidth={5} />
          </div>

          <div
            className={`absolute right-0 z-20 flex h-full w-96 bg-base-200 text-base-content transition-transform duration-300 ease-in-out ${
              isPanelOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {isPanelOpen && (
              <ContentTypesList
                onClose={() => setIsPanelOpen(false)}
                addSelectedComponent={addSelectedComponent}
              />
            )}
          </div>

          <div className="h-full w-full" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodeChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView={true}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeDragStart={nodeDragEnter}
              onNodeDragStop={nodeDragExit}
            >
              <Background />
              <MiniMap pannable={true} zoomable={true} />
              <Controls />
            </ReactFlow>
          </div>
        </div>
      </div>
      {unattendedComponent && (
        <div className="absolute z-50 flex h-screen w-screen items-center justify-center">
          <ComponentDetail
            node={unattendedComponent}
            onClose={() => setUnattendedComponent(undefined)}
          />
        </div>
      )}
    </>
  );
}
