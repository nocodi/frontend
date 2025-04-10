import { useCallback, useRef, useState } from "react";

import Component from "./Component";
import { ComponentType } from "../types/Component";
import ComponentList from "./ComponentList";

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

// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const nodeTypes = { customNode: Component };

function Flow() {
  // Component Panel
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Edges and Nodes
  const [nodes, setNodes, onNodeChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [component] = useDnD();

  const onConnect = useCallback(
    (connection: Edge | Connection) =>
      setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );

  const makeNewComponent = useCallback(
    (component: ComponentType, x?: number, y?: number) => {
      const position = screenToFlowPosition({
        x: x ?? window.innerWidth / 2,
        y: y ?? window.innerHeight / 2,
      });

      const newComponent = {
        id: `${component.id}`,
        type: "customNode",
        position: position,
        selected: false,
        data: component,
      };

      setNodes((nds) => nds.concat(newComponent));
    },
    [setNodes, screenToFlowPosition],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!component) {
        return;
      }

      makeNewComponent(component, event.clientX, event.clientY);
    },
    [component, makeNewComponent],
  );

  const addSelectedComponent = (component: ComponentType) => {
    makeNewComponent(component);
  };

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

        <div
          className={`absolute right-0 z-1 flex h-full w-67 bg-patina-300 transition-transform duration-400 ${
            isPanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {isPanelOpen && (
            <ComponentList
              onClose={() => setIsPanelOpen(false)}
              addSelectedComponent={addSelectedComponent}
            />
          )}
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
