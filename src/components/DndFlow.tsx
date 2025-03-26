import { useCallback, useRef, useState } from "react";

import NodeBox from "../components/NodeBox";

import ReactFlow, {
  useReactFlow,
  Edge,
  Connection,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";

import { DnDProvider, useDnD } from "../components/DnDContext";
import NodeListSidebar from "../components/NodeListSidebar";

const initialNodes = [
  {
    id: "1",
    type: "customNode",
    position: { x: 0, y: 0 },
    selected: false,
    data: { label: "Hi", type: "input" },
  },
  {
    id: "2",
    type: "customNode",
    position: { x: 150, y: 150 },
    selected: false,
    data: { label: "Middle", type: "input-output" },
  },
  {
    id: "3",
    type: "customNode",
    position: { x: 300, y: 300 },
    selected: false,
    data: { label: "Bye", type: "output" },
  },
];

let id: number = initialNodes.length + 1;
const getId = () => `${id++}`;

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const nodeTypes = { customNode: NodeBox };

function Flow() {
  // Node Panel
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Edges and Nodes
  const [nodes, setNodes, onNodeChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type: "customNode",
        position,
        selected: false,
        data: { label: `node ${id}`, type: type },
      };
      console.log("hi");
      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, type, setNodes],
  );

  return (
    <div className="h-full w-full">
      <div className="relative h-full w-full bg-patina-900">
        <div
          onClick={() => setIsPanelOpen(true)}
          className="group btn absolute right-0 z-1 mt-5 mr-5 flex h-10 w-12 items-center justify-center rounded-xl border-2 text-white btn-outline hover:border-accent"
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
              strokeWidth="5"
              d="M5 12h14m-7 7V5"
            />
          </svg>
        </div>
        <div className="relative">
          <NodeListSidebar
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
          />
        </div>
        <div
          className="h-full w-full rounded-lg border border-gray-700"
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodeChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            nodeTypes={nodeTypes}
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <Background />
            <MiniMap pannable={true} zoomable={true} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

function DnDFlow() {
  return (
    <ReactFlowProvider>
      <DnDProvider>
        <Flow />
      </DnDProvider>
    </ReactFlowProvider>
  );
}

export default DnDFlow;
