import "reactflow/dist/style.css";

import { ComponentType, ContentType, EdgeType } from "../../types/Component";
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
import { useCallback, useRef, useState } from "react";
import Component from "./Component";
import ComponentDetail from "../ComponentDetail";
import ContentTypesList from "../ContentTypes/ContentTypesList";
import CustomEdge from "./EdgeComponent";
import { Plus } from "lucide-react";
import { useDnD } from "./DnDContext";
import { useLoading } from "../../pages/Workflow/LoadingContext";
import { useOpenComponent } from "./OpenComponentContext";
import { handleConn } from "./HandleConn";
import { MakeComponent } from "./MakeComponent";
import { HandleNodeDragExit } from "./HandleNodeDragExit";
import ButtonNode from "./ButtonNode";
import Tutorial from "./Tutorial";
import { useParams } from "react-router-dom";
import { WorkflowParams } from "../../pages/Workflow";

const nodeTypes = {
  component: Component,
  replyButton: ButtonNode,
};
const edgeTypes = { customEdge: CustomEdge };

export default function Flow() {
  const { botId } = useParams<WorkflowParams>();

  const plusButtonRef = useRef<HTMLDivElement>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [draggingNodeXY, setDraggingNodeXY] = useState<{
    x: number;
    y: number;
  }>({ x: -1, y: -1 });
  const [DraggingContentType] = useDnD();
  const [openComponent, setOpenComponent] = useOpenComponent();

  const flowInstance = useReactFlow();
  const [nodes, setNodes, onNodeChange] = useNodesState<ComponentType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<EdgeType>([]);
  const setLoading = useLoading();

  const { contentTypes } = useContentTypes(0);
  useBotSchema(flowInstance);

  const onConnect = useCallback(
    (connection: Edge | Connection) => {
      handleConn({
        botId,
        flowInstance,
        connection,
        contentTypes,
        setLoading,
      });
    },
    [flowInstance, contentTypes, setLoading, botId],
  );

  const makeNewComponent = useCallback(
    (content: ContentType, x?: number, y?: number) =>
      MakeComponent(flowInstance, content, setOpenComponent, x, y),
    [flowInstance, setOpenComponent],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!DraggingContentType) return;
      makeNewComponent(DraggingContentType, event.clientX, event.clientY);
    },
    [DraggingContentType, makeNewComponent],
  );

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
        <Tutorial
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
          setIsPanelOpen={setIsPanelOpen}
          plusButtonRef={plusButtonRef}
        />
      )}
      <div className="h-full w-full text-primary">
        <div className="relative h-full w-full bg-base-300">
          <div
            ref={plusButtonRef}
            onClick={() => setIsPanelOpen(true)}
            className={`group btn absolute top-4 right-4 z-1 btn-square btn-outline btn-primary ${
              showTutorial ? "relative" : ""
            }`}
          >
            <Plus className="size-6" />
          </div>

          <div
            className={`absolute inset-y-0 right-0 z-20 flex h-full w-96 bg-base-200 text-base-content transition-transform duration-300 ease-in-out ${
              isPanelOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <ContentTypesList
              onClose={() => setIsPanelOpen(false)}
              onSelect={makeNewComponent}
            />
          </div>

          <div className="h-full w-full">
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
      {openComponent && (
        <div className="absolute z-50 flex h-screen w-screen items-center justify-center">
          <ComponentDetail
            setNodes={setNodes}
            setEdges={setEdges}
            node={openComponent}
            onClose={() => setOpenComponent(undefined)}
          />
        </div>
      )}
    </>
  );
}
