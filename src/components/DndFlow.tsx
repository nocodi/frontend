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
    [setEdges]
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
    [screenToFlowPosition, type, setNodes]
  );

  return (
    <div className="w-full h-full">
      <div className="w-full h-full bg-accent-content relative">
        <div
          onClick={() => setIsPanelOpen(true)}
          className="flex absolute z-1 right-0 items-center justify-center cursor-pointer w-12 h-10 border-2 rounded-xl mr-5 mt-5 hover:border-secondary group"
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white group-hover:text-secondary"
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
          className="w-full h-full border border-gray-700 rounded-lg"
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
